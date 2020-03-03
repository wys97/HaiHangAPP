import React from "react";
import ReactDOM from "react-dom";
import { NavBar, Icon, Button, Modal } from "antd-mobile";
import { getShowTitle } from "./loginToken";
import { getLink, getApi } from "./linkConfig";

import * as _ from "lodash";
import "./assets/reset.scss";

import "./hnaIous.scss";
import protocol from "./common/protocol/protocol.js";

export default class HnaIous extends React.Component {
  static displayName = "HnaIous";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      checked: false,
      showProtocol: false, //查看协议
      // ProtocolType: 0,   //协议类型  1: 借款授信合同   2：海航白条机票分期业务注册协议
      toDisabled: true,
      timeText: "(3s)",
      protocolData:'',
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {
      that.setState({
        ajax: window.api.ajax
      });
    that.gitProtocolData();
      
    };
  }

 

  gitProtocolData=()=>{
    let that = this;
    window.api.ajax({
      url: getLink()+getApi('creditAgreementParam'),
      method: 'post',
      headers: {
        Apptoken: window.localStorage.Apptoken
      }
  }, function(ret, err) {
      if (ret.code=='200') {
        
        that.setState({
          protocolData:ret.data
        })
      } else {
      }
  });
  }


  goCredits = () => {
    window.api.openFrame({
      url: "./idcardDiscern.html",
      name: "idcardDiscern",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  cLickRadio = value => {
    // console.log(value)
    //是否勾选已阅读协议
    if (value) {
      this.setState({
        checked: true,
        disabled: false
      });
    } else {
      this.setState({
        checked: false,
        disabled: true
      });
    }
  };

  showProtocol = value => {
    //查看协议详情
    this.setState({
      showProtocol: true,
      toDisabled: true
    });
    let timeo = 3;
    let timeStop = setInterval(() => {
      timeo--;
      if (timeo > 0) {
        this.setState({
          timeText: "(" + timeo + "s)",
          toDisabled: true
        });
      } else {
        timeo = 3; //当减到0时赋值为60
        this.setState({
          timeText: "",
          toDisabled: false,
        });
        clearInterval(timeStop); //清除定时器
      }
    }, 1000);
  };

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="hnaIous"
        style={{ minHeight: "100%", backgroundColor: "#F9FAF9" }}
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
            borderBottom: "1px solid #EFEFEF"
          }}
        >
          海航白条
        </NavBar>
        <div style={{ height: "45px" }} />
        <div className="banner"></div>
        <div className="maxLimit">
          <p>最高额度</p>
          <span>￥3,000,000.00</span>
          <div></div>
          <b>保持海南航空良好乘机记录，将有助提升额度及获得授信</b>
        </div>
        <div className="my-radio">
          {this.state.checked === false ? (
            <img
              src={require("./assets/image/click.png")}
              alt=""
              onClick={() => {
                this.showProtocol(1);
              }}
            />
          ) : (
            <img
              src={require("./assets/image/onClick.png")}
              alt=""
              onClick={() => {
                this.cLickRadio(false);
              }}
            />
          )}
          <span>
            我已完全阅读并同意
            <b onClick={() => this.showProtocol(1)}>《个人借款额度合同》</b>
          </span>
          {/* <p className="protocol" onClick={() => this.showProtocol(2)}>《海航白条机票分期业务注册协议》</p> */}
        </div>
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={this.goCredits}
        >
          立即获取额度
        </Button>
        <Modal
          popup
          title="个人借款额度合同"
          visible={this.state.showProtocol}
          maskClosable
          animationType="slide-up"
        >
          <div>
            <div className="title">{protocol.loanContract(this.state.protocolData)}</div>
            <div className="footer">
              <span
                className="no"
                onClick={() => {
                  this.setState({ showProtocol: false }),
                    this.cLickRadio(false);
                }}
              >
                不同意
              </span>
              <Button
                className="yes"
                disabled={this.state.toDisabled}
                onClick={() => {
                  this.setState({ showProtocol: false }),
                    this.cLickRadio(true),
                    this.goCredits();
                }}
              >
                同意{this.state.timeText}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
ReactDOM.render(<HnaIous />, document.getElementById("hnaIous"));
