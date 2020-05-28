import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, PullToRefresh } from "antd-mobile";
import "./nav/userInfo/css/userInfo.scss";
import "./assets/reset.scss";
import { getLink, getApi, getMenu } from "./linkConfig";
import { setH5Token, clearToken, clearH5Token, getH5Token } from "./loginToken";
import openH5Link from "./openH5Link";

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
        nickname: "",
      },
      varyPoints: "",
      creidt: {},
      loginFlag: false,
      connectionFlag: false,
      visible: false,
      height: document.documentElement.clientHeight,
      showBtn: false, //是否显示同步按钮
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.getDate();
      that.getisNeed2Sign();
    };
  }
  componentDidMount() {
    const hei = this.state.height - ReactDOM.findDOMNode(this.ptr).offsetTop;
    setTimeout(
      () =>
        this.setState({
          height: hei,
        }),
      0
    );



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
        if (ret.code === "401") {
          clearToken()
          clearH5Token()
        }
        if (ret.code === "200") {
          setH5Token(ret.data);
        }
      }
    )
  }

  getDate = () => { //客户资料
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("checkStatus"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function (ret, err) {
          if (ret.code === "200") {
            that.setState({
              data: ret.data
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
        function (ret, err) {
          if (ret.code === "200") {
            that.setState({
              creidt: ret.data,
              refreshing: false
            });
          } else {
            that.setState({
              creidt: {
                availableCashLimit: "0.00",
                availableLimit: "0.00",
                cashCreditStatus: "NOCREDIT"
              }
            });
          }
        }
      );
      this.refresh()
      // }
    }
  };

  getuserInfo = () => {   //登录跳转
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
        historyGestureEnabled: true,
        pageParam: {
          from: "userInfo"
        }
      });
      // window.api.closeFrame({ name: "securitySet" });
      // window.api.closeFrame({ name: "userInfo" });
    }
  };

  toLink = menuName => {  //H5跳转
    this.refresh()
    const url = getMenu(menuName);
    const link = url + "?token=" + getH5Token() + "&channel=cashLoanApp";
    openH5Link(link);
  };

  toPaySet = () => {    //支付密码维护跳转判断
    if (window.localStorage.Apptoken !== '') {
      let cashCreditStatus = this.state.creidt.cashCreditStatus
      if (cashCreditStatus === "" || cashCreditStatus === "NOCREDIT") {
        alert('未授信', '若需使用此功能，请先进行授信', [
          { text: '取消', onPress: () => { } },
          {
            text: '去授信', onPress: () => {
              this.gocredit()
            }
          },
        ]);
      } else {
        this.refresh()
        this.toLink("支付密码维护");
      }
    } else {
      this.getuserInfo()
    };
  }

  getTransaction = () => {    //交易记录跳转判断
    if (window.localStorage.Apptoken !== '') {
      let cashCreditStatus = this.state.creidt.cashCreditStatus
      if (cashCreditStatus === "" || cashCreditStatus === "NOCREDIT") {
        alert('未授信', '若需使用此功能，请先进行授信', [
          { text: '取消', onPress: () => { } },
          {
            text: '去授信', onPress: () => {
              this.gocredit()
            }
          },
        ]);
      } else {
        this.refresh()
        this.toLink("交易记录")
      }
    } else {
      this.getuserInfo()
    }
  };
  cardMaintenance = () => {     //银行卡维护跳转
    if (window.localStorage.Apptoken !== '') {
      let cashCreditStatus = this.state.creidt.cashCreditStatus
      if (cashCreditStatus === "" || cashCreditStatus === "NOCREDIT") {
        alert('未授信', '若需使用此功能，请先进行授信', [
          { text: '取消', onPress: () => { } },
          {
            text: '去授信', onPress: () => {
              this.gocredit()
            }
          },
        ]);
      } else {
        this.refresh();
        this.toLink("银行卡维护");
      }
    } else {
      this.getuserInfo()
    }
  }

  getMsgCenter = menuName => {
    this.refresh()
    const url = getMenu(menuName);
    const link = url + "?token=" + getH5Token() + "&channel=cashLoanApp&contactType=COMMON";
    openH5Link(link);
    console.log("链接地址：" + link)
  };

  logOut = () => {  //退出登录
    alert("确定退出登录吗?", "", [
      { text: "取消", onPress: () => { } },
      {
        text: "确定",
        onPress: () => {
          window.api.ajax({
            url: getLink() + getApi("loginout"),
            method: "post",
            dataType: "json",
            headers: {
              "Content-Type": "application/json",
              Apptoken: window.localStorage.Apptoken
            }
          },
            function (res, err) {
              if (res.code == '200') {
                clearToken(),
                  clearH5Token(),
                  window.api.openFrame({
                    url: "./userInfo.html",
                    name: "userInfo",
                    reload: true,
                    rect: {
                      w: "auto",
                      marginTop: window.api.safeArea.top,
                      marginBottom: window.api.safeArea.bottom + 50
                    },
                    pageParam: {
                      isToken: false
                    },
                    useWKWebView: true,
                    historyGestureEnabled: true
                  });
                window.api.closeFrame({ name: 'securitySet' })
                window.api.closeFrame({ name: "creditResult" })
                window.api.closeFrame({ name: "contactsList" })
                window.api.closeFrame({ name: "addBankCard" })
                window.api.closeFrame({ name: "addBankCardAuth" })
                window.api.closeFrame({ name: "addBankPhone" })
                window.api.closeFrame({ name: "amountDetail" })
                window.api.closeFrame({ name: "creditInformation" })
                window.api.closeFrame({ name: "contactsAdd" })
                window.api.closeFrame({ name: "faceRecognition" })
                window.api.closeFrame({ name: "idcardDiscern" })
                window.api.closeFrame({ name: "hnaIous" })
              }

            }
          )

        }
      }
    ]);
  };

  checkIn = () => {
    this.refresh()
    const that = this;

    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("pointsCheckIn"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function (ret, err) {
          console.log(JSON.stringify(ret))
          if (ret.code === "200") {
            that.setState({
              varyPoints: ret.data,
              visible: true
            });
          }
        }
      );
    }
  };

  goMyPoint = () => {   //积分详情
    const points = this.state.data.points;
    this.refresh()
    if (window.localStorage.Apptoken === "") {
      this.getuserInfo()
    } else {
      window.api.openFrame({
        url: "./myPoint.html",
        name: "myPoint",
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


  aboutUs = () => {
    //关于我们
    window.api.openFrame({
      url: "./aboutUs.html",
      name: "aboutUs",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };


  assessment = () => {


    //进入我的合同
    let token = window.localStorage.Apptoken;

    if (token !== '') {
      //我的合同
      let cashCreditStatus = this.state.creidt.cashCreditStatus
      if (cashCreditStatus === "" || cashCreditStatus === "NOCREDIT") {
        alert('未授信', '若需使用此功能，请先进行授信', [
          { text: '取消', onPress: () => { } },
          {
            text: '去授信', onPress: () => {
              this.gocredit()
            }
          },
        ]);
      } else if (cashCreditStatus === "CREDIT_FAILED") {
        window.api.openFrame({
          url: "./creditFailure.html",
          name: 'creditFailure',
          rect: {
            w: 'auto',
            marginTop: window.api.safeArea.top,
            marginBottom: window.api.safeArea.bottom
          },
          useWKWebView: true,
          historyGestureEnabled: true
        })
      } else {
        this.refresh()
        window.api.openFrame({
          url: "./assessment.html",
          name: 'assessment',
          rect: {
            w: 'auto',
            marginTop: window.api.safeArea.top,
            marginBottom: window.api.safeArea.bottom
          },
          useWKWebView: true,
          historyGestureEnabled: true,
        })
      }
    } else {
      //登陆
      this.getuserInfo()
    }


  }

  gocredit = () => {  //去授信
    this.refresh()
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
  }


  helpCenter = () => {
    //帮助中心
    window.api.openFrame({
      url: './helpCenter.html',
      name: "helpCenter",
      rect: {
        w: 'auto',
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },

      useWKWebView: true,
      historyGestureEnabled: true
    })

  };

  securitySet = () => {
    const that = this
    //安全设置
    let token = window.localStorage.Apptoken;
    if (token == '') {
      this.getuserInfo()
    } else {
      window.api.openFrame({
        url: './securitySet.html',
        name: 'securitySet',
        rect: {
          w: 'auto',
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        pageParam: {
          securitySet: 'securitySet',
        },
        useWKWebView: true,
        historyGestureEnabled: true
      })
    }
    // window.api.closeFrame({name:'userInfo'})
  };
  synchronization = () => {
    const that = this
    //同步额度
    let token = window.localStorage.Apptoken;
    if (token == '') {
      this.getuserInfo()
    } else {
      window.api.openFrame({
        url: './hnaIous.html',
        name: 'hnaIous',
        rect: {
          w: 'auto',
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        pageParam: {
          securitySet: 'securitySet',
        },
        useWKWebView: true,
        historyGestureEnabled: true
      })
    }
    // window.api.closeFrame({name:'userInfo'})
  };

  getisNeed2Sign = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("isNeed2Sign"),
          method: "get",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function (ret, err) {

          if (ret.code == "200") {
            that.setState({
              showBtn: ret.data.isNeed2Sign
            });
          }
        }
      );
    }
  };



  updata = () => {
    //版本更新
    window.api.openFrame({
      url: './updata.html',
      name: 'updata',
      rect: {
        w: 'auto',
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    })
  };

  personalSet = () => {     //个人信息维护
    if (window.localStorage.Apptoken !== '') {
      let cashCreditStatus = this.state.creidt.cashCreditStatus
      if (cashCreditStatus === "" || cashCreditStatus === "NOCREDIT") {
        alert('未授信', '若需使用此功能，请先进行授信', [
          { text: '取消', onPress: () => { } },
          {
            text: '去授信', onPress: () => {
              this.gocredit()
            }
          },
        ]);
      } else {
        this.refresh()
        this.getMsgCenter("个人信息维护")
      }
    } else {
      this.getuserInfo()
    };
  }

  goNotice = () => {
    if (window.localStorage.Apptoken !== "") {
      this.refresh()
      this.toLink("公告列表")
    } else {
      this.getuserInfo()
    }
  }

  render() {
    let data = this.state.data;
    let nickname = /^\d+$/.test(data.nickname);
    if (data.cardNumber.indexOf("A") !== -1) {
      data.cardNumber = "暂无"
    }
    const seriesDay = "已签到" + data.seriesDay + "天"
    return (
      <div className="my">
        <NavBar
          className="header"
          mode="light"
          rightContent={
            <img
              className="lindang-iconfont"
              onClick={() => { this.goNotice() }}
              src={require("./assets/image/news.png")}
              alt=""
            />
          }
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1,
            fontSize: "17px",
            color: "#333333",
            background: '#F7F5F3',
            // borderBottom: "1px solid #EFEFEF"
            // background:'#F7F5F3'
          }}
        >
          我的
        </NavBar>
        <PullToRefresh
          damping={100}
          ref={el => (this.ptr = el)}
          refreshing={this.state.refreshing}
          style={{
            height: this.state.height,
            overflow: "auto"
          }}
          onRefresh={() => {
            this.getDate();
          }}
        >
          <div className="login">
            {window.localStorage.Apptoken !== '' ? (
              <div style={{ display: "flex" }}>
                <div className="headPortrait">
                  <img src={require("./assets/image/login.png")} alt="" onClick={() => { this.personalSet() }} />
                </div>
                <div className="enter">
                  <p onClick={() => { this.personalSet() }}>
                    {!nickname ? '**' + data.nickname.substring(data.nickname.length - 1)
                      : data.nickname.substring(0, 3) + '****' + data.nickname.substring(data.nickname.length - 3)
                    }
                  </p>
                  <span className="login-title">
                    金鹏卡:{data.cardNumber}
                  </span>
                </div>
              </div>
            ) : (
                <div style={{ display: "flex" }}>
                  <div className="headPortrait">
                    <img src={require("./assets/image/login.png")} alt="" onClick={() => { this.getuserInfo() }} />
                  </div>
                  <div className="enter">
                    <p
                      onClick={() => {
                        this.getuserInfo();
                      }}
                    >
                      登录/注册
              </p>
                    <span className="login-title">
                      最高授信<i>3,000,000.00</i>元
              </span>
                  </div>
                </div>

              )}
            {window.localStorage.Apptoken === '' ? (
              <Button
                style={{ background: "#e1514c", borderRadius: '2px' }}
                className="sgin"
                onClick={this.getuserInfo}
              >
                签到
              </Button>
            ) : data.status === false ? (
              <Button
                style={{ background: "#e1514c", borderRadius: '2px' }}
                className="sgin"
                onClick={this.checkIn}
              >
                签到
              </Button>
            ) : (
                  <Button disabled style={{ background: "#d7d7d7", width: "auto", borderRadius: '2px' }} className="sgin">
                    {seriesDay}
                  </Button>
                )}
          </div>
          <div className="list">
            {window.localStorage.Apptoken === '' || this.state.creidt.cashCreditStatus === "NOCREDIT" || this.state.creidt.cashCreditStatus === "CREDIT_ING" || this.state.creidt.cashCreditStatus === "CREDIT_FAILED" ? (
              <div className="ious">
                <div className="limit">
                  <p>白条总额度（元）</p>
                  <span>--</span>
                </div>
                <div className="limit">
                  <p>白条可用额度（元）</p>
                  <span>--</span>
                </div>
              </div>
            ) : (
                <div className="ious">
                  <div className="limit">
                    <p>白条总额度（元）</p>
                    <span>{this.state.creidt.totalLimit}</span>
                  </div>
                  <div className="limit">
                    <p>白条可用额度（元）</p>
                    {this.state.creidt.cashCreditStatus === "DISABLED" ? <span>{this.state.creidt.availableLimit}<i>（冻结）</i></span> : <span>{this.state.creidt.availableLimit}</span>}
                  </div>
                </div>
              )}
            <div>
              <List className="my-list">
                <Item arrow="horizontal" multipleLine onClick={this.assessment}>
                  <div className="size">
                    <img src={require("./assets/image/critd.png")} alt="" />
                    <span>我的合同</span>
                  </div>
                </Item>
                <Item
                  arrow="horizontal"
                  multipleLine
                  onClick={this.getTransaction}
                >
                  <div className="size" >
                    <img src={require("./assets/image/deal.png")} alt="" />
                    <span>交易记录</span>
                  </div>
                </Item>
                <Item
                  arrow="horizontal"
                  multipleLine
                  onClick={() => {
                    this.goMyPoint();
                  }}
                >
                  <div className="size">
                    <img src={require("./assets/image/integral.png")} alt="" />
                    <span>我的积分</span>
                    {window.localStorage.Apptoken !== "" ? (
                      <i>{data.points}个积分</i>
                    ) : null}
                  </div>
                </Item>
              </List>
              <div className="kong" />
              <List className="two-list">
                <Item arrow="horizontal" multipleLine onClick={() => { }}>
                  <div className="size" onClick={this.cardMaintenance}>
                    <img src={require("./assets/image/bankcard.png")} alt="" />
                    <span>银行卡维护</span>
                  </div>
                </Item>
                <Item arrow="horizontal" multipleLine onClick={this.toPaySet}>
                  <div className="size">
                    <img src={require("./assets/image/pay.png")} alt="" />
                    <span>支付设置</span>
                  </div>
                </Item>
                <Item arrow="horizontal" multipleLine onClick={this.securitySet}>
                  <div className="size">
                    <img src={require("./assets/image/lock.png")} alt="" />
                    <span>安全设置</span>
                  </div>
                </Item>
                {this.state.showBtn && <Item arrow="horizontal" multipleLine onClick={this.synchronization}>
                  <div className="size">
                    <img src={require("./assets/image/synchronization.png")} alt="" />
                    <span>同步额度</span>
                  </div>
                </Item>}
                <Item arrow="horizontal" multipleLine onClick={this.aboutUs}>
                  <div className="size">
                    <img src={require("./assets/image/withwe.png")} alt="" />
                    <span>关于我们</span>
                  </div>
                </Item>
                <Item arrow="horizontal" multipleLine onClick={this.helpCenter}>
                  <div className="size">
                    <img src={require("./assets/image/hlpe.png")} alt="" />
                    <span>帮助中心</span>
                  </div>
                </Item>
                <Item arrow="horizontal" multipleLine onClick={this.updata}>
                  <div className="size">
                    <img src={require("./assets/image/banben.png")} alt="" />
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
        </PullToRefresh>
        {/* <div style={{ height: "80px" }} /> */}
        <Modal
          visible={this.state.visible}
          transparent
          closable
          maskClosable
          maskClosable={false}
          onClose={() => {
            this.getDate();
            this.setState({ visible: false });
          }}
        >
          <div className="signIn">
            <img src={require("./assets/image/signIn.png")} />
            <p>
              恭喜获得<span>{this.state.varyPoints}</span>积分
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<UserInfo />, document.getElementById("userInfo"));
