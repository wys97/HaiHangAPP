import React from "react";
import { Carousel, Toast, Modal } from "antd-mobile";
import "antd-mobile/dist/antd-mobile.css";
import getMenu from "../../linkConfig";
import homeApi from "../../api/home/home";
import {
  getH5Token,
  setH5Token,
  clearH5Token,
  clearToken
} from "../../loginToken";
import "./home.scss";
import openH5Link from "../../openH5Link";

const alert = Modal.alert;

export default class Homer extends React.Component {
  static displayName = "Homer";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      slideshow: ["banner", "banner2"],
      notice: "notice",
      noticeList: [],
      slideIndex: 0,
      creidt: {}
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {
      that.getNoticeBoard();
    };
  }
  componentDidMount() {
    homeApi.noticeShowtop().then(res => {
      if (res.data.code === "200") {
        this.setState({
          noticeList: res.data.data,
          slideIndex: res.data.data.length - 1
        });
      } else {
        res.data.message && Toast.fail(res.data.message, 1);
      }
    });
    homeApi.limitDisplay().then(res => {
      if (res.data.code === "200") {
        this.setState({
          creidt: res.data.data
        });
      } else {
        res.data.message && Toast.fail(res.data.message, 1);
      }
    });
  }

  getNoticeBoard = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: "http://ccs46.tunnel.onepaypass.com/app-api/home/notice-showtop",
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json"
          }
        },
        function(ret, err) {
          if (ret) {
            that.setState({
              noticeList: ret.data,
              slideIndex: ret.data.length - 1
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
          console.log(JSON.stringify(ret));
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
      homeApi.noticeShowtop().then(res => {
        if (res.data.code === "200") {
          this.setState({
            noticeList: res.data.data,
            slideIndex: res.data.data.length - 1
          });
        } else {
          res.data.message && Toast.fail(res.data.message, 1);
        }
      });
      homeApi.limitDisplay().then(res => {
        if (res.data.code === "200") {
          this.setState({
            creidt: res.data.data
          });
        } else {
          res.data.message && Toast.fail(res.data.message, 1);
        }
      });
    }
  };

  toLink = menuName => {
    const url = getMenu(menuName);
    const link = url + "?token=" + getH5Token() + "&channel=cashLoanApp";
    openH5Link(link);
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
    if (window.localStorage.Apptoken == "") {
      this.toLogin();
    } else {
      this.toLink("提额");
    }
  };

  goNotice = (key, title) => {
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
  };

  goRateCalc = () => {
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
    alert("", "您的授信已过期重新授信后额度可提现及够买机票", [
      { text: "取消", onPress: () => {} },
      { text: "去授信", onPress: () => console.log("ok") }
    ]);
  };

  disabled = () => {
    alert(
      "购买机票",
      "很抱歉，您的海航白条授信额度被冻结，有任何疑问请致电客服XXXX",
      [{ text: "确定", onPress: () => {} }]
    );
  };

  audit = () => {
    alert("", "海航白条授信审核中", [{ text: "知道了", onPress: () => {} }]);
  };
  render() {
    return (
      <div>
        <div className="headers">
          <h1>您好！</h1>
          <h3>欢迎使用航旅分期</h3>
        </div>
        <div className={this.state.notice}>
          <img
            className="news"
            src={require("../../assets/image/lingdang.png")}
            alt=""
          />
          <Carousel
            className="notice-board"
            vertical
            dots={false}
            autoplay
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
            src={require("../../assets/image/guanbi.png")}
            onClick={() => {
              this.setState({ notice: "notice-disable" });
            }}
            alt=""
          />
        </div>
        {window.localStorage.Apptoken === "" ? ( //未登录状态
          <div className="creditInformation">
            <p className="creditInformation-header">海航白条最高可提现额度</p>
            <p className="creditInformation-sum">￥3,000,000.00</p>
            <i onClick={this.toLogin}>立即提现</i>
            <span className="creditInformation-title">
              <img src={require("../../assets/image/airTicket.png")} alt="" />
              借1千元日费用最低至3毛5
            </span>
          </div>
        ) : this.state.creidt.cashCreditStatus === "ENABLED" ? (
          <div className="creditInformation">
            <p className="creditInformation-header">海航白条最高可提现额度</p>
            <p className="creditInformation-sum" onClick={this.creidtDetail}>
              ￥{this.state.creidt.availableCashLimit}
            </p>
            {this.state.creidt.isCashCredit === "PASSED" ? ( //已授信状态
              <p
                className="creditInformation-limit"
                onClick={this.creidtDetail}
              >
                可用总额度<span>{this.state.creidt.availableLimit}</span>
                元&nbsp;（可买机票）
              </p>
            ) : (
              <p
                className="creditInformation-limit"
                onClick={this.creidtDetail}
              >
                可用总额度<span>{this.state.creidt.availableLimit}</span>元
              </p>
            )}
            <i onClick={this.creditLimit}>立即提现</i>
            <span className="creditInformation-title">
              <img src={require("../../assets/image/airTickets.png")} alt="" />
              借1千元日费用低至1毛5
            </span>
          </div>
        ) : this.state.creidt.cashCreditStatus === "DISABLED" ? ( //冻结状态
          <div className="creditInformation">
            <div className="freeze">冻结</div>
            <p className="creditInformation-header">海航白条可提现额度</p>
            <p className="creditInformation-sum">
              ￥{this.state.creidt.availableCashLimit}
            </p>
            {this.state.creidt.isCashCredit === "PASSED" ? (
              <p className="creditInformation-limit">
                可用总额度<span>{this.state.creidt.availableLimit}</span>
                元&nbsp;（可买机票）
              </p>
            ) : (
              <p className="creditInformation-limit">
                可用总额度<span>{this.state.creidt.availableLimit}</span>元
              </p>
            )}
            <i onClick={this.disabled}>立即提现</i>
            <span className="creditInformation-title">
              <img src={require("../../assets/image/airTickets.png")} alt="" />
              借1千元日费用低至1毛5
            </span>
          </div>
        ) : this.state.creidt.cashCreditStatus === "OVERDUE" ? ( //授信过期状态
          <div className="creditInformation">
            <img
              className="img"
              src={require("../../assets/image/creditexpired.png")}
            />
            <p className="creditInformation-creditExpired">
              您的海航白条授信已过期，请重新授信
            </p>
            <i onClick={this.creditExpired}>去授信</i>
            <span className="creditInformation-creditExpiredtitle">
              最高可提现额度<b>3,000,000.00</b>元
            </span>
          </div>
        ) : (
          //未授信状态
          <div className="creditInformation">
            <p className="creditInformation-header">海航白条最高可提现额度</p>
            <p className="creditInformation-sum">￥3,000,000.00</p>
            {this.state.creidt.isCashCredit === "PENDING" ? (
              <i onClick={this.audit}>立即提现</i>
            ) : (
              <i onClick={this.gocredit}>去授信</i>
            )}

            <span className="creditInformation-title">
              借1千元日费用最低至3毛5
            </span>
          </div>
        )}
        <div className="airlineTicket">
          <ul>
            <li>
              <div
                onClick={() => {
                  this.gocredit();
                }}
              >
                <img
                  src={require("../../assets/image/airlineticket.png")}
                  alt=""
                />
                <p>买机票</p>
              </div>
            </li>
            <li>
              <div onClick={this.liftingAmount}>
                <img
                  src={require("../../assets/image/quickallowed.png")}
                  alt=""
                />
                <p>快速提额</p>
              </div>
            </li>
            <li>
              <div onClick={this.goRateCalc}>
                <img
                  src={require("../../assets/image/ratecalculation.png")}
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
                <img src={require(`../../assets/image/${val}.png`)} alt="" />
              </a>
            ))}
          </Carousel>
        </div>
        <div className="welfare">
          <h2>福利专区</h2>
          <div className="welfare-title">
            <ul>
              <li>
                <a href="">
                  <img
                    src={require("../../assets/image/mycoupon.png")}
                    alt=""
                  />
                </a>
              </li>
              <li>
                <a href="">
                  <img
                    src={require("../../assets/image/invitefriends.png")}
                    alt=""
                  />
                </a>
              </li>
              <li>
                <a href="">
                  <img
                    src={require("../../assets/image/whitentroduced.png")}
                    alt=""
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div style={{ height: "80px" }} />
      </div>
    );
  }
}
