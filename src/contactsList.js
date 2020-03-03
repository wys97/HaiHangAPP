import React from "react";
import ReactDOM from "react-dom";
import "./contactsList.scss";
import "./assets/reset.scss";
import * as _ from "lodash";
import { getLink, getApi, getMenu } from "./linkConfig";
import { List, NavBar, Icon, Toast, Button, Modal } from "antd-mobile";

const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
export default class ContactsList extends React.Component {
  static displayName = "ContactsList";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      bankCode: {},
      ajax: null,
      visible: false,
      disabled: true,
      detail: {},
      length: null, //联系人的个数长度
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.getDate();
      that.setState({
        ajax: window.api.ajax
      });
    };
  }

  componentDidMount() { }

  getDate = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("contacInfoList"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function (ret, err) {
          if (ret) {
            that.setState({
              data: ret.data,
              length: ret.data.length
            });
            if (ret.data !== "") {
              that.setState({
                disabled: false
              })
            }
          } else {
            if (err.msg !== '') {
              Toast.info(err.msg, 4)

            } else {
              Toast.info(ret.message, 4)

            }
          }
        }
      );
    }
    // contactsApi.contactInfo().then(res => {
    //   if (res.data.code === "200") {
    //     that.setState({
    //       data: res.data.data
    //     });
    //   } else {
    //     res.data.message && Toast.fail(res.data.message, 1);
    //   }
    // });
  };



  deleteData = (item) => {
    //删除联系人
    let contactId = item.contactId;
    const that = this
    alert('', '确定删除【' + item.contactName + '】吗？', [
      {
        text: '删除', onPress: () => {
          window.api.ajax(
            {
              url: getLink() + getApi("contacInfoDelete") + contactId,
              method: "post",
              dataType: "json",
              headers: {
                "Content-Type": "application/json",
                Apptoken: window.localStorage.Apptoken
              }
            },
            function (ret, err) {
              if (ret.code === "200") {
                that.getDate()
              } else {
                if (err) {
                  Toast.info("请求失败", 3)
                } else {
                  Toast.info(ret.message, 3)

                }
              }
            }
          );

        }
      },
      {
        text: '取消', onPress: () => {

        }
      },
    ])

  }

  goContactsAmend = index => {
    // 修改联系人
    window.api.openFrame({
      name: 'contactsAdd',
      url: './contactsAdd.html',
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      pageParam: {
        data: index,
      },
      useWKWebView: true,
      historyGestureEnabled: true
    })
  };

  goContactsAdd = () => {
    if (this.state.data.length < 10) {
      window.api.openFrame({
        name: "contactsAdd",
        url: "./contactsAdd.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        pageParam:{
          length:this.state.length
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
    }
  };

  getDetail = index => {
    let detail = {
      contactRelationText: this.state.data[index].contactRelationText,
      contactName: this.state.data[index].contactName,
      contactPhone: this.state.data[index].contactPhone
    };
    this.setState({
      detail,
      visible: true,
    })
  };

  goCreditResult = () => {
    let contactRelationText = 0
    this.state.data.map(item => {
      if (item.contactRelationText === "配偶") {
        contactRelationText += 1
      }
      if (item.contactRelationText === "父母") {
        contactRelationText += 1
      }
      if (item.contactRelationText === "子女") {
        contactRelationText += 1
      }
      if (item.contactRelationText === "兄弟") {
        contactRelationText += 1
      }
      if (item.contactRelationText === "姐妹") {
        contactRelationText += 1
      }
    })
    if (this.state.data.length < 2) {
      Toast.info("请至少添加两位联系人！", 3)
    } else if (contactRelationText === 0) {
      Toast.info("请至少添加一位亲人！", 3)
    } else {
      window.api.openFrame({
        name: "creditResult",
        url: "./creditResult.html",
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
    }
  }

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    const { data, detail } = this.state;
    return (
      <div
        className="contactsList"
        style={{ minHeight: "100%", backgroundColor: "#FFF" }}
      >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.goBack()}
          rightContent={[
            <img
              key="delete"
              src={require("./assets/image/addContacts.png")}
              alt=""
              onClick={() => {
                this.goContactsAdd()
              }}
            />
          ]}
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1,
            fontSize: "17px",
            color: "#333333",
            // borderBottom: "1px solid #EFEFEF"
          }}
        >
          联系人
        </NavBar>
        <div style={{ height: "45px" }} />
        <div className="list">
          {data.map((item, index) => {
            return (
              <div key={index} className="list-title">
                <div
                  className='l_text'
                  onClick={() => {
                    this.getDetail(index);
                  }}
                >
                  <span className="relation">{item.contactRelationText}</span>
                  <span className="name">{'*' + item.contactName.substring(1)}</span>
                </div>
                <span
                  className="phone"
                  onClick={() => {
                    this.getDetail(index);
                  }}
                >
                  {JSON.stringify(item.contactPhone).substring(1, 4) + '****' + JSON.stringify(item.contactPhone).substring(9, 12)}
                </span>
                <div className='r_img'>
                  <img
                    className="amend"
                    src={require("./assets/image/xiugai.png")}
                    alt=""
                    onClick={() => { this.goContactsAmend(item) }}
                  />
                  <img
                    className="amend"
                    src={require("./assets/image/deleter.png")}
                    alt=""
                    onClick={() => { this.deleteData(item) }}
                  />
                </div>

              </div>
            );
          })}
          {data.length === 10 ? (
            <div className="warn">*仅能添加10个联系人，目前已达上限</div>
          ) : null}
        </div>
        <div className='hint'>*请如实填写联系人信息，否则会导致授信审核失败</div>
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={this.goCreditResult}
        >
          提交
        </Button>
        <Modal
          className="detail-cpm"
          visible={this.state.visible}
          closable
          onClose={() => { this.setState({ visible: false }) }}
          maskClosable={false}
          transparent
        >
          <div className="detail">
            <p>
              关系：<span>{detail.contactRelationText}</span>
            </p>
            <p>
              姓名：<span>{detail.contactName}</span>
            </p>
            <p>
              手机号：<span>{detail.contactPhone}</span>
            </p>
            <b></b>
          </div>
        </Modal>
      </div>
    );
  }
}

ReactDOM.render(<ContactsList />, document.getElementById("contactsList"));
