import React from "react";
import ReactDOM from "react-dom";

import {
  TabBar,
  Carousel,
  Toast,
  Modal,
  NavBar,
  Button,
  PullToRefresh
} from "antd-mobile";
import "antd-mobile/dist/antd-mobile.css";
import { getLink, getApi, getMenu, ticketOffice } from "./linkConfig";
import { getH5Token, setH5Token, clearToken, clearH5Token } from "./loginToken";
import homeApi from "./api/home/home";
// import Homer from "./nav/home/homer";
// import UserInfo from "./nav/userInfo/userInfo";
import "./assets/reset.scss";
import "./index.scss";
import "./nav/home/home.scss";
import openH5Link from "./openH5Link";
import protocol from "./common/protocol/protocol.js";

const alert = Modal.alert;
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "home",
      hidden: false,
      openFrame: null,
      closeFrame: null,
      ajax: null,
      refreshing: false,
      slideshow: ["upOnline", "discount"],
      notice: "notice",
      noticeList: [],
      slideIndex: 0,
      creidt: {},
      privacyPolicy: "", //隐私协议状态
      declare: false, //隐私详情
      showProtocol: false, //海航白条服务协议
      height: document.documentElement.clientHeight,
      permissionList: null,
      requestPermission: null,
      display: { display: "block" },
      speech: ["欢迎使用海航钱包", "世界那么大 想去看看", "白条在手 说走就走"], //欢迎语数据
      ticket: false, //买机票模块
      autoplay: true //公告栏是否轮播
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {
      that.getNoticeBoard();
      if (window.api.pageParam.isToken === false) {
        window.api.rmStorage("Apptoken");
        window.api.rmStorage("h5Token");
      }
    };
    //设置初始隐私协议状态
    let privacyPolicy =
      window.localStorage.getItem("privacyPolicy") !== undefined ||
      window.localStorage.getItem("privacyPolicy") !== ""
        ? window.localStorage.getItem("privacyPolicy")
        : window.localStorage.setItem("privacyPolicy", "false");

    that.setState({
      privacyPolicy
    });
  }
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    setTimeout(
      () =>
        this.setState({
          height: hei
        }),
      0
    );
    homeApi.noticeShowtop().then(res => {
      if (res.data.code === "200") {
        this.setState({
          noticeList: res.data.data,
          slideIndex: res.data.data.length - 1,
          notice: "notice"
        });
      }
    });
  }

  refresh = () => {
    window.api.ajax(
      //刷新token
      {
        url: getLink() + getApi("updateToken"),
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Apptoken: window.localStorage.Apptoken
        },
        dataType: "json"
      },
      function(ret, err) {
        console.log(JSON.stringify(ret));
        if (ret.code === "401") {
          clearToken();
          clearH5Token();
        }
        if (ret.code === "200") {
          setH5Token(ret.data);
        }
      }
    );
  };

  getNoticeBoard = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("noticeShowto"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json"
          }
        },
        function(ret, err) {
          console.log(JSON.stringify(ret));
          if (ret.code === "200") {
            if (ret.data.length !== 0) {
              that.setState({
                noticeList: ret.data,
                slideIndex: ret.data.length - 1,
                notice: "notice"
              });
            } else {
              that.setState({
                noticeList: ret.data,
                slideIndex: ret.data.length - 1,
                notice: "notice-disable"
              });
            }
          } else {
            that.setState({
              notice: "notice-disable"
            });
          }
        }
      );
      window.api.ajax(
        {
          url: getLink() + getApi("limitDisplay"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function(ret, err) {
          if (ret.code === "401") {
            clearToken();
            clearH5Token();
          }
          console.log(JSON.stringify(ret));
          if (ret.code === "200") {
            that.setState({
              creidt: ret.data,
              refreshing: false
            });
          } else {
            that.setState({
              creidt: {
                availableCashLimit: "",
                availableLimit: "",
                cashCreditStatus: "NOCREDIT"
              }
            });
          }
        }
      );
      this.refresh();
    }
  };

  toLink = menuName => {
    this.refresh();
    const url = getMenu(menuName);
    const link = url + "?token=" + getH5Token() + "&channel=cashLoanApp";
    openH5Link(link);
    console.log("h5Url:" + link);
  };

  toLinkh5 = menuName => {
    this.refresh();
    const url = getMenu(menuName);
    const link = url + "?token=" + getH5Token() + "&channel=cashLoanApp";
    if (window.api) {
      window.api.openFrame({
        name: "getReturn",
        url: "widget://implant-h5.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom + 49
        },
        pageParam: {
          link: link,
          marginBottom: window.api.safeArea.bottom + 49
        },
        bgColor: "#ffffff",
        useWKWebView: true,
        historyGestureEnabled: true
      });
    } else {
      window.open(link);
    }
  };

  refund = () => {
    if (window.localStorage.Apptoken !== "") {
      let cashCreditStatus = this.state.creidt.cashCreditStatus;
      if (this.state.type !== "repayment") {
        if (cashCreditStatus === "" || cashCreditStatus === "NOCREDIT") {
          window.api.closeFrame({ name: "userInfo" });
          window.api.closeFrame({ name: "getReturn" });
          // window.api.closeFrame({ name: "h5" });
          window.api.openFrame({
            name: "home",
            url: "./index.html",
            rect: {
              w: "auto",
              marginTop: window.api.safeArea.top,
              marginBottom: window.api.safeArea.bottom
            }
            // reload: true
          });
          this.setState({
            type: "repayment",
            display: { display: "block" }
          });
        } else {
          this.toLinkh5("还款");
          this.setState({
            type: "repayment",
            display: { display: "none" }
          });
          window.api.closeFrame({ name: "userInfo" });
        }
      }
    } else {
      if (this.state.type === "home") {
        this.setState({
          type: "home"
        });
        this.toLogin();
        window.api.closeFrame({ name: "userInfo" });
      } else {
        window.api.openFrame({
          url: "./login.html",
          name: "login",
          rect: {
            w: "auto",
            marginTop: window.api.safeArea.top,
            marginBottom: window.api.safeArea.bottom
          },
          useWKWebView: true,
          historyGestureEnabled: true,
          pageParam: {
            from: "userInfo"
          }
        });
        this.setState({
          type: "userInfo"
        });
        // window.api.closeFrame({ name: "userInfo" });
      }
    }
  };

  openPage = () => {
    window.api.openFrame({
      name: "userInfo",
      url: "./userInfo.html",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom + 50
      },
      // reload: true,
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  toLogin = () => {
    window.api.openFrame({
      url: "./login.html",
      name: "login",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true,
      pageParam: {
        from: "index"
      }
    });
  };

  liftingAmount = () => {
    if (window.localStorage.Apptoken !== "") {
      let cashCreditStatus = this.state.creidt.cashCreditStatus;
      if (cashCreditStatus === "" || cashCreditStatus === "NOCREDIT") {
        alert("未授信", "若需使用此功能，请先进行授信", [
          { text: "取消", onPress: () => {} },
          {
            text: "去授信",
            onPress: () => {
              this.gocredit();
            }
          }
        ]);
      } else if (cashCreditStatus === "CREDIT_ING") {
        this.audit();
      } else if (cashCreditStatus === "CREDIT_FAILED") {
        this.creditFailure();
      } else {
        this.refresh();
        this.toLink("提额");
      }
    } else {
      this.toLogin();
    }
  };

  goNotice = (key, title) => {
    if (window.localStorage.Apptoken !== "") {
      this.refresh();
      const url = getMenu("公告详情");
      const link =
        url +
        "?token=" +
        getH5Token() +
        "&channel=cashLoanApp" +
        "&id=" +
        key +
        "&pageTitle=" +
        title;
      openH5Link(link);
    } else {
      this.toLogin();
    }
  };

  goRateCalc = () => {
    this.refresh();
    window.api.openFrame({
      url: "./rateCalc.html",
      name: "rateCalc",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  creditLimit = () => {
    if (this.state.creidt.availableCashLimit <= 900) {
      alert("", "最低提现金额1000元", [
        { text: "确定", onPress: () => {} },
        {
          text: "去提额",
          onPress: () => {
            this.toLink("提额");
          }
        }
      ]);
    } else {
      this.toLink("支用");
    }
  };

  gocredit = () => {
    this.refresh();
    window.api.openFrame({
      url: "./hnaIous.html",
      name: "hnaIous",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  creidtDetail = () => {
    this.refresh();
    window.api.openFrame({
      url: "./amountDetail.html",
      name: "amountDetail",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  creditExpired = () => {
    alert("", "您的授信已过期重新授信后额度可提现及购买机票", [
      { text: "取消", onPress: () => {} },
      { text: "去授信", onPress: () => this.gocredit()}
    ]);
  };

  disabled = () => {
    alert(
      "购买机票",
      <p>
        很抱歉，您的海航白条授信额度被冻结，有任何疑问请致电客服
        <i onClick={() => this.call()} style={{ color: "#0070C0" }}>
          950718
        </i>
      </p>,
      [{ text: "确定", onPress: () => {} }]
    );
  };

  call = () => {
    window.api.call({
      type: "tel_prompt",
      number: "950718"
    });
  };

  audit = () => {
    alert("", "海航白条授信审核中", [{ text: "知道了", onPress: () => {} }]);
  };

  creditFailure = () => {
    window.api.openFrame({
      url: "./creditFailure.html",
      name: "creditFailure",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  //买机票模块、
  airTicket = () => {
    window.api.openFrame({
      url: "./airTicket.html",
      name: "airTicket",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };
  //跳转到白条介绍
  whiteStrip = () => {
    window.api.openFrame({
      url: "./whiteStrip.html",
      name: "whiteStrip",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  //我的优惠券
  coupon = () => {
    window.api.openFrame({
      url: "./coupon.html",
      name: "coupon",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  //邀请好友
  invite = () => {
    window.api.openFrame({
      url: "./invite.html",
      name: "invite",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  //不同意按钮
  disagree = () => {
    window.localStorage.setItem("privacyPolicy", "false");
    this.setState({ privacyPolicy: "false" });
    this.exitApp();
  };

  //退出app
  exitApp = () => {
    window.api.closeWidget({
      id: "A6025238071881", //这里改成自己的应用ID

      retData: { name: "closeWidget" },

      silent: true
    });
  };

  //打开浏览器
  openApp = () => {
    window.api.openApp(
      {
        androidPkg: "android.intent.action.VIEW",
        mimeType: "text/html",
        uri: ticketOffice(),
        iosUrl: ticketOffice()
      },
      function(ret, err) {
        console.log(JSON.stringify(ret));
        if (ret.msg === "未找到可执行的应用") {
          console.log(333333333333);
        }
        if (err) {
          //有报错
          window.api.openWin({
            name: "海南航空",
            url: ticketOffice(),
            rect: {
              x: 0,
              y: 0
            }
          });
        }
      }
    );
  };

  render() {
    //欢迎语
    let speech = this.state.speech[
      Math.floor(Math.random() * this.state.speech.length)
    ];

    //买机票模块
    let ticket = (
      <div className="ticketModel">
        <div className="ticket_content">
          <div className="title">购买机票</div>
          <div className="content">
            请前往海南航空APP购买机票，支付时选择使用【海航白条】，即可用授信额度支付
          </div>
          <div className="btn_wrap">
            <button
              className="btn"
              onClick={() => this.setState({ ticket: false })}
            >
              取消
            </button>
            <button className="btn2" onClick={this.openApp}>
              买机票
            </button>
          </div>
        </div>
      </div>
    );

    //首页 海航钱包用户弹框
    let privacyPolicy = (
      <div className="privacyPolicy">
        <div className="privacyPolicy_wrap">
          <div className="privacyPolicy_title">亲爱的海航钱包用户</div>
          <div className="privacyPolicy_content">
            感谢您使用海航钱包！我们非常重视您的个人信息和隐私保护。为了更好地保障您的个人权利，
            在您使用我们的产品前，请您认真阅读
            <span
              className="privacyPolicy_details"
              onClick={() => this.setState({ declare: true })}
            >
              《海航钱包隐私协议》、
            </span>
            <span
              className="privacyPolicy_details"
              onClick={() => this.setState({ showProtocol: true })}
            >
              《海航钱包服务协议》
            </span>
            的全部内容，同意并接受全部条款后开始使用我们的产品和服务。我们会严格按照政策内容使用和保护您的个人信息，感谢您的信任。
          </div>
          <div className="btn_wrap">
            <div onClick={this.disagree} className="privacyPolicy_no_btn">
              不同意
            </div>
            <div
              onClick={() => {
                window.localStorage.setItem("privacyPolicy", "true");
                this.setState({ privacyPolicy: "true" });
              }}
              className="privacyPolicy_btn"
            >
              同意
            </div>
          </div>
        </div>

        {/* 《隐私声明》 详情*/}
        <Modal
          popup
          title="海航钱包用户隐私协议"
          visible={this.state.declare}
          closable
          maskClosable
          animationType="slide-up"
          onClose={() => {
            this.setState({ declare: false });
          }}
        >
          {protocol.privacyProtocol}
        </Modal>
        {/* 《海航白条服务协议》 详情*/}
        <Modal
          popup
          title="海航钱包服务协议"
          visible={this.state.showProtocol}
          closable
          maskClosable
          animationType="slide-up"
          onClose={() => {
            this.setState({ showProtocol: false });
          }}
        >
          {protocol.serviceProtocol}
        </Modal>
      </div>
    );

    return (
      <div style={{ height: "100%" }}>
        <div className="tab">
          <TabBar
            unselectedTintColor="#848484"
            tintColor="#E1514C"
            barTintColor="white"
            tabBarPosition="bottom"
            hidden={this.state.hidden}
          >
            <TabBar.Item
              title="首页"
              key="home"
              icon={
                <img
                  className="tabicon"
                  src={require("./assets/image/home.png")}
                  alt=""
                />
              }
              selectedIcon={
                <img
                  className="tabicon"
                  src={require("./assets/image/homeclick.png")}
                  alt=""
                />
              }
              selected={this.state.type === "home"}
              onPress={() => {
                window.api.closeFrame({ name: "userInfo" });
                window.api.closeFrame({ name: "getReturn" });
                window.api.closeFrame({ name: "h5" });
                window.api.openFrame({
                  name: "home",
                  url: "./index.html",
                  rect: {
                    w: "auto",
                    marginTop: window.api.safeArea.top,
                    marginBottom: window.api.safeArea.bottom
                  }
                  // reload: true
                });
                this.getNoticeBoard();
                this.setState({
                  type: "home"
                });
              }}
            >
              <div className="home">
                <PullToRefresh
                  damping={60}
                  ref={el => (this.ptr = el)}
                  refreshing={this.state.refreshing}
                  style={{
                    height: this.state.height,
                    overflow: "auto"
                  }}
                  onRefresh={() => {
                    this.getNoticeBoard();
                  }}
                >
                  <div className="headers">{speech}</div>
                  <div className={this.state.notice}>
                    <img
                      className="news"
                      src={require("./assets/image/lingdang.png")}
                      alt=""
                    />
                    <Carousel
                      className="notice-board"
                      vertical
                      dots={false}
                      dragging={false}
                      swiping={false}
                      // autoplay={this.state.autoplay}
                      infinite
                      selectedIndex={this.state.slideIndex}
                    >
                      {this.state.noticeList.map((item, index) => (
                        <div
                          className="v-item"
                          key={index}
                          onClick={() => {
                            this.goNotice(item.noticeId, item.noticeTitle);
                          }}
                        >
                          {item.noticeTitle}
                        </div>
                      ))}
                    </Carousel>
                    <img
                      className="close"
                      src={require("./assets/image/guanbi.png")}
                      onClick={() => {
                        this.setState({ notice: "notice-disable" });
                      }}
                      alt=""
                    />
                  </div>
                  {window.localStorage.Apptoken === "" ? ( //未登录状态
                    <div className="creditInformation">
                      <p className="creditInformation-header">
                        海航白条最高可提现额度
                      </p>
                      <p className="creditInformation-sum">￥3,000,000.00</p>
                      <i onClick={this.toLogin}>立即提现</i>
                      <span className="creditInformation-title">
                        <img
                          src={require("./assets/image/airTicket.png")}
                          alt=""
                        />
                        <p>借1千元日费用最低至3毛</p>
                      </span>
                    </div>
                  ) : this.state.creidt.cashCreditStatus === "ENABLED" ? (
                    <div className="creditInformation">
                      <p className="creditInformation-header-enabled">
                        海航白条最高可提现额度
                      </p>
                      <p
                        className="creditInformation-sum"
                        onClick={this.creidtDetail}
                      >
                        ￥{this.state.creidt.availableCashLimit}
                      </p>
                      {this.state.creidt.isCashCredit === "PASSED" ? ( //已授信状态
                        <p
                          className="creditInformation-limit"
                          onClick={this.creidtDetail}
                        >
                          可用总额度
                          <span>{this.state.creidt.availableLimit}</span>
                          元&nbsp;（可买机票）
                        </p>
                      ) : (
                        <p
                          className="creditInformation-limit"
                          onClick={this.creidtDetail}
                        >
                          可用总额度
                          <span>{this.state.creidt.availableLimit}</span>元
                        </p>
                      )}
                      <i className="enabled-i" onClick={this.creditLimit}>
                        立即提现
                      </i>
                      <span className="creditInformation-title">
                        <img
                          src={require("./assets/image/airTickets.png")}
                          alt=""
                        />
                        <p>
                          借1千元日费用低至
                          {this.state.creidt.dailyPaymentStr}
                        </p>
                      </span>
                    </div>
                  ) : this.state.creidt.cashCreditStatus === "DISABLED" ? ( //冻结状态
                    <div className="creditInformation">
                      <div className="freeze">冻结</div>
                      <p className="creditInformation-header">
                        海航白条可提现额度
                      </p>
                      <p className="creditInformation-sum">
                        ￥{this.state.creidt.availableCashLimit}
                      </p>
                      {this.state.creidt.isCashCredit === "PASSED" ? (
                        <p className="creditInformation-limit">
                          可用总额度
                          <span>{this.state.creidt.availableLimit}</span>
                          元&nbsp;（可买机票）
                        </p>
                      ) : (
                        <p className="creditInformation-limit">
                          可用总额度
                          <span>{this.state.creidt.availableLimit}</span>元
                        </p>
                      )}
                      <i onClick={this.disabled}>立即提现</i>
                      <span className="creditInformation-title">
                        <img
                          src={require("./assets/image/airTickets.png")}
                          alt=""
                        />
                        <p>
                          借1千元日费用低至
                          {this.state.creidt.dailyPaymentStr}
                        </p>
                      </span>
                    </div>
                  ) : this.state.creidt.cashCreditStatus === "OVERDUE" ? ( //授信过期状态
                    <div className="creditInformation">
                      <img
                        className="img"
                        src={require("./assets/image/creditexpired.png")}
                      />
                      <p className="creditInformation-creditExpired">
                        您的海航白条授信已过期，请重新授信
                      </p>
                      <i onClick={this.creditExpired}>去授信</i>
                      <span className="creditInformation-creditExpiredtitle">
                        最高可提现额度<b>3,000,000.00</b>元
                      </span>
                    </div>
                  ) : this.state.creidt.cashCreditStatus === "CREDIT_ING" ? ( //审核中
                    <div className="creditInformation">
                      <div className="freeze">审核中</div>
                      <p className="creditInformation-header">
                        海航白条最高可提现额度
                      </p>
                      <p className="creditInformation-sum">￥3,000,000.00</p>
                      <i onClick={this.audit}>立即提现</i>
                      <span className="creditInformation-title">
                        借1千元日费用最低至3毛
                      </span>
                    </div>
                  ) : this.state.creidt.cashCreditStatus === "CREDIT_FAILED" ? ( //授信失败
                    <div className="creditInformation">
                      <p className="creditInformation-header">
                        海航白条最高可提现额度
                      </p>
                      <p className="creditInformation-sum">￥3,000,000.00</p>
                      <i onClick={this.creditFailure}>立即提现</i>
                      <span className="creditInformation-title">
                        借1千元日费用最低至3毛
                      </span>
                    </div>
                  ) : (
                    //未授信状态
                    <div className="creditInformation">
                      <p className="creditInformation-header">
                        海航白条最高可提现额度
                      </p>
                      <p className="creditInformation-sum">￥3,000,000.00</p>
                      {this.state.creidt.isCashCredit === "PENDING" ? (
                        <i onClick={this.audit}>立即提现</i>
                      ) : (
                        <i onClick={this.gocredit}>去授信</i>
                      )}

                      <span className="creditInformation-title">
                        借1千元日费用最低至3毛
                      </span>
                    </div>
                  )}
                  <div className="airlineTicket">
                    <ul>
                      <li>
                        {/* <div onClick={this.airTicket}> */}
                        <div onClick={() => this.setState({ ticket: true })}>
                          <img
                            src={require("./assets/image/airlineticket.png")}
                            alt=""
                          />
                          <p>买机票</p>
                        </div>
                      </li>
                      <li>
                        <div onClick={this.liftingAmount}>
                          <img
                            src={require("./assets/image/quickallowed.png")}
                            alt=""
                          />
                          <p>快速提额</p>
                        </div>
                      </li>
                      <li>
                        <div onClick={this.goRateCalc}>
                          <img
                            src={require("./assets/image/ratecalculation.png")}
                            alt=""
                          />
                          <p>费率计算</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="banner">
                    <Carousel autoplay infinite>
                      {this.state.slideshow.map(val => (
                        <a key={val} href="#">
                          <img
                            src={require(`./assets/image/${val}.png`)}
                            alt=""
                          />
                        </a>
                      ))}
                    </Carousel>
                  </div>
                  <div className="welfare">
                    <h2>福利专区</h2>
                    <div className="welfare-title">
                      <ul>
                        <li onClick={this.coupon}>
                          <img
                            src={require("./assets/image/mycoupon.png")}
                            alt=""
                          />
                        </li>
                        <li onClick={this.invite}>
                          <img
                            src={require("./assets/image/invitefriends.png")}
                            alt=""
                          />
                        </li>
                        <li onClick={this.whiteStrip}>
                          <img
                            src={require("./assets/image/whitentroduced.png")}
                            alt=""
                          />
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div style={{ height: "80px" }} />
                </PullToRefresh>
              </div>
            </TabBar.Item>
            <TabBar.Item
              icon={
                <img
                  className="tabicon"
                  src={require("./assets/image/hongbao.png")}
                  alt=""
                />
              }
              selectedIcon={
                <img
                  className="tabicon"
                  src={require("./assets/image/hongbaoclick.png")}
                  alt=""
                />
              }
              title="还款"
              key="repayment"
              selected={this.state.type === "repayment"}
              onPress={() => {
                this.refund();
                this.getNoticeBoard();
              }}
            >
              <div className="repayment" style={{ backgroundColor: "#FFF" }}>
                <div
                  style={{
                    height: "45px",
                    textAlign: "center",
                    fontSize: "18px",
                    color: "#333333",
                    borderBottom: "1px solid #EFEFEF",
                    lineHeight: "45px"
                  }}
                >
                  还款
                </div>
                <div style={this.state.display}>
                  <img
                    src={require("./assets/image/quickallowed.png")}
                    alt=""
                  />
                  <p>查看还款信息请先进行授信</p>
                  <Button
                    className="next"
                    onClick={() => {
                      this.gocredit();
                      this.setState({
                        type: "home"
                      });
                    }}
                  >
                    去授信
                  </Button>
                </div>
              </div>
            </TabBar.Item>
            <TabBar.Item
              icon={
                <img
                  className="tabicon"
                  src={require("./assets/image/mypage.png")}
                  alt=""
                />
              }
              selectedIcon={
                <img
                  className="tabicon"
                  src={require("./assets/image/mypageclick.png")}
                  alt=""
                />
              }
              title="我的"
              key="my"
              selected={this.state.type === "userInfo"}
              onPress={() => {
                this.openPage();
                window.api
                  ? (window.api.closeFrame({ name: "getReturn" }),
                    window.api.closeFrame({ name: "h5" }))
                  : null;
                this.setState({
                  type: "userInfo"
                });
              }}
            >
              <div style={{ height: "100%" }} />
            </TabBar.Item>
          </TabBar>
        </div>
        {window.localStorage.privacyPolicy !== "true" && privacyPolicy}
        {this.state.ticket && ticket}
      </div>
    );
  }
}

ReactDOM.render(<Home />, document.getElementById("home"));
