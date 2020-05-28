import React from "react";
import ReactDOM from "react-dom";
import {
  NavBar,
  Icon,
  Toast,
  Picker,
  List,
  InputItem,
  Button,
  Modal
} from "antd-mobile";
import { createForm } from "rc-form";
import { getShowTitle } from "./loginToken";
import { getLink, getApi, getMenu } from "./linkConfig";
import * as _ from "lodash";
import "./assets/reset.scss";
import supportBank from "./api/supportBank/supportBank";
import "./addBankPhone.scss";
import Protocol from './common/protocol/protocol'

export default class AddBankPhoneForm extends React.Component {
  static displayName = "AddBankPhone";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      data: {},
      ajax: null,
      disabled: true,
      bankCode: {},
      deviceType: getShowTitle(),
      bankName: [],
      cardNo: "",
      click: false,
      bank: [],
      phone: '',
      showProtocol: false, //查看协议
      error: "请和银行预留手机号保持一致",
      toDisabled: true,
      protocolData: '',
      title: '委托扣款授权书',
      showTitle: false,
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.setState({
        ajax: window.api.ajax,
        // detail: window.api.pageParam,
        cardNo: window.api.pageParam.cardNo,
        bankName: [window.api.pageParam.bankName]
      });

      that.getDate();
      that.getBankData(window.api.pageParam.cardNo);
      that.gitProtocolData(window.api.pageParam.cardNo);
    };
  }

  gitProtocolData = (cardNo) => {
    let that = this;
    window.api.ajax({
      url: getLink() + getApi('withholdAgreementParam') + '?bankCard=' + cardNo,
      method: 'post',
      headers: {
        Apptoken: window.localStorage.Apptoken
      },
    }, function (ret, err) {
      if (ret.code == '200') {

        that.setState({
          protocolData: ret.data
        })

      } else {
      }
    });
  }

  getBankData = (cardNo) => {
    let that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("cardBin") + cardNo,
          method: "get",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
        },
        function (ret, err) {

          if (ret.code == '200') {
            that.setState({
              detail: ret.data
            });
          } else {
            Toast.info(err.body.message, 3)

          }
        }
      );
    }



  }

  getDate = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("supportBank"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
          data: {
            body: {
              "bankCode": ""
            }
          }
        },
        function (ret, err) {
          if (ret) {
            let bank = [];
            ret.data.map(item => {
              let data = {
                label: item.bankName,
                value: item.bankName
              };
              return bank.push(data);
            });
            that.setState({
              bank: bank
            });
          } else {
            Toast.info(err.body.message, 3)

          }
        }
      );
    }
  };

  setPhone = value => {
    if (
      !/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
        value
      )
    ) {
      this.setState({
        hasError: true,
        phone: value,
        disabled: true,
        error: "请输入正确手机号！"
      });
    } else {
      this.setState({
        hasError: false,
        error: "请和银行预留手机号保持一致",
        phone: value
      });
      this.authCode();
    }
  };

  onChangeBankName = value => {
    let that = this;
    that.setState({
      bankName: value
    });

  };

  phoneVerification = () => {
    if (window.api) {
      window.api.openFrame({
        name: "addBankCardAuth",
        url: "./addBankCardAuth.html",
        pageParam: {
          detail: this.state.detail,
          phone: this.state.phone,
        },
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        useWKWebView: true,
        historyGestureEnabled: true
      })
    }

  };

  authCode = () => {
    //验证码手机不能为空
    if (this.state.phone !== "" && this.state.click === true) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };

  cLickRadio = (value) => {
    if (value) {
      setTimeout(() => {
        let protocol = document.getElementsByClassName('protocol')[0];
        protocol.removeEventListener('scroll', () => { })
      }, 200)
      this.setState({
        click: true
      }, () => { this.authCode() });
    } else {
      this.setState({
        click: false
      }, () => { this.authCode() });
    }
  };

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };



  showProtocol = () => {
    //显示协议
    this.setState({
      showProtocol: true,
      toDisabled: true,
    })

    setTimeout(() => {
      let protocol = document.getElementsByClassName('protocol')[0]
      if (protocol) {
        protocol.addEventListener('scroll', e => {
          let offsetHeight = e.target.offsetHeight; //滚动条高度
          let scrollTop = e.target.scrollTop; //滚动条到顶部的距离
          let scrollHeight = e.target.scrollHeight; //元素的总高度
          if (scrollTop >= 23 && scrollTop < 846) {
            this.setState({
              showTitle: true,
              title: '委托扣款授权书'
            })
          } else if (scrollTop >= 846 && scrollTop < 2590) {
            this.setState({
              showTitle: true,
              title: '宝付协议认证支付服务协议'
            })
          } else if (scrollTop >= 2590 && scrollTop > 23) {
            let bankName = this.state.bankName;
            this.setState({
              showTitle: true,
            })
            if (bankName[0] == '中国农业银行' || bankName[0] == '农业银行') {
              this.setState({
                title: '快捷支付授权扣款三方协议',
              })
            } else if (bankName[0] == '中国银行') {
              this.setState({
                title: '中国银行股份有限公司借记卡快捷支付服务协议（总行版）',
              })
            } else if (bankName[0] == '中国建设银行' || bankName[0] == '建设银行') {
              this.setState({
                title: '中国建设银行总对总快捷客户授权协议',
              })
            } else if (bankName[0] == '中国工商银行' || bankName[0] == '工商银行') {
              this.setState({
                title: '中国工商银行快捷支付业务服务协议',
              })
            }
          } else {
            this.setState({
              showTitle: false,
              title: '委托扣款授权书'
            })
          }

          //按钮
          if (offsetHeight + scrollTop >= scrollHeight) {
            this.setState({
              toDisabled: false
            })
          } else {
            this.setState({
              toDisabled: true
            })
          }
        })
      }
    }, 200)


  }

  render() {
    const { getFieldProps } = this.props.form;
    const { detail, bankName } = this.state;
    return (
      <div
        className="addBankPhone"
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
            color: "#333333"
          }}
        >
          添加银行卡
        </NavBar>
        <div style={{ height: "45px" }} />
        <List style={{ backgroundColor: "white" }} className="picker-list">
          <List.Item extra={this.state.cardNo && this.state.cardNo.substring(0, 4) + '****' + this.state.cardNo.substring(this.state.cardNo.length - 4)} arrow="horizontal">
            银行卡号
          </List.Item>
          {detail.bankName ? <List.Item extra={detail.bankName} arrow="horizontal">
            所属银行
          </List.Item> :
            <Picker
              data={this.state.bank}
              {...getFieldProps("bank")}
              cols={1}
              className="forss"
              value={bankName}
              onChange={this.onChangeBankName}
            >
              <List.Item arrow="horizontal">所属银行</List.Item>
            </Picker>}
          <InputItem
            className="bankCard"
            type="number"
            maxLength={11}
            name="phone"
            value={this.state.phone}
            onChange={this.setPhone}
            placeholder="请输入手机号"
          >
            手机号
          </InputItem>
        </List>
        <p className="caution">{this.state.error}</p>
        <div className="my-radio">
          {this.state.click === false ? (
            <img
              src={require("./assets/image/click.png")}
              alt=""
              onClick={() => {
                this.showProtocol();
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
          {detail && <span>我已完全阅读并同意<b onClick={this.showProtocol}>《委托扣款授权书》《宝付协议认证支付服务协议》</b>
            {bankName[0] == '中国工商银行' || bankName[0] == '工商银行' && <b onClick={this.showProtocol}>《银行用户服务协议》</b>}
            {bankName[0] == '中国农业银行' || bankName[0] == '农业银行' && <b onClick={this.showProtocol}>《银行用户服务协议》</b>}
            {bankName[0] == '中国银行' && <b onClick={this.showProtocol}>《银行用户服务协议》</b>}
            {bankName[0] == '中国建设银行' || bankName[0] == '建设银行' && <b onClick={this.showProtocol}>《银行用户服务协议》</b>}

          </span>}
        </div>
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={() => {
            this.phoneVerification();
          }}
        >
          下一步
        </Button>
        <Modal
          popup
          title={this.state.showTitle && this.state.title}
          visible={this.state.showProtocol}
          maskClosable
          animationType="slide-up"
        >
          <div className="title">
            <div className='Modal_content protocol'>
              <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: '800', marginBottom: '15px' }}>委托扣款授权书</div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;鉴于借款人：	{this.state.protocolData && this.state.protocolData.customerName}   (即授权人）与出借人北京聚宝小额贷款有限公司签署的<span className='font'>《个人借款额度合同》、《个人单笔借款合同》</span>（以下简称“借款协议”）,现授权人郑重声明已仔细阅知、理解下述各项规定并同意遵守：<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一、授权人同意被授权人在借款协议约定的限期内（即借款协议签订之日起至借款协议项下的借款全部清偿之日），委托银行或第三方支付机构从本授权书指定的账户内划付应付的费用（包括但不限于借款本金、利息、罚息、 服务费及其他费用）。<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;二、授权人在指定账户中必须保证银行卡状态正常并留有足够余额，否则因账户余额不足或不可归责于被授权人委托方的任何事由，导致无法及时扣款或扣款错误、失败，责任由授权人自行承担。<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;三、 借款协议效力中止或终止后，本授权书效力同时中止或终止，被授权人暂停或终止委托划付款项，借款协议效力恢复后，本授权书效力随即恢复。<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;四、本授权书自授权人签字或盖章之日起生效，至授权人借款协议效力终止时终止。<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;五、授权人同意终止授权或变更账户、通讯地址时，在当期款项交付日3 0 个工作日前向被授权人递交书面通知，否则行承担所造成的风险损失。<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;六、授权人保证本授权书的真实性、合法性、有效性.被授权人依裾本授权书进行的委托扣款操作引起的一切法律纠纷或风险，由授权人独立承担或解决。<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;七、授权人资料:<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;银行卡户名 : {this.state.protocolData && this.state.protocolData.customerName}  <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;银行卡开户银行 : {this.state.protocolData && this.state.protocolData.bankName} <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;银行卡账号 : {this.state.protocolData && this.state.protocolData.accountNo} <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;身份证号码 :{this.state.protocolData && this.state.protocolData.identityNo}<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;联系手机 : {this.state.protocolData && this.state.protocolData.phone} <br />

              <div className='div'>
                <span>授权人(电子签章)： {this.state.protocolData && this.state.protocolData.customerName}</span>
                <span>被授权人（电子签章）: </span>
              </div>
              <div >{Protocol.paymentProtocol}</div>
              {bankName[0] == '中国农业银行' || bankName[0] == '农业银行' && <div >{Protocol.agriculture}</div>}
              {bankName[0] == '中国工商银行' || bankName[0] == '工商银行' && <div >{Protocol.IndustryAndCommerce}</div>}
              {bankName[0] == '中国建设银行' || bankName[0] == '建设银行' && <div >{Protocol.construction}</div>}
              {bankName[0] == '中国银行' && <div >{Protocol.BankOfChina}</div>}
            </div>

          </div>
          <div className="footer">
            {/* <span
              className="no"
              onClick={() => {
                this.setState({ showProtocol: false }),
                  this.cLickRadio(false);
              }}
            >
              不同意
              </span> */}
            <Button
              className="yes"
              disabled={this.state.toDisabled}
              onClick={() => {
                this.setState({ showProtocol: false }),
                  this.cLickRadio(true)
              }}
            >
              请上滑看完本条款再同意
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}
const AddBankPhone = createForm()(AddBankPhoneForm);
ReactDOM.render(<AddBankPhone />, document.getElementById("addBankPhone"));
