import React from "react";
import { Button, List, NavBar, Modal } from "antd-mobile";
import "antd-mobile/dist/antd-mobile.css";
import "./css/userInfo.scss";
import userInfoApi from "../../api/userInfo/userInfo";
import getMenu from "../../linkConfig";
import {
  getToken,
  clearToken,
  clearH5Token,
  getH5Token
} from "../../loginToken";
import openH5Link from "../../openH5Link";

const Item = List.Item;
const alert = Modal.alert;
export default class UserInfo extends React.Component {
  static displayName = "UserInfo";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      data: {
        points: "",
        status: "",
        seriesDay: "",
        cardNumber: "",
        nickname: ""
      },
      creidt: {},
      loginFlag: false,
      connectionFlag: false
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {
      // that.setState({
      //   ajax: window.api.ajax,
      //   closeFrame: window.api.closeFrame,
      //   openFrame: window.api.openFrame
      // });
      that.getDate();
    };
  }

  componentDidMount() {
    that.getDate();
  }

  shouldComponentUpdate() {}

  getDate = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: "http://ccs46.tunnel.onepaypass.com/app-api/points/check-status",
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function(ret, err) {
          if (ret) {
            that.setState({
              data: ret.data
            });
          } else {
            window.api.toast({
              msg: err,
              duration: 2000,
              location: "top"
            });
          }
        }
      );
      window.api.ajax(
        {
          url: "http://ccs46.tunnel.onepaypass.com/app-api/home/limit-display",
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function(ret, err) {
          if (ret) {
            that.setState({
              creidt: ret.data
            });
          } else {
            window.api.toast({
              msg: err,
              duration: 2000,
              location: "top"
            });
          }
        }
      );
    } else {
      userInfoApi.checkStatus().then(res => {
        if (res.data.code === "200") {
          that.setState({
            data: res.data.data
          });
        } else {
          res.data.message && Toast.fail(res.data.message, 1);
        }
      });
      userInfoApi.limitDisplay().then(res => {
        if (res.data.code === "200") {
          that.setState({
            creidt: res.data.data
          });
        } else {
          res.data.message && Toast.fail(res.data.message, 1);
        }
      });
      // }
    }
  };

  getuserInfo = () => {
    if (window.api) {
      window.api.openFrame({
        name: "login",
        url: "./login.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
    }
  };

  toLink = menuName => {
    const url = getMenu(menuName);
    const link = url + "?token=" + getH5Token() + "&channel=cashLoanApp";
    openH5Link(link);
  };

  toPaySet = () => {
    this.toLink("支付密码维护");
  };

  getTransaction = () => {
    this.state.openFrame({
      url:
        "https://hnhk.jbhloan.com/transactRecord/transaction-record.html?token=" +
        window.localStorage.Apptoken +
        "&channel=cashLoanApp",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  getMsgCenter = () => {
    this.state.openFrame({
      url:
        "https://hnhk.jbhloan.com/msgCenter/msgCenter.html?token=" +
        window.localStorage.Apptoken +
        "&channel=cashLoanApp",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  logOut = () => {
    alert("退出登录", "是否退出登录???", [
      {
        text: "退出登录",
        onPress: () => {
          clearToken(),
            clearH5Token(),
            window.api.openFrame({
              url: "./index.html",
              reload: true,
              rect: {
                w: "auto",
                marginTop: window.api.safeArea.top,
                marginBottom: window.api.safeArea.bottom
              },
              useWKWebView: true,
              historyGestureEnabled: true
            });
        }
      },
      { text: "返回", onPress: () => {} }
    ]);
  };

  render() {
    const data = this.state.data;
    return (
      <div className="my">
        <NavBar
          className="header"
          mode="light"
          rightContent={
            <img
              className="lindang-iconfont"
              onClick={() => this.toLink("公告列表")}
              src={require("../../assets/image/news.png")}
              alt=""
            />
          }
        >
          我的
        </NavBar>
        <div className="login">
          <div className="headPortrait">
            <img src={require("../../assets/image/login.png")} alt="" />
          </div>
          {window.localStorage.Apptoken !== "" ? (
            <div className="enter">
              <p onClick={() => this.toLink("个人设置")}>
                {this.state.data.nickname}
              </p>
              <span className="login-title">
                金鹏卡<span>{this.state.data.cardNumber}</span>
              </span>
            </div>
          ) : (
            <div className="enter">
              <p
                onClick={() => {
                  this.getuserInfo();
                }}
              >
                登陆/注册
              </p>
              <span className="login-title">
                最高授信<i>3,000,000.00</i>元
              </span>
            </div>
          )}
          <Button type="warning" className="sgin">
            签到
          </Button>
        </div>
        <div className="list">
          {window.localStorage.Apptoken === "" ? (
            <div className="ious">
              <div className="limit">
                <p>白条额度（元）</p>
                <span>0.00</span>
              </div>
              <div className="limit">
                <p>白条可用额度（元）</p>
                <span>0.00</span>
              </div>
            </div>
          ) : (
            <div className="ious">
              <div className="limit">
                <p>白条额度（元）</p>
                <span>{this.state.creidt.availableLimit}</span>
              </div>
              <div className="limit">
                <p>白条可用额度（元）</p>
                <span>{this.state.creidt.availableCashLimit}</span>
              </div>
            </div>
          )}
          <div>
            <List className="my-list">
              <Item arrow="horizontal" multipleLine onClick={() => {}}>
                <div className="size">
                  <img src={require("../../assets/image/critd.png")} alt="" />
                  <span>授信评估</span>
                </div>
              </Item>
              <Item
                arrow="horizontal"
                multipleLine
                onClick={this.getTransaction}
              >
                <div className="size" onClick={() => this.toLink("交易记录")}>
                  <img src={require("../../assets/image/deal.png")} alt="" />
                  <span>交易记录</span>
                </div>
              </Item>
              <Item arrow="horizontal" multipleLine onClick={() => {}}>
                <div className="size">
                  <img
                    src={require("../../assets/image/integral.png")}
                    alt=""
                  />
                  <span>我的积分</span>
                  {window.localStorage.Apptoken !== "" ? (
                    <i>{this.state.data.points}个积分</i>
                  ) : null}
                </div>
              </Item>
            </List>
            <div className="kong" />
            <List className="two-list">
              <Item arrow="horizontal" multipleLine onClick={() => {}}>
                <div className="size" onClick={() => this.toLink("银行卡维护")}>
                  <img
                    src={require("../../assets/image/bankcard.png")}
                    alt=""
                  />
                  <span>银行卡维护</span>
                </div>
              </Item>
              <Item arrow="horizontal" multipleLine onClick={this.toPaySet}>
                <div className="size">
                  <img src={require("../../assets/image/pay.png")} alt="" />
                  <span>支付设置</span>
                </div>
              </Item>
              <Item arrow="horizontal" multipleLine onClick={() => {}}>
                <div className="size">
                  <img src={require("../../assets/image/lock.png")} alt="" />
                  <span>安全设置</span>
                </div>
              </Item>
              <Item arrow="horizontal" multipleLine onClick={() => {}}>
                <div className="size">
                  <img src={require("../../assets/image/withwe.png")} alt="" />
                  <span>关于我们</span>
                </div>
              </Item>
              <Item arrow="horizontal" multipleLine onClick={() => {}}>
                <div className="size">
                  <img src={require("../../assets/image/hlpe.png")} alt="" />
                  <span>帮助中心</span>
                </div>
              </Item>
              <Item arrow="horizontal" multipleLine onClick={() => {}}>
                <div className="size">
                  <img src={require("../../assets/image/banben.png")} alt="" />
                  <span>版本更新</span>
                </div>
              </Item>
            </List>
            {window.localStorage.Apptoken !== "" ? (
              <div className="outlogin">
                <b onClick={this.logOut}>退出登录</b>
              </div>
            ) : null}
          </div>
        </div>
        <div style={{ height: "80px" }} />
      </div>
    );
  }
}
