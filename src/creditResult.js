import React from "react";
import ReactDOM from "react-dom";
import "./creditResult.scss";
import "./assets/reset.scss";
import * as _ from "lodash";
import contactsApi from "./api/contacts/contacts";
import openH5Link from "./openH5Link";
import { getLink, getApi, getMenu } from "./linkConfig";
import { setH5Token, getH5Token } from "./loginToken";
import {
  NavBar,
  Icon,
  Toast,
  ActivityIndicator,
  Button,
  Modal,
} from "antd-mobile";

const alert = Modal.alert;
export default class CreditResult extends React.Component {

  // 授信成功页
  static displayName = "CreditResult";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      setPaymentPwd: false,
      animating: false
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.getDate();
      console.log(JSON.stringify(window.api.frames()))
    };
  }

  componentDidMount() {

  }

  refresh = () => {
    window.api.ajax( //刷新token
      {
        url: getLink() + getApi("updateToken"),
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Apptoken: window.localStorage.Apptoken
        },
        dataType: "json",
      },
      function (ret, err) {
        console.log(JSON.stringify(ret))
        if (ret.code === "200") {
          setH5Token(ret.data);
        }
      }
    )
  }

  getDate = () => {
    const that = this;
    that.refresh()
    window.api.ajax(
      {
        url: getLink() + getApi("creditApply"),
        method: "post",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
          Apptoken: window.localStorage.Apptoken
        },
        data: {
          body: {
            ip: returnCitySN["cip"],
            blackBox: window.localStorage.getItem('blackbox')
          }
        }
      },
      function (ret, err) {
        console.log("授信结果" + JSON.stringify(ret))
        that.setState({
          animating: false
        })
        if (ret.code === "200") {
          that.setState({
            setPaymentPwd: ret.data.setPaymentPwd
          });
        } else {
          if (err) {
            Toast.info("请求失败",3)
        
          } else {
            Toast.info(ret.message,3)

          }
        }
      }
    );

  };

  getOk = () => {
    console.log("是否有支付密码" + this.state.setPaymentPwd)
    if (this.state.setPaymentPwd === false) {
      alert('设置交易密码', <div><p>您尚未设置交易密码，</p><p>为了便于购机票、提现，</p><p>赶紧去设置吧</p></div>, [
        {
          text: '暂不设置', onPress: () => {
            window.api.openFrame({
              name: "index",
              url: "./index.html",
              rect: {
                w: "auto",
                marginTop: window.api.safeArea.top,
                marginBottom: window.api.safeArea.bottom
              },
              reload: true,
              useWKWebView: true,
              historyGestureEnabled: true
            });
            window.api.closeFrame({ name: "hnaIous" })
            window.api.closeFrame({ name: "idcardDiscern" })
            window.api.closeFrame({ name: "faceRecognition" })
            window.api.closeFrame({ name: "addBankCard" })
            window.api.closeFrame({ name: "addBankPhone" })
            window.api.closeFrame({ name: "addBankCardAuth" })
            window.api.closeFrame({ name: "creditInformation" })
            window.api.closeFrame({ name: "contactsAdd" })
            window.api.closeFrame({ name: "contactsAdds" })
            window.api.closeFrame({ name: "contactsList" })
            window.api.closeFrame({ name: "creditResult" })
          }
        },
        {
          text: '去设置', onPress: () => {
            this.toLink("设置支付密码");
            window.api.closeFrame({ name: "hnaIous" })
            window.api.closeFrame({ name: "idcardDiscern" })
            window.api.closeFrame({ name: "faceRecognition" })
            window.api.closeFrame({ name: "addBankCard" })
            window.api.closeFrame({ name: "addBankPhone" })
            window.api.closeFrame({ name: "addBankCardAuth" })
            window.api.closeFrame({ name: "creditInformation" })
            window.api.closeFrame({ name: "contactsAdd" })
            window.api.closeFrame({ name: "contactsAdds" })
            window.api.closeFrame({ name: "contactsList" })
            window.api.closeFrame({ name: "creditResult" })
          }
        },
      ]);
    } else {
      window.api.openFrame({
        name: "index",
        url: "./index.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        reload: true,
        useWKWebView: true,
        historyGestureEnabled: true
      });
      window.api.closeFrame({ name: "hnaIous" })
      window.api.closeFrame({ name: "idcardDiscern" })
      window.api.closeFrame({ name: "faceRecognition" })
      window.api.closeFrame({ name: "addBankCard" })
      window.api.closeFrame({ name: "addBankPhone" })
      window.api.closeFrame({ name: "addBankCardAuth" })
      window.api.closeFrame({ name: "creditInformation" })
      window.api.closeFrame({ name: "contactsAdd" })
      window.api.closeFrame({ name: "contactsAdds" })
      window.api.closeFrame({ name: "contactsList" })
      window.api.closeFrame({ name: "creditResult" })
    }
  }

  toLink = menuName => {
    const url = getMenu(menuName);
    const link = url + "?token=" + window.localStorage.h5Token + "&channel=cashLoanApp&setType=credit";
    openH5Link(link);
  };

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="creditResult"
        style={{ minHeight: "100%", backgroundColor: "#F9FAF9" }}
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
          海航白条
        </NavBar>
        <div style={{ height: "45px" }} />
        <div className="succeed">
          <img
            src={require("./assets/image/succeed.png")}
            alt=""
          />
          <h2>您的授信申请已提交</h2>
          <p>审核结果预计会在3个工作日内以短信形式发送给您，<br />您也可以通过“海航钱包”APP查询额度信息</p>
        </div>

        <Button className="next" onClick={this.getOk}>
          完成
        </Button>
        <ActivityIndicator toast animating={this.state.animating} />
        {this.state.animating&&<div className='loader_wrap'>
          <div className='loader_img'></div>
          <div className='loader_text'>加载中...</div>
        </div>}
      </div>
    );
  }
}
ReactDOM.render(<CreditResult />, document.getElementById("creditResult"));


