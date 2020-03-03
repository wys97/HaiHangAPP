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
import "./setPassword.scss";
import "./assets/reset.scss";
import md5 from "js-md5";
import { getLink, getApi } from "./linkConfig";

class SetPassword extends React.Component {
  static displayName = "SetPassword";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      deviceType: getShowTitle(),
      list: [],
      points: "",
      disabled: true,
      visible: false,
      inputType: "password",
      passsword: "",
      error: "",
      hasError: false,
      type: false,
      skipNo: false,  //不现实跳过按钮
      btnText:'下一步',
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      let uid = window.api.pageParam.uid;
      if (uid) {
        that.setState({ skipNo: true, })
      } else {
        that.setState({ skipNo: false, })

      }
    };

  }

  componentDidMount() { }

  onVisible = () => {
    //密码是否可见
    if (this.state.visible === false) {
      this.setState({
        visible: true,
        inputType: null
      });
    } else {
      this.setState({
        visible: false,
        inputType: "password"
      });
    }
  };

  passwordOnChange = value => {
    if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/.test(value)) {
      this.setState({
        hasError: true,
        error: "密码必须是8-18位（不能全是数字或字母）",
        passsword: value,
        disabled: true,
        btnText:'下一步'
      });
    } else {
      this.setState({
        hasError: false,
        error: "",
        passsword: value,
        disabled: false,
        btnText:'完成'
      });
    }
  };

  goSkip = (value) => {
    const from = window.api.pageParam.from;
    const backtrack = window.api.pageParam.backtrack;
    let marginBottom = "";
    if (from === "userInfo") {
      marginBottom = window.api.safeArea.bottom + 50;
    } else {
      marginBottom = window.api.safeArea.bottom;
    }

    //退回   我的页面
    if (backtrack === 'securitySet' && from === 'userInfo') {
      window.api.closeFrame({ name: "securitySet" });
      window.api.closeFrame({ name: "setPassword" });
    } else {
      window.api.openFrame({
        name: from,
        url: "./" + from + ".html",
        reload: true,
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: marginBottom
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
      window.api.closeFrame({ name: "login" });
      window.api.closeFrame({ name: "setPassword" });
    }
  };


  succeed = () => {
    const uid = window.api.pageParam.uid;
    const from = window.api.pageParam.from;
    const setId = window.api.pageParam.setId;
    
    if (uid) {  //忘记密码  重置密码
      window.api.openFrame({
        name: 'login',
        url: "./login.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
      window.api.closeFrame({name:'userInfo'});
      window.api.closeFrame({name:'forgetPassword'});
      window.api.closeFrame({ name: "setPassword" });
  
    }else if(setId){ 
       //安全设置  设置密码
      window.api.closeFrame({ name: 'securitySet' });
      window.api.closeFrame({ name: "setPassword" });
    
    }else {  //验证码登录  设置密码
      window.api.openFrame({
        name: from,
        url: "./"+ from +".html",
        reload: true,
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom + 50
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
      window.api.closeFrame({ name: 'login' });
      window.api.closeFrame({ name: "setPassword" });
    }

  }


  next = () => {
    const that = this
    if (window.api.pageParam.uid) {
      window.api.ajax(
        {
          url: getLink() + getApi("passwordSetting"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
          data: {
            body: {
              loginPassword: md5(that.state.passsword).toUpperCase(),
              uid: window.api.pageParam.uid
            }
          }
        },
        function (ret, err) {
          if (ret.code === "200") {
            that.setState({
              type: true
            });
          } else {
            that.setState({
              type: false
            });
            if (err.msg !== "") {

              Toast.info(err.body.message,4)

            } else {
              Toast.info(ret.message,4)

      
            }
          }
        }
      );
    } else {
      window.api.ajax(
        {
          url: getLink() + getApi("loginPasswordSetting"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
          data: {
            body: {
              loginPassword: md5(that.state.passsword).toUpperCase(),
            }
          }
        },
        function (ret, err) {
          console.log(JSON.stringify(ret));
          if (ret.code === "200") {
            that.setState({
              type: true
            });
          } else {
            that.setState({
              type: false
            });
            Toast.info(ret.message,3)
     
          }
        }
      );
    }

  };

  goBack = () => {

    window.api.closeFrame({ name: "setPassword" });


  };


  render() {

    return (
      <div
        className="setPassword"
        style={{ minHeight: "100%", backgroundColor: "#fff" }}
      >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.goBack()}
          rightContent={
            !this.state.skipNo && <p key="0" onClick={() => { this.goSkip(1); }} style={{fontSize:'14px', color:'#585858'}} > 跳过</p>
          }
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1,
            fontSize: "18px",
            color: "#444D54",
            borderBottom: "1px solid #EFEFEF"
          }}
        >
          设置登录密码
        </NavBar>
        <div style={{ height: "45px" }} />
        {this.state.type === false ? (
          <List style={{ backgroundColor: "white" }} className="picker-list">
            <InputItem
              className="password"
              name="password"
              type={this.state.inputType}
              onChange={this.passwordOnChange}
              value={this.state.passsword}
              maxLength={18}
              placeholder="8-18位（不能全是数字或字母）"
            >
              设置登录密码
            </InputItem>
            {this.state.error === "" ? null : (
              <p className="error">{this.state.error}</p>
            )}
            <span className="visible" onClick={this.onVisible}>
              {this.state.visible === false ? (
                <img className="eye" src={require("./assets/image/Fill.png")} />
              ) : (
                  <img
                    className="eye"
                    src={require("./assets/image/yanjing.png")}
                  />
                )}
            </span>
          </List>
        ) : (
            <div className="succeed">
              <img src={require("./assets/image/succeed.png")} alt="" />
              <p>密码设置成功</p>
            </div>
          )}
        {this.state.type === false ? (
          <Button
            disabled={this.state.disabled}
            className="next"
            onClick={() => {
              this.next();
            }}
          >
            {this.state.btnText}
          </Button>
        ) : (
            <Button
              disabled={this.state.disabled}
              className="next"
              onClick={() => {
                this.succeed();
              }}
            >
              完成
          </Button>
          )}
      </div>
    );
  }
}

ReactDOM.render(<SetPassword />, document.getElementById("setPassword"));
