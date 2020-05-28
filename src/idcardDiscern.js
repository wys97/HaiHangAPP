import React from "react";
import ReactDOM from "react-dom";
import { getShowTitle, getToken } from "./loginToken";
import { Icon, NavBar, Toast, Modal, Button, ActivityIndicator } from "antd-mobile";
import "./idcardDiscern.scss";
import "./assets/reset.scss";
import { getLink, getApi } from "./linkConfig";

const operation = Modal.operation;
const alert = Modal.alert;

class IdcardDiscern extends React.Component {
  static displayName = "RateCalc";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);

    this.state = {
      deviceType: getShowTitle(),
      hasPermission: null,
      permissionList: null,
      requestPermission: null,
      cardPhoto1: "",
      cardPhoto2: "",
      disabled: true,
      animating: false,
      // FNImageClip: null
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      const hasPermission = window.api.hasPermission; // 相机权限检查
      const requestPermission = window.api.requestPermission;
      // const FNImageClip = api.require('FNImageClip');
      that.setState({
        hasPermission,
        requestPermission,
        // FNImageClip,
      });

    };

  }

  uploadIdcardFrontImg = () => {
    this.openTips("ID_CARD_1");
  };

  uploadIdcardBackImg = () => {
    this.openTips("ID_CARD_2");
  };

  openTips = str => {
    operation([
      { text: "选择照片", onPress: () => this.getChoice("Choice", str) },
      { text: "照相机", onPress: () => this.getCamera("camera", str) },
      { text: "相册", onPress: () => this.getAlbum("album", str) },
      { text: "取消", onPress: () => this.getcancel("cancel", str) },
    ]);
  };



  getcancel = (str, type) => {

  }

  getCamera = (str, type) => {   //调用相机
    const hasPermission =
      this.state.hasPermission &&
      this.state.hasPermission({ list: ["camera", 'photos'] });
    if (hasPermission[0].granted && hasPermission[1].granted) {
      this.uploadImg(str, type)
    } else {
      // 申请权限
      alert("权限申请", '为保证您正常地使用此功能，需要获取您的相机使用权限，请允许。', [
        { text: "返回", onPress: () => { } },
        {
          text: "去允许",
          onPress: () => {
            this.state.requestPermission &&
              this.state.requestPermission({ list: ["camera", 'photos'], code: 1 }, function (
                ret
              ) { });
          }
        }
      ])
    }
  }

  getAlbum = (str, type) => {   //调用相册
    const hasPermission =
      this.state.hasPermission &&
      this.state.hasPermission({ list: ["photos"] });
    // console.log(JSON.stringify(hasPermission))
    if (hasPermission[0].granted) {
      this.uploadImg(str, type)
    } else {
      // 申请权限
      alert("权限申请", "为保证您正常地使用此功能，需要获取您的相册权限，请允许。", [
        { text: "取消", onPress: () => { } },
        {
          text: "去允许",
          onPress: () => {
            this.state.requestPermission &&
              this.state.requestPermission({ list: ["photos"], code: 1 }, function (
                ret
              ) { });
          }
        }
      ])

    }
  }

  uploadImg = (str, type) => {
    const that = this;
    window.api.getPicture(
      {
        sourceType: str,
        // encodingType: "png",
        mediaValue: "pic",
        // destinationType: "url",
        destinationType: "base64",
        quality: 99,
        targetWidth: 1280,
        targetHeight: 800,
      },
      function (ret, err) {
        if (ret) {
          // console.log("地址："+JSON.stringify(ret))
          // const url = ret.data
          // that.getFNImageClip(url)
          if (type === "ID_CARD_1") {
            that.setState(
              {
                cardPhoto1: ret.base64Data
              },
              () => {
                that.authCode();
              }
            );
          } else {
            that.setState(
              {
                cardPhoto2: ret.base64Data
              },
              () => {
                that.authCode();
              }
            );
          }
        }
      }
    );
  };

  authCode = () => {
    if (this.state.cardPhoto1 !== "" && this.state.cardPhoto2 !== "") {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };

  goback = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  goFaceRecognition = () => {
    const that = this
    const cardPhoto1 = that.state.cardPhoto1.substr(that.state.cardPhoto1.indexOf(",") + 1);
    const cardPhoto2 = that.state.cardPhoto2.substr(that.state.cardPhoto2.indexOf(",") + 1)
    // console.log(JSON.stringify(cardPhoto1))
    // console.log(JSON.stringify(cardPhoto2))
    const data1 = {
      file: cardPhoto1,
      fileType: "ID_CARD_1"
    };
    const data2 = {
      file: cardPhoto2,
      fileType: "ID_CARD_2"
    };
    that.setState({
      animating: true
    })
    window.api.ajax(
      {
        url: getLink() + getApi("ocrIdCard"),
        method: "post",
        headers: {
          "Content-Type": "application/json",
          appToken: getToken()
        },
        dataType: "json",
        data: {
          body: JSON.stringify(data1)
        }
      },
      function (ret, err) {
        // console.log(JSON.stringify(ret))
        // console.log(JSON.stringify(err))
        
        if (ret == undefined || err && err.code == 0 || err && err.code == '0') {
          Toast.info('上传失败，请重新上传正面，保证图片的清晰度，光亮度', 4)
          that.setState({
            animating: false
          })
        }
         if (ret.code == "200" || ret.code == 200) {
          window.api.ajax(
            {
              url: getLink() + getApi("ocrIdCard"),
              method: "post",
              headers: {
                "Content-Type": "application/json",
                appToken: getToken()
              },
              dataType: "json",
              data: {
                body: JSON.stringify(data2)
              }
            },
            function (res, error) {
              // console.log(JSON.stringify(res))
              // console.log(JSON.stringify(error))
              if (ret == undefined || ret == 'undefined' || error && error.code == 0 || error && error.code == '0') {
                Toast.info('上传失败，请重新上传反面，保证图片的清晰度，光亮度', 4)
                that.setState({
                  animating: false
                })
              }

              if (res.code == "200") {
                that.setState({
                  animating: false
                })
                window.api.openFrame({
                  name: "faceRecognition",
                  url: "./faceRecognition.html",
                  rect: {
                    w: "auto",
                    marginTop: window.api.safeArea.top,
                    marginBottom: window.api.safeArea.bottom
                  },
                  useWKWebView: true,
                  historyGestureEnabled: true
                });
              } else {
                that.setState({
                  animating: false
                })
                if (error) {
                  Toast.info("请求失败", 3)

                } else {
                  Toast.info(res.message, 3)

                }
              }
            }
          );

        } else {
          that.setState({
            animating: false
          })
          if (err) {
            Toast.info("请求失败", 3)

          } else {
            Toast.info(ret.message, 3)

          }
        }
      }
    );

  };

  render() {
    let { animating } = this.state;
    return (
      <div
        className="rateCalc"
        style={{ minHeight: "100%", backgroundColor: "#FFF" }}
      >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.goback()}
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
          上传身份证照片
        </NavBar>
        <div style={{ height: "45px" }} />
        <div className="header-nav">
          {"请上传" + "本人身份证照片"}
        </div>
        <div className="idImg">
          {this.state.cardPhoto1 === "" ? (
            <img
              src={require("./assets/image/idcard1.png")}
              alt=""
              onClick={this.uploadIdcardFrontImg}
            />
          ) : (
              <img
                src={this.state.cardPhoto1}
                alt=""
                onClick={this.uploadIdcardFrontImg}
              />
            )}
          {this.state.cardPhoto2 === "" ? (
            <img
              src={require("./assets/image/idcard2.png")}
              alt=""
              onClick={this.uploadIdcardBackImg}
            />
          ) : (
              <img
                src={this.state.cardPhoto2}
                alt=""
                onClick={this.uploadIdcardBackImg}
              />
            )}
        </div>
        <div
          className="worning"
        >
          请保证证件在有效期限内
        </div>
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={() =>
            alert("照片上传", '是否上传身份证照片？', [
              { text: "返回", onPress: () => { } },
              {
                text: "确定",
                onPress: () => {
                  this.goFaceRecognition();
                }
              }
            ])
          }
        >
          确认上传
        </Button>
        <div style={{ height: "30px" }} />
        <ActivityIndicator toast animating={animating} />
        {animating && <div className='loader_wrap'>
          <div className='loader_img'></div>
          <div className='loader_text'>加载中...</div>
        </div>}
      </div>
    );
  }
}

ReactDOM.render(<IdcardDiscern />, document.getElementById("idcard"));
