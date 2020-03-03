import React from "react";
import ReactDOM from "react-dom";
import { NavBar, Icon, Toast, List, InputItem, Button, Modal } from "antd-mobile";
import { createForm } from "rc-form";
import { getLink, getApi, getMenu } from "./linkConfig";
import { getShowTitle, setH5Token } from "./loginToken";
import * as _ from "lodash";
import "./assets/reset.scss";
import "./addBankCard.scss";

const operation = Modal.operation;
export default class AddBankCardForm extends React.Component {
  static displayName = "AddBankCard";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      data: {},
      disabled: true,
      deviceType: getShowTitle(),
      error: "",
      hasError: false,
      cardNo: "",
      liveDetectModule: null,
      permissionList: null,
      requestPermission: null,
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
      that.getDate();
    };
  }

  getDate = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("getCustomerInfo"),
          method: "get",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function (ret, err) {
          if (ret) {
            that.setState({
              detail: ret.data
            });
          } else {
            Toast(ret.message,3)
         
          }
          that.refresh()
        }
      );
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

        if (ret.body.code === "200") {
          setH5Token(ret.data);
        }
      }
    )
  }

  goSupportBank = () => {
    if (window.api) {
      window.api.openFrame({
        name: "supportBank",
        url: "./supportBank.html",
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

  setCardNo = value => {
    if(!/^[0-9]{4}[ ]{1}[0-9]{4}[ ]{1}...$/.test(
      value
    )
    ) {
      this.setState({
        disabled: false,
        cardNo: value
      });
    } else {
      this.setState({
        disabled: true,
        cardNo: value
      });
    }
  };

  phoneVerification = () => {
    if (this.state.cardNo.replace(/\s*/g, '').length - 1 < 15) {
      Toast.info("请输入15-20位阿拉伯数字银行卡号",4)
   
    } else {
      const that = this;
      let cardNo = that.state.cardNo.replace(/\s*/g,"");
      if (window.api) {
        window.api.ajax(
          {
            url:
              getLink() + getApi("cardBin") +cardNo,
            method: "get",
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
              window.api.openFrame({
                name: "addBankPhone",
                url: "./addBankPhone.html",
                pageParam: {
                  ...ret.data
                },
                rect: {
                  w: "auto",
                  marginTop: window.api.safeArea.top,
                  marginBottom: window.api.safeArea.bottom
                },
                useWKWebView: true,
                historyGestureEnabled: true
              })
            } else {
              Toast.info(ret.message,3)
           
            }
          }
        );
      }
    }
  };

  openTips = () => {
    operation([
      { text: "开始拍摄", onPress: () => this.getCamera("camera") },
      { text: "打开相册", onPress: () => this.getAlbum("album") },
      // { text: "打开图库", onPress: () => this.uploadImg("library") }
    ]);
  };

  getCamera = (str, type) => {   //调用相机
    const hasPermission =
      this.state.hasPermission &&
      this.state.hasPermission({ list: ["camera"] });
    if (hasPermission[0].granted) {
      this.uploadImg(str, type)
    } else {
      // 申请权限
      alert("权限申请", '为保证您正常地使用此功能，需要获取您的相机使用权限，请允许。', [
        { text: "返回", onPress: () => { } },
        {
          text: "去允许",
          onPress: () => {
            this.state.requestPermission &&
              this.state.requestPermission({ list: ["camera"], code: 1 }, function (
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

  uploadImg = (str) => {
    const that = this;
    window.api.getPicture(
      {
        sourceType: str,
        mediaValue: "pic",
        destinationType: "base64",
        quality: 100,
        targetWidth: 640,
        targetHeight: 400,
      },
      function (ret, err) {
        if (ret) {
          let data =ret.base64Data
          let base64Data = data.substr(data.indexOf(',')+1)
          window.api.ajax(
            {
              url: getLink() + getApi("ocrBankCard"),
              method: "post",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
                Apptoken: window.localStorage.Apptoken
              },
              data: {
                body:{
                  imageData: base64Data
                }
              }
            },
            function (ret, err) {
              if (ret.code === "200") {
                that.setState({
                  cardNo: ret.data.cardNo,
                  disabled: false
                });
              } else {
                Toast.info(err.msg, 3)
              }
            }
          );
        } else {
          Toast.info(ret.message, 3)
        }
      }
    )
  };


  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    const detail = this.state.detail;
    let identityNo = detail.identityNo &&  detail.identityNo.substring(0,4)+'****'+detail.identityNo.substring(detail.identityNo.length-4)
   
    return (
      <div
        className="addBankCard"
        style={{ minHeight: "100%", backgroundColor: "#FFF" }}
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
            color: "#333333",
            // borderBottom: "1px solid #EFEFEF"
          }}
        >
          添加银行卡
        </NavBar>
        <div style={{ height: "45px" }} />
        <List style={{ backgroundColor: "white" }} className="picker-list">
          <List.Item extra={detail.customerName} >
            姓名
          </List.Item>
          <List.Item extra={identityNo} >
            身份证
          </List.Item>
          <InputItem
            className="bankCard"
            type="bankCard"
            maxLength={23}
            name="cardNo"
            onChange={this.setCardNo}
            placeholder="请输入银行卡号"
            value={this.state.cardNo}
            clear
          >
            银行卡号
            <img
              className="supportBank"
              src={require("./assets/image/tobankCard.png")}
              alt=""
              onClick={() => {
                this.goSupportBank();
              }}
            />
            <img
              className="ocr"
              src={require("./assets/image/photo.png")}
              alt=""
              onClick={() => {
                this.openTips()
              }}
            />
          </InputItem>
        </List>
        <p className="caution">默认开通代扣服务，还款日可自动代扣还款</p>
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={() => {
            this.phoneVerification();
          }}
        >
          下一步
        </Button>
      </div>
    );
  }
}
const AddBankCard = createForm()(AddBankCardForm);
ReactDOM.render(<AddBankCard />, document.getElementById("addBankCard"));
