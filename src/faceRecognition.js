import React from "react";
import ReactDOM from "react-dom";
import { getH5Token, setH5Token, clearToken, clearH5Token,getShowTitle } from "./loginToken";
import { Icon, NavBar, ActivityIndicator, Modal, Button, Toast } from "antd-mobile";
import "./faceRecognition.scss";
import "./assets/reset.scss";
import { getLink, getApi, getMenu } from "./linkConfig";

const operation = Modal.operation;
const alert = Modal.alert;

class FaceRecognition extends React.Component {
  //活体识别页
  static displayName = "FaceRecognition";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      deviceType: getShowTitle(),
      liveDetectModule: null,
      permissionList: null,
      requestPermission: null,
      disabled: false,
      animating: false
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      const liveDetectModule = window.api.require("liveDetectModule");
      const hasPermission = window.api.hasPermission; // 相机权限检查
      const requestPermission = window.api.requestPermission;
      that.setState({
        liveDetectModule,
        hasPermission,
        requestPermission
      });
    };
  }
  toAliveCheck = () => {

    const that = this;
    const permission =
      this.state.hasPermission &&
      this.state.hasPermission({ list: ["camera"] });
    if (permission[0].granted) {
      // 调用
      this.setState({ animating: true });
      this.state.liveDetectModule &&
        this.state.liveDetectModule.start(function (ret, err) {
          window.api.ajax(
            {
              url: getLink() + getApi("authFace"),
              method: "post",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
                Apptoken: window.localStorage.Apptoken
              },
              data: {
                body: {
                  photoBase64: ret.data
                }
              }
            },
            function (ret, err) {
              if (ret.code === "200") {
                that.setState({
                  animating: false
                })
                Toast.info(ret.message, 3);
                // 刷新token
                window.api.ajax(
                  {
                    url: getLink() + getApi("updateToken"),
                    method: "post",
                    headers: {
                      "Content-Type": "application/json",
                      Apptoken: window.localStorage.Apptoken
                    },
                    dataType: "json"
                  },
                  function (res, err) {

                    if (res.code === "401") {
                      clearToken();
                      clearH5Token();
                    }
                    if (res.code === "200") {
                      setH5Token(res.data);
                      // 活体识别返回：现金贷已授信，嗨贷不管有没有授信，都提示弹窗【已将您的授信额度关联到新版系统！】(【确定】按钮)，
                      // 点击确定按钮跳回首页刷新一下额度查询接口，
                      // 2.2活体识别返回：现金贷未授信，嗨贷已授信，嗨贷同步字段为true，弹窗提示【已将您的嗨贷授信额度关联到新版系统！】
                      // (【继续现金贷授信】/【取消】按钮)，继续现金贷授信就跳转现金贷授信的下一步骤，取消则返回首页
                      // 2.3活体识别返回：现金贷未授信，嗨贷已授信，嗨贷同步字段为false，没有弹窗，继续授信
                      // 2.4活体识别返回：现金贷未授信，嗨贷未授信，没有弹窗，正常授信。

                      //是否补充协议
                      // if (ret.data.isNeed2Sign) {
                      //   window.api.openFrame({
                      //     url: "./supplementProtocol.html",
                      //     name: "supplementProtocol",
                      //     rect: {
                      //       w: "auto",
                      //       marginTop: window.api.safeArea.top,
                      //       marginBottom: window.api.safeArea.bottom
                      //     },
                      //     pageParam: {
                      //       data: 'faceRecognition',
                      //       from: ret.data
                      //     },
                      //     useWKWebView: true,
                      //     historyGestureEnabled: true,

                      //   });
                      //   window.api.closeFrame({ name: "faceRecognition" });

                      // } else 
                      if (ret.data.creditCash=='HAVE_CREDIT' && ret.data.cashSync || (ret.data.creditCash=='CREDIT_EXPIRED' && ret.data.cashSync)) { //是否有授信 
                        alert("", '已将您的授信额度关联到新版系统！', [
                          {
                            text: "确定", onPress: () => {
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
                              window.api.closeFrame({ name: "faceRecognition" });
                            }
                          }
                        ])
                      } else if (ret.data.creditHra=='HAVE_CREDIT' && ret.data.hraSync || (ret.data.creditHra=='CREDIT_EXPIRED' && ret.data.hraSync)) { //嗨贷以授信，且第一次打开显示弹窗
                        alert("", '已将您的嗨贷授信额度关联到新版系统！', [
                          {
                            text: "取消", onPress: () => {
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
                              window.api.closeFrame({ name: "faceRecognition" });
                            }
                          },
                          {
                            text: "继续现金贷授信",
                            onPress: () => {
                              //现金贷授信跳转
                              that.criteria(ret.data.agreementBindCard, ret.data.bindRepayBankCard, ret.data.bankCardNo)
                            }
                          }
                        ])
                      } else {
                        that.criteria(ret.data.agreementBindCard, ret.data.bindRepayBankCard, ret.data.bankCardNo)
                      }


                    }
                  })

              } else {
                that.setState({
                  animating: false
                })
                if (err) {
                  console.log("报错:" + JSON.stringify(err))
                  Toast.info("请求失败", 3)

                } else {
                  Toast.info(ret.message, 3)

                }
              }
              that.refresh()
            }
          )
        });
    } else {
      // 申请权限
      alert("权限申请", '为保证您正常地使用此功能，需要获取您的相机使用权限，请允许。', [
        {
          text: "返回", onPress: () => {
            this.setState({
              animating: false
            })
          }
        },
        {
          text: "去允许",
          onPress: () => {
            this.setState({
              animating: false
            })
            this.state.requestPermission &&
              this.state.requestPermission({ list: ["camera"], code: 1 }, function (
                ret
              ) { });
          }
        }
      ])
    }
  };

  //现金贷授信跳转判断
  criteria = (agreementBindCard, bindRepayBankCard, bankCardNo) => {
    //没有绑定还款账号
    if (!bindRepayBankCard) {
      window.api.openFrame({
        name: "addBankCard",
        url: "./addBankCard.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
      //有协议绑卡 ，有还款计划  跳用户基本信息
    } else if (bindRepayBankCard && agreementBindCard) {
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
      });
      //有还款账号，没有协议绑卡跳协议绑卡
    } else {
      window.api.openFrame({
        name: "addBankPhone",
        url: "./addBankPhone.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        pageParam: {
          cardNo: bankCardNo
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
    }
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

  goback = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="faceRecognition"
        style={{ minHeight: "100%", backgroundColor: "#FFF" }}
      >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.goback()}
          style={{
            width: "100%",
            zIndex: 1,
            fontSize: "18px",
            color: "#444D54",
            borderBottom: "1px solid #EFEFEF"
          }}
        >
          人脸识别
        </NavBar>
        <div className="logo">
          <img src={require("./assets/image/afr.png")} />
          <p>为了保障您的资金安全</p>
          <p>需识别脸部</p>
          <ul className="hint">
            <li>
              <div>
                <img src={require("./assets/image/lowerHead.png")} alt="" />
                <p>不能低头仰拍</p>
              </div>
            </li>
            <li>
              <div>
                <img src={require("./assets/image/keepFace.png")} alt="" />
                <p>不能遮挡脸部</p>
              </div>
            </li>
            <li>
              <div>
                <img src={require("./assets/image/reflectLight.png")} alt="" />
                <p>眼镜不能反光</p>
              </div>
            </li>
          </ul>
        </div>
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={() => this.toAliveCheck()}
        >
          开始检测
        </Button>
        <ActivityIndicator toast animating={this.state.animating} />
        {this.state.animating && <div className='loader_wrap'>
          <div className='loader_img'></div>
          <div className='loader_text'>加载中...</div>
        </div>}
      </div>
    );
  }
}

ReactDOM.render(
  <FaceRecognition />,
  document.getElementById("faceRecognition")
);
