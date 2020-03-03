import React from "react";
import ReactDOM from "react-dom";
import { NavBar, Icon, Toast, List, InputItem, Button } from "antd-mobile";
import { getShowTitle } from "./loginToken";
import { getLink, getApi, getMenu } from "./linkConfig";
import * as _ from "lodash";
import "./assets/reset.scss";
import "./addBankCardAuth.scss";

export default class AddBankCardAuth extends React.Component {
  static displayName = "AddBankCardAuth";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      ajax: null,
      disabled: true,
      downDisabled: true,
      deviceType: getShowTitle(),
      smsCode: "",
      timeText: "获取验证码",
      phone: "",
      detail: null,
      list: "",
      error: "",
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {
      
      that.setState({
        ajax: window.api.ajax,
        detail: window.api.pageParam.detail,
        list:
          window.api.pageParam.detail.bankName +
          " " +
          window.api.pageParam.detail.cardTypeName +
          " " +
          window.api.pageParam.detail.cardNo,
          phone: window.api.pageParam.phone,
          cardNo:window.api.pageParam.detail.cardNo
      },()=>{that.getCode()});
    };
  }

  authCode = () => {
    //验证码手机不能为空
    if (this.state.phone !== "" && this.state.smsCode !== "") {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };

  setPhone = value => {
    if (
      !/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
        value
      )
    ) {
      this.setState({
        hasError: true,
        phone: value,
        disabled: true,
        error: "请输入正确手机号！",
        downDisabled: true
      });
    } else {
      this.setState({
        hasError: false,
        error: "",
        phone: value,
        downDisabled: false
      });
      this.authCode();
    }
  };

  setCode = value => {
    this.setState(
      {
        smsCode: value
      },
      () => {
        this.authCode();
      }
    );
  };

  getCode = () => {
    let timeo = 60;
    let timeStop = setInterval(() => {
      timeo--;
      if (timeo > 0) {
        this.setState({
          timeText: timeo + "s",
          downDisabled: true
        });
      } else {
        timeo = 60; //当减到0时赋值为60
        this.setState({
          timeText: "重新发送",
          downDisabled: false
        });
        clearInterval(timeStop); //清除定时器
      }
    }, 1000);
    let data = {
      phone: this.state.phone,
      bankCardNo:this.state.cardNo
    };
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("preSign"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
          data: {
            body: data
          }
        },
        function(ret, err) {
          if (ret) {
          } else {
            Toast.info(err.message,3)
           
          }
        }
      );
    }
  };

  tiedCard = () => {
    const that = this;
    let data = {
      smsCode: this.state.smsCode,
      codeType: "BIND_CARD",
      bankCode: this.state.detail.bankCode,
      bankCardType: this.state.detail.cardTypeName,
      bankCard: this.state.detail.cardNo,
      phone: this.state.phone,
      isCredit: 1
    };
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("bindBankCard"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
          data: {
            body: data
          }
        },
        function(ret, err) {
          console.log(JSON.stringify(ret));
          if (ret.code === "200") {
            window.api.openFrame({
              name: "creditInformation",
              url: "./creditInformation.html",
              rect: {
                w: "auto",
                marginTop: window.api.safeArea.top,
                marginBottom: window.api.safeArea.bottom
              },
              useWKWebView: true,
              historyGestureEnabled: true
            })
            Toast.info("卡设置成功",4)
            
            
          } else {
            Toast.info(ret.message,4)
           
          }
        }
      );
    }
  };

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="addBankCardAuth"
        style={{ minHeight: "100%", backgroundColor: "#FFF" }}
      >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.goBack()}
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1,
            fontSize: "18px",
            color: "#333333"
          }}
        >
          添加银行卡
        </NavBar>
        <div style={{ height: "45px" }} />
        <List style={{ backgroundColor: "white" }} className="picker-list">
          <List.Item
            className="cardType"
            extra={this.state.list}
            arrow="horizontal"
          >
            卡类型
          </List.Item>
          <InputItem
            type="number"
            maxLength={11}
            name="phone"
            value={this.state.phone}
            onChange={this.setPhone}
            placeholder="请输入手机号"
          >
            手机号
          </InputItem>
          {this.state.error === "" ? null : (
            <p className="error">{this.state.error}</p>
          )}
          <InputItem
            className="bankCard"
            type="number"
            maxLength={6}
            name="smsCode"
            onChange={this.setCode}
            placeholder="请输入验证码"
          >
            短信验证码
            <Button
              className="coundDown"
              disabled={this.state.downDisabled}
              onClick={this.getCode}
            >
              {this.state.timeText}
            </Button>
          </InputItem>
        </List>
        <p className="caution">请和银行预留手机号保持一致</p>
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={() => {
            this.tiedCard();
          }}
        >
          下一步
        </Button>
      </div>
    );
  }
}
ReactDOM.render(
  <AddBankCardAuth />,
  document.getElementById("addBankCardAuth")
);
