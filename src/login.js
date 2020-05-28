import React from "react";
import ReactDOM from "react-dom";
import { Button, InputItem, Radio, TabBar, Toast, Modal, NavBar, Icon } from "antd-mobile";
import "antd-mobile/dist/antd-mobile.css";
import loginApi from "./api/login/login";
import md5 from "js-md5";
import { getLink, getApi, getMenu } from "./linkConfig";
import { setH5Token, setToken } from "./loginToken";
import "./assets/reset.scss";
import "./login.scss";
import protocol from './common/protocol/protocol.js'
import { nonsense } from "antd-mobile/lib/picker";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef;
    this.state = {
      type: "1",
      hidden: false,
      phone: "",
      passsword: "",
      hasError: false,
      disabled: true,
      visible: false,
      loginType: false,
      countDisabled: true,
      downDisabled: true,
      smsCode: "",
      inputType: "password",
      error: "",
      timeText: "",
      icon: "&#xe637;",
      openFrame: null,
      closeFrame: null,
      ajax: null,
      checked: false,
      showProtocol: false, //查看app协议
      privacyAgreement: false, //查看隐私协议
      newUser: null,
      picture: false, //是否显示图片验证码
      src: '', //图片验证码地址
      codeValue: '', //图片验证码
      showImg: true,
      overduePopUp: false,//是否逾期提示
      overdueDetails: {},//客户逾期信息查询
      rets:{},
      marginBottom:""
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.setState({
        ajax: window.api.ajax,
        closeFrame: window.api.closeFrame,
        openFrame: window.api.openFrame
      });
    };
  }

  decide = () => {
    //密码登录不能为空
    if (this.state.phone !== "" && this.state.passsword !== "") {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };

  authCode = () => {
    this.setState({
      disabled: false
    });
  };

  iconimg = () => {
    this.setState({

    })
  }

  phoneOnChange = value => {
    // 手机输入
    if (value.replace(/\s*/g, '').length < 11) {
      this.setState({
        hasError: true,
        phone: value,
        disabled: true,
        error: "请输入正确手机号！",
        // errorMsg: '' ,
      });
    } else {
      this.setState({
        hasError: false,
        error: "",
        phone: value
      });
      if (this.state.type === "code") {
        this.decide();
      } else {
        this.authCode();
      }
      this.setState({
        value,
      });
    }
  };

  passwordOnChange = value => {
    //密码输入
    if (value) {
      this.setState({
        passsword: value
      });
      this.decide();
    } else {
      this.setState({
        passsword: value,
        disabled: true
      });
    }
  };

  passwordLogin = () => {
    //密码登录
    const that = this;
    let data = {
      loginName: that.state.phone.replace(/\s*/g, ""),
      loginPassword: md5(that.state.passsword).toUpperCase(),
      loginIp: returnCitySN["cip"]
    };
    const from = window.api.pageParam.from;
    let marginBottom = "";
    if (from === "userInfo") {
      marginBottom = window.api.safeArea.bottom + 50;
    } else {
      marginBottom = window.api.safeArea.bottom;
    }
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("loginPasswordLogin"),
          method: "post",
          returnAll: true,
          headers: {
            "Content-Type": "application/json"
          },
          dataType: "json",
          data: {
            body: data
          }
        },
        function (ret, err) {
          if (ret.body.code === "200") {
            Toast.info("登录成功", 3)
            setH5Token(ret.body.data);
            setToken(ret.headers.Apptoken);
            let rets = ret
            window.api.ajax(
              {
                url: getLink() + getApi("overdueDetail"),
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
                    overdueDetails: ret.data,
                    rets: {},
                    marginBottom:""
                  });
                  if (ret.data.overdue) {
                    that.setState({
                      overduePopUp: true,
                      rets:rets,
                      marginBottom: marginBottom
                    })
                  } else {
                    that.judgeJump(rets, from, marginBottom)
                  }
                } else {
                  that.judgeJump(rets, from, marginBottom)
                }
              })
            // if (ret.body.data.isNeed2CreditPage) { //true 非重叠客户 false 重叠客户
            //   window.api.openFrame({
            //     name: 'hnaIous',
            //     url: "./hnaIous.html",
            //     rect: {
            //       w: "auto",
            //       marginTop: window.api.safeArea.top,
            //       marginBottom: window.api.safeArea.bottom

            //     },
            //     reload: true,
            //     useWKWebView: true,
            //     historyGestureEnabled: true
            //   });
            //   window.api.closeFrame({ name: "login" });
            //   window.api.closeFrame({ name: "supplementProtocol" });
            // } else 
            // if (ret.body.data.isNeed2Sign) { //是否补充协议
            //   window.api.openFrame({
            //     url: "./supplementProtocol.html",
            //     name: "supplementProtocol",
            //     rect: {
            //       w: "auto",
            //       marginTop: window.api.safeArea.top,
            //       marginBottom: window.api.safeArea.bottom
            //     },
            //     pageParam: {
            //       data: 'login',
            //       isNeed2CreditPage: ret.body.data.isNeed2CreditPage,
            //       from: from,
            //       isNeed2SignCustomerAuth: ret.body.data.isNeed2SignCustomerAuth

            //     },
            //     useWKWebView: true,
            //     historyGestureEnabled: true,

            //   });
            //   window.api.closeFrame({ name: "login" });

            // } else {
            //     window.api.openFrame({
            //       name: from,
            //       url: "./" + from + ".html",
            //       reload: true,
            //       rect: {
            //         w: "auto",
            //         marginTop: window.api.safeArea.top,
            //         marginBottom: marginBottom
            //       },
            //       reload: true,
            //       useWKWebView: true,
            //       historyGestureEnabled: true
            //     });
            //     window.api.closeFrame({ name: "login" });
            // }
          } else {
            if (err) {
              Toast.info("请求失败", 3)

            } else {
              Toast.info(ret.body.message, 3)

            }
          }
        }
      );
    } else {
      loginApi.passwordLogin(data).then(res => {
        if (res.data.code === "200") {
          Toast.success("登录成功", 1);
          setH5Token(res.data.data);
          setToken(res.headers.apptoken);
        } else {
          res.data.message && Toast.fail(res.data.message, 1);
        }
      });
    }
  };

  onVisible = () => {
    //密码是否可见
    if (this.state.visible === false) {
      this.setState({
        visible: true,
        inputType: null
      });
    } else {
      this.setState({
        visible: false,
        inputType: "password"
      });
    }
  };
  goBack = () => {
    //返回上一页
    const from = window.api.pageParam.from;
    let marginBottom = "";
    if (from === "userInfo") {
      marginBottom = window.api.safeArea.bottom + 50;
    } else {
      marginBottom = window.api.safeArea.bottom;
    }
    window.api.openFrame({
      name: from,
      url: "./" + from + ".html",
      // reload: true,
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: marginBottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
    window.api.closeFrame({ name: "login" });
  };

  cLickRadio = (value) => {
    //点击勾选协议
    if (value) {
      this.setState({
        checked: true,
      });
      if (this.state.smsCode !== "") {
        this.setState({
          countDisabled: false
        });
      } else {
        this.setState({
          countDisabled: true
        });
      }
    } else {
      this.setState({
        checked: false,
        countDisabled: true
      });
    }

  };


  nextStep = () => {

    this.setState({
      picture: true,
      src: getLink() + getApi('loginCaptcha') + '/' + this.state.phone.replace(/\s*/g, "") + '?t=' + new Date().getTime(),

    });

  };

  //输入验证码，校验登录按钮
  verificationOnChange = (value) => {

    const from = window.api.pageParam.from;
    if (value == "") {
      this.setState({
        countDisabled: true,
        smsCode: value
      });
    } else {

      if (this.state.checked) {
        this.setState({
          countDisabled: false,
          smsCode: value
        });
      } else {
        this.setState({
          countDisabled: true,
          smsCode: value
        });
      };
      if (value.length === 4 && this.state.checked && !this.state.newUser) {

        let data = {
          phone: this.state.phone,
          smsCode: value,
          loginIp: returnCitySN["cip"]
        };
        let marginBottom = "";
        if (from === "userInfo") {
          marginBottom = window.api.safeArea.bottom + 50;
        } else {
          marginBottom = window.api.safeArea.bottom;
        }
        if (window.api) {
          window.api.ajax(
            {
              url: getLink() + getApi("loginSmsLogin"),
              method: "post",
              returnAll: true,
              headers: {
                "Content-Type": "application/json"
              },
              dataType: "json",
              data: {
                body: data
              }
            },
            function (ret, err) {

              if (ret.body.code === "200") {
                Toast.info('登录成功', 3)

                setH5Token(ret.body.data.token);
                setToken(ret.headers.Apptoken);

              } else {
                if (err) {
                  Toast.info("请求失败", 3)

                } else {
                  // Toast.info(ret.body.message, 3)

                }
              }
            }
          );
        }

      }
    }
  };

  codeLogin = () => {
    //  验证码登录
    const that = this;
    let data = {
      phone: that.state.phone.replace(/\s*/g, ""),
      smsCode: that.state.smsCode,
      loginIp: returnCitySN["cip"]
    };
    const from = window.api.pageParam.from;
    let marginBottom = "";
    if (from === "userInfo") {
      marginBottom = window.api.safeArea.bottom + 50;
    } else {
      marginBottom = window.api.safeArea.bottom;
    }
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("loginSmsLogin"),
          method: "post",
          returnAll: true,
          headers: {
            "Content-Type": "application/json"
          },
          dataType: "json",
          data: {
            body: data
          }
        },
        function (ret, err) {
          if (ret.body.code === "200") {
            Toast.info('登录成功', 3)
            setH5Token(ret.body.data.token);
            setToken(ret.headers.Apptoken);
            let rets = ret 
            window.api.ajax(
              {
                url: getLink() + getApi("overdueDetail"),
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
                    overdueDetails: ret.data,
                    rets:{},
                    marginBottom: ""
                  });
                  console.log("2:" + JSON.stringify(ret.data))
                  if (ret.data.overdue) {
                    that.setState({
                      overduePopUp: true,
                      rets:rets,
                      marginBottom: marginBottom
                    })
                  } else {
                    that.judgeJump(rets, from, marginBottom)
                  }
                }else {
                  that.judgeJump(rets, from, marginBottom)
                }
              })
            // if (ret.body.data.isNeed2CreditPage) { //true 非重叠客户 false 重叠客户
            //   window.api.openFrame({
            //     name: 'hnaIous',
            //     url: "./hnaIous.html",
            //     rect: {
            //       w: "auto",
            //       marginTop: window.api.safeArea.top,
            //       marginBottom: window.api.safeArea.bottom

            //     },
            //     reload: true,
            //     useWKWebView: true,
            //     historyGestureEnabled: true
            //   });
            //   window.api.closeFrame({ name: "login" });
            //   window.api.closeFrame({ name: "supplementProtocol" });
            // } else
          } else {
            if (err) {
              Toast.info("请求失败", 3)

            } else {
              Toast.info(ret.body.message, 3)

            }
          }
        }
      );
    } else {
      loginApi.smsLogin(data).then(res => {
        if (res.data.code === "200") {
          Toast.success("登录成功", 1);
          setH5Token(res.data.data);
          setToken(res.headers.apptoken);
        } else {
          res.data.message && Toast.fail(res.data.message, 2);
        }
      });
    }
  };

  judgeJump = (ret, from, marginBottom) =>{
    if (ret.body.data.isNeed2Sign) {   //是否补充协议
      window.api.openFrame({
        url: "./supplementProtocol.html",
        name: "supplementProtocol",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        pageParam: {
          data: 'login',
          isNeed2CreditPage: ret.body.data.isNeed2CreditPage,
          from: from,
          isNeed2SignCustomerAuth: ret.body.data.isNeed2SignCustomerAuth
        },
        useWKWebView: true,
        historyGestureEnabled: true,

      });
      window.api.closeFrame({ name: "login" });

    } else if (ret.body.data.setLoginPassword == false) {
      window.api.openFrame({
        url: "./setPassword.html",
        name: "setPassword",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        reload: true,
        pageParam: {
          from: from,
        },
        useWKWebView: true,
        historyGestureEnabled: true,

      });
    } else {
      window.api.openFrame({
        name: from,
        url: "./" + from + ".html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: marginBottom
        },
        reload: true,
        useWKWebView: true,
        historyGestureEnabled: true
      });
      window.api.closeFrame({ name: "login" });
    }
  }

  forgetPassword = () => { // 忘记密码
    const from = window.api.pageParam.from;
    window.api.openFrame({
      url: "./forgetPassword.html",
      name: "forgetPassword",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      pageParam: {
        from: from
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  }


  //图片验证码
  changeCode = (value) => {

    let that = this;
    this.setState({
      codeValue: value
    })
    if (value.replace(/\s+/g, "").length == 4) {

      window.api.ajax({
        url: getLink() + getApi('sendSmsCode'),
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          body: {
            phone: that.state.phone.replace(/\s*/g, ""),
            captcha: value,
            loginIp: returnCitySN["cip"]
          }
        }
      },
        (res, err) => {
          if (res.code == '200') {
            //是不是新用户
            if (res.data.newUser) {
              that.setState({ newUser: res.data.newUser })
            } else {
              that.setState({ newUser: res.data.newUser, checked: true })
            }

            Toast.info('验证码已发送', 2)
            that.setState({
              picture: false,
              codeValue: '',
            })

            this.setState({
              timeText: 60 + "s",
            });
            //发送验证码
            this.setState({
              loginType: true
            });
            let timeo = 60;
            let timeStop = setInterval(() => {
              timeo--;
              if (timeo > 0) {
                this.setState({
                  timeText: timeo + "s",
                  downDisabled: true
                });
              } else {
                timeo = 60; //当减到0时赋值为60
                this.setState({
                  timeText: "重新发送",
                  downDisabled: false,
                  smsCode: ''
                });
                clearInterval(timeStop); //清除定时器
              }
            }, 1000);
          } else {

            that.setState({
              picture: true,
              codeValue: '',
              src: getLink() + getApi('loginCaptcha') + '/' + this.state.phone.replace(/\s+/g, "") + '?t=' + new Date().getTime(),
            })
            Toast.info(res.message, 3)

          }

          if (err) {
            Toast.info(err.body.message, 3)

            setTimeout(() => {
              this.setState({
                src: getLink() + getApi('loginCaptcha') + '/' + this.state.phone + '?t=' + new Date().getTime(),
              })
            }, 3000)
          }
        },
      )

    }
  }

  scroll = () => {
    let that = this;
    if (that.state.newUser) {
      setTimeout(() => {
        window.scroll(0, 110);
        that.setState({
          showImg: false
        })
      }, 250)
    }

  }

  onClose = () => {
    this.setState({ overduePopUp: false });
    const from = window.api.pageParam.from;
    console.log("we: "+JSON.stringify(from))
    this.judgeJump(this.state.rets, from, this.state.marginBottom)
  }


  render() {

    let { picture } = this.state;
    //图形验证码
    let pictureModule = <div className='picture_wrap'>
      <div className='content'>
        <img src={require('./assets/image/close.png')} className='close' onClick={() => this.setState({ picture: false, codeValue: '' })} />
        <div className='title' >
          即将给{this.state.phone.substring(0, 3) + '****' + this.state.phone.substring(this.state.phone.length - 4)}
          发短信验证码，请输入以下图形验证码：
          </div>
        <div className='from'>
          <InputItem placeholder='图形验证码' maxLength='4' type='text'
            value={this.state.codeValue} onChange={this.changeCode}
            style={{ width: '100%', height: '100%', }}
            autoFocus
          />
          <img src={this.state.src} />
          <img className='refresh' src={require('./assets/image/refresh.png')} onClick={() => this.setState({ src: getLink() + getApi('loginCaptcha') + '/' + this.state.phone + '?t=' + new Date().getTime() })} />
        </div>

      </div>
    </div>

    //验证码登陆模块
    let codeModule = <div className='codeModule'>
      {this.state.loginType === false ? (
        <div className="formInput">
          <InputItem
            name="phone"
            onChange={this.phoneOnChange}
            placeholder="请输入手机号码"
            value={this.state.phone}
            clear
            type='phone'
          // maxLength={11}
          />
          {this.state.error === "" ? null : (
            <p className="error">{this.state.error}</p>
          )}
          <Button
            className="next"
            disabled={this.state.disabled}
            style={{ background: "#E0514C", color: "#fff" }}
            onClick={this.nextStep}
          >
            下一步
                </Button>
        </div>
      ) : (
          <div className="formInput">
            <p className="validationTips">
              验证码会发送至{this.state.phone.substring(0, 3) + '****' + this.state.phone.substring(8, 13)}
            </p>
            <InputItem
              name="verificationCode"
              type="number"
              placeholder="请输入手机验证码"
              onChange={this.verificationOnChange}
              value={this.state.smsCode}
              maxLength={4}
              clear
              onFocus={this.scroll}
              onBlur={() => { this.setState({ showImg: true }) }}
            />
            <Button
              className="coundDown"
              disabled={this.state.downDisabled}
              onClick={this.nextStep}
            >
              {this.state.timeText}
            </Button>
            <Button
              className="next"
              disabled={this.state.countDisabled}
              style={{ background: "#E0514C", color: "#fff" }}
              onClick={this.codeLogin}
            >
              登录
                </Button>
          </div>
        )}
      {this.state.newUser === true ? (
        <div className="readTheAgreement">
          {this.state.checked === false ? (
            <img
              src={require("./assets/image/click.png")}
              alt=""
              onClick={() => { this.cLickRadio(true) }}
            />
          ) : (
              <img
                src={require("./assets/image/onClick.png")}
                alt=""
                onClick={() => { this.cLickRadio(false) }}
                className="kuang"
              />
            )}
          <span className="confirm">
            请确认已阅读并同意
          </span>
          <div className="protocol">
            <span onClick={() => this.setState({ showProtocol: true })}>《航旅分期服务协议》</span>
            <span onClick={() => { this.setState({ privacyAgreement: true }) }}>《航旅分期隐私协议》</span>
          </div>
          <p>未注册时将自动注册账号</p>
        </div>
      ) : null}
    </div>


    //账号登录模块
    let passWordModule = <div className='passWordModule'>
      <div className="formInput">
        <InputItem
          name="phone"
          onChange={this.phoneOnChange}
          placeholder="请输入手机号码"
          clear
          type='phone'
          value={this.state.phone}
          onFocus={this.iconimg}
        // maxLength={11}
        />
        {this.state.error === "" ? null : (
          <p className="error">{this.state.error}</p>
        )}
        <div className="password">
          <InputItem
            name="passsword"
            type={this.state.inputType}
            onChange={this.passwordOnChange}
            value={this.state.passsword}
            clear
            extra="      "
            placeholder="请输入登录密码"
          />
          <span className="visible" onClick={this.onVisible}>
            {this.state.visible === false ? (
              <img
                className="eye2"
                src={require("./assets/image/Fill.png")}
              />
            ) : (
                <img
                  className="eye"
                  src={require("./assets/image/yanjing.png")}
                />
              )}
          </span>
        </div>
        <Button
          className="next"
          disabled={this.state.disabled}
          style={{ background: "#E0514C", color: "#fff" }}
          onClick={this.passwordLogin}
        >
          登录
              </Button>
        <p
          style={{
            width: "100%",
            textAlign: "center",
            fontSize: "14px",
            lineHeight: "20px",
            color: "#E1514C"
          }}

          onClick={this.forgetPassword}
        >
          忘记密码
              </p>
      </div>

    </div>



    return (
      <div >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.goBack()}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            width: "100%",
            zIndex: 10,
            fontSize: "18px",
            color: "#333333",
            borderBottom: '1px solid #EEEEEE'
          }}
        >
          登录
        </NavBar>

        <div className='login_content_wrap'>
          {this.state.showImg && <img
            className="logo"
            src={require("./assets/image/login-logo.png")}
            alt=""
          />}
          <div className='login_content'>
            <div onClick={() => this.setState({ type: '1' })} className={this.state.type == '1' ? 'login_title' : 'login_title2'} >验证码登录/注册</div>
            <div onClick={() => this.setState({ type: '2' })} className={this.state.type == '2' ? 'login_title' : 'login_title2'} >密码登录</div>
          </div>

          {this.state.type === '1' ? codeModule : passWordModule}


          <Modal
            popup
            title="航旅分期服务协议"
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
          <Modal
            popup
            title="航旅分期隐私协议"
            visible={this.state.privacyAgreement}
            closable
            maskClosable
            animationType="slide-up"
            onClose={() => {
              this.setState({ privacyAgreement: false });
            }}
          >
            {protocol.privacyProtocol}
          </Modal>

          {/*图片验证码*/}
          {picture && pictureModule}
          {/*客户逾期信息提醒 */}
          <Modal
            className="overduePopUp"
            visible={this.state.overduePopUp}
            closable
            onClose={this.onClose}
            popup
          >
            <h2>逾期通知</h2>
            <p>
              尊敬的{this.state.overdueDetails.customerName}客户,截止到{this.state.overdueDetails.closingDate},您有<span style={{color:"#e1514c"}}>逾期金额{this.state.overdueDetails.overdueAmount}元</span>尚未结清，请您尽快还款，以免影响<span style={{color:"#e1514c"}}>个人征信</span>。<br />
              <p>如您拒不还款，我们将移交平台法务部门<span style={{ color: "#e1514c" }}>司法处理</span></p>
            </p>
          </Modal>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Login />, document.getElementById("login"));
