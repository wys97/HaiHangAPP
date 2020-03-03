import React from "react";
import ReactDOM from "react-dom";
import { getShowTitle } from "./loginToken";
import {
  Button,
  Flex,
  Icon,
  InputItem,
  List,
  NavBar,
  Toast,
  Modal
} from "antd-mobile";
import * as _ from "lodash";
import "./forgetPassword.scss";
import "./assets/reset.scss";
import { getLink, getApi } from "./linkConfig";

class ForgetPassword extends React.Component {
  static displayName = "ForgetPassword";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      deviceType: getShowTitle(),
      disabled: true,
      phone: "",
      error: "",
      type: "set",
      timeText: "",
      smsCode: "",
      identityNo: "",
      downDisabled: true,
      uid: ""
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {};
  }

  componentDidMount() {}

  phoneChange = value => {
    //手机号验证
    if(value.replace(/\s/g, '').length < 11) {
      this.setState({
        error: "请输入正确手机号！",
        disabled: true,
        phone: value
      });
    } else {
      this.setState({
        error: "",
        phone: value,
        disabled: false
      });
    }
  };

  identityNoChange = value => {
    if (value.length === 18) {
      this.setState({
        identityNo: value,
        disabled: false
      });
    } else {
      this.setState({
        identityNo: value,
        disabled: true
      });
    }
  };

  next = () => {
    //输入手机号下一步
    this.setState({
      type: "authCode",
      disabled: true,
      phone: this.state.phone.replace(/\s/g, '')
    });
    this.getCode();
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
      type: "RESET_PWD"
    };
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("sendCode"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            body: data
          }
        },
        function(ret, err) {
          if (ret) {
          } else {
            if (err.msg !== "") {
              Toast.info(err.body.message,4)
           
            } else {
              Toast.info(ret.message,4)

            }
          }
        }
      );
    }
  };

  setCode = value => {
    //是否输入验证码
    if (value) {
      this.setState({
        smsCode: value,
        disabled: false
      });
    } else {
      this.setState({
        smsCode: value,
        disabled: true
      });
    }
  };

  authCode = () => {
    let from = window.api.pageParam.from;
    const that = this;
    let data = {
      phone: this.state.phone.replace(/\s/g, ''),
      type: "RESET_PWD",
      smsCode: this.state.smsCode
    };
    window.api.ajax(
      {
        url: getLink() + getApi("vaildCmsCode"),
        method: "post",
        dataType: "json",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          body: data
        }
      },
      function(ret, err) {
        console.log(JSON.stringify(ret));
        if (ret.code === "200") {
          if (ret.data.identityAuth === true) {
            that.setState({
              type: "idCard",
              disabled: true,
              uid: ret.data.uid
            });
          } else {
            window.api.openFrame({
              name: "setPassword",
              url: "./setPassword.html",
              rect: {
                w: "auto",
                marginTop: window.api.safeArea.top,
                marginBottom: window.api.safeArea.bottom
              },
              useWKWebView: true,
              historyGestureEnabled: true,
              pageParam: {
                from: from,
                uid: ret.data.uid,
      
              }
            });
          }
          
        } else {
          if (err.msg !== "") {
            Toast.info(err.body.message,4)
         
          } else {
            Toast.info(ret.message,4)
           
          }
        }
      }
    );
  };

  idCard = () => {
    const that = this;
    const from = window.api.pageParam.from;
    window.api.ajax(
      {
        url: getLink() + getApi("verifyIdentity"),
        method: "post",
        dataType: "json",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          body: {
            uid: that.state.uid,
            identityNo: that.state.identityNo
          }
        }
      },
      function(ret, err) {
        console.log(JSON.stringify(ret));
        if (ret.code === "200") {
          window.api.openFrame({
            name: "setPassword",
            url: "./setPassword.html",
            rect: {
              w: "auto",
              marginTop: window.api.safeArea.top,
              marginBottom: window.api.safeArea.bottom
            },
            useWKWebView: true,
            historyGestureEnabled: true,
            pageParam: {
              from: from,
              uid: ret.data.uid,
             
            }
          });
        } else {
          if (err.msg !== "") {
            Toast.info(err.body.message,4)
      
          } else {
            Toast.info(ret.message,4)

          }
        }
      }
    );
  };

  goBack = () => {
    //返回
    const from = window.api.pageParam.from;
    if (window.api) {
      window.api.closeFrame({ name: "forgetPassword" });
    }
  };

  render() {
    return (
      <div
        className="forgetPassword"
        style={{ minHeight: "100%", backgroundColor: "#fff" }}
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
          重置登录密码
        </NavBar>
        <div style={{ height: "45px" }} />
        {this.state.type === "set" ? (
          <div className="set">
            <List style={{ backgroundColor: "white" }}>
              <InputItem
                className="phone"
                name="phone"
                type='phone'
                onChange={this.phoneChange}
                value={this.state.phone}
                // maxLength={11}
                clear
                placeholder="请输入登录用的手机号"
              >
                手机号
              </InputItem>
            </List>
            {this.state.error === "" ? null : (
              <p className="error">{this.state.error}</p>
            )}
            <Button
              disabled={this.state.disabled}
              className="next"
              onClick={() => {
                this.next();
              }}
            >
              下一步
            </Button>
          </div>
        ) : this.state.type === "authCode" ? (
          <div className="authCode">
            <List style={{ backgroundColor: "white" }}>
              <p>验证码会发送至{this.state.phone}</p>
              <InputItem
                className="bankCard"
                type="number"
                maxLength={6}
                name="smsCode"
                onChange={this.setCode}
                placeholder="请输入短信验证码"
              >
                <Button
                  className="coundDown"
                  disabled={this.state.downDisabled}
                  onClick={this.getCode}
                >
                  {this.state.timeText}
                </Button>
              </InputItem>
              <Button
                disabled={this.state.disabled}
                className="next"
                onClick={() => {
                  this.authCode();
                }}
              >
                下一步
              </Button>
            </List>
          </div>
        ) : this.state.type === "idCard" ? (
          <div className="idCard">
            <List style={{ backgroundColor: "white" }}>
              <InputItem
                className="identityNo"
                name="identityNo"
                type={this.state.inputType}
                onChange={this.identityNoChange}
                value={this.state.identityNo}
                maxLength={18}
                clear
                placeholder="请输入身份证号码"
              >
                身份证
              </InputItem>
            </List>
            <Button
              disabled={this.state.disabled}
              className="next"
              onClick={() => {
                this.idCard();
              }}
            >
              下一步
            </Button>
          </div>
        ) : (
          <div>
            <div className="succeed">
              <img src={require("./assets/image/succeed.png")} alt="" />
              <p>密码设置成功</p>
            </div>
            <Button
              disabled={this.state.disabled}
              className="next"
              onClick={() => {
                this.next();
              }}
            >
              完成
            </Button>
          </div>
        )}
      </div>
    );
  }
}

ReactDOM.render(<ForgetPassword />, document.getElementById("forgetPassword"));
