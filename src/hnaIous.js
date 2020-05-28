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
      protocolData: '',
      isNeed2SignCustomerAuth: false,
      title: '个人借款额度合同',
      showTitle: false,
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.setState({
        ajax: window.api.ajax
      });
      that.gitProtocolData();
      that.gitshowCustomer();
    };
  }



  gitProtocolData = () => {
    let that = this;
    window.api.ajax({
      url: getLink() + getApi('creditAgreementParam'),
      method: 'post',
      headers: {
        Apptoken: window.localStorage.Apptoken
      }
    }, function (ret, err) {
      if (ret.code == '200') {

        that.setState({
          protocolData: ret.data
        })
      } else {
      }
    });
  }
  gitshowCustomer = () => {
    let that = this;
    window.api.ajax({
      url: getLink() + getApi('showCustomer'),
      method: 'post',
      headers: {
        Apptoken: window.localStorage.Apptoken
      }
    }, function (ret, err) {
      if (ret.code == '200') {
        that.setState({
          isNeed2SignCustomerAuth: ret.data.isNeed2SignCustomerAuth
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
    setTimeout(() => {
      let back = document.getElementsByClassName('back_content')[0];
      back.removeEventListener('scroll', () => { })
    }, 200)
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

    setTimeout(() => {
      let back = document.getElementsByClassName('back_content')[0];
      let zation = document.getElementsByClassName('userAuthorization')[0];
      if (back)
        back.addEventListener('scroll', e => {
          let offsetTop = e.target.offsetTop; //滚动条高度
          let scrollTop = e.target.scrollTop; //滚动条到顶部的距离
          let scrollHeight = e.target.scrollHeight; //元素的总高度
          let zationOffsetTop =zation?zation.offsetTop:scrollHeight+100;

          if (scrollTop >= offsetTop-15 && scrollTop < zationOffsetTop-25) {
            this.setState({
              showTitle: true,
              title: '个人借款额度合同'
            })
          } else if (scrollTop >= zationOffsetTop-25 && scrollTop >offsetTop-25) {
       
            this.setState({
              showTitle: true,
              title: '用户授权委托书'
            })
          } else {
            this.setState({
              showTitle: false,
              title: '个人借款额度合同'
            })
          }
        })
    }, 200)




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
        <img src={require("./assets/image/hnaious.png")} alt="" className="banner"/>
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
            <b onClick={() => this.showProtocol(1)}>《个人借款额度合同》{this.state.isNeed2SignCustomerAuth && <span>《用户授权委托书》</span>}</b>
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
       

        {this.state.showProtocol &&
          <div className='hint'>
            <div className='back_wrap'>
              {this.state.showTitle && <div className='back_title'>{this.state.title}</div>}
              <div className='back_content'>
                {protocol.loanContract(this.state.protocolData)}
                {this.state.isNeed2SignCustomerAuth && protocol.userAuthorization}
              </div>
            </div>

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
        }

      </div>
    );
  }
}
ReactDOM.render(<HnaIous />, document.getElementById("hnaIous"));
