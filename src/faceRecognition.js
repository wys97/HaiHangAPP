import React from "react";
import ReactDOM from "react-dom";
import { getShowTitle, getToken, setH5Token } from "./loginToken";
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
                  animating:false
                })
                Toast.info(ret.message,3)
                //是否有授信 
            if(ret.data.creditCash){
              window.api.openFrame({
                name: "creditSuccess",
                url: "./creditSuccess.html",
                rect: {
                  w: "auto",
                  marginTop: window.api.safeArea.top,
                  marginBottom: window.api.safeArea.bottom
                },
                useWKWebView: true,
                historyGestureEnabled: true
              });
            }else{
              //没有绑定还款账号
              if (!ret.data.bindRepayBankCard) {
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
              } else if(ret.data.bindRepayBankCard && ret.data.agreementBindCard){
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
              }else{
                window.api.openFrame({
                  name: "addBankPhone",
                  url: "./addBankPhone.html",
                  rect: {
                    w: "auto",
                    marginTop: window.api.safeArea.top,
                    marginBottom: window.api.safeArea.bottom
                  },
                  pageParam:{
                    cardNo:ret.data.bankCardNo
                  },
                  useWKWebView: true,
                  historyGestureEnabled: true
                });
              }
            }

              } else {
                that.setState({
                  animating: false
                })
                if (err) {
                  console.lof("报错:"+JSON.stringify(err))
                  Toast.info("请求失败",3)
               
                } else {
                  Toast.info(ret.message,3)
                
                }
              }
              that.refresh()
            }
          )
        });
    } else {
      // 申请权限
      alert("权限申请", '为保证您正常地使用此功能，需要获取您的相机使用权限，请允许。', [
        { text: "返回", onPress: () => {
          this.setState({
            animating: false
          })
         } },
        {
          text: "去允许",
          onPress: () => {
            this.setState({
              animating: false
            })
            this.state.requestPermission &&
              this.state.requestPermission({ list: ["camera"], code: 1 }, function (
                ret
              ) {});
          }
        }
      ])
    }
  };

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
        {this.state.animating&&<div className='loader_wrap'>
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
