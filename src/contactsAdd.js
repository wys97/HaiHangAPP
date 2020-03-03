import React from "react";
import ReactDOM from "react-dom";
import "./contactsAdd.scss";
import "./assets/reset.scss";
import { createForm } from "rc-form";
import * as _ from "lodash";
import contactsApi from "./api/contacts/contacts";
import { getLink, getApi, getMenu } from "./linkConfig";
import {
  List,
  NavBar,
  Icon,
  Toast,
  Button,
  Modal,
  Picker,
  InputItem
} from "antd-mobile";

export default class ContactsAddForm extends React.Component {
  static displayName = "ContactsAdd";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      bankCode: {},
      ajax: null,
      contactPhone: "",
      hasError: false,
      error: "",
      contactName: "",
      contactRelation: [],
      disabled: true,
      updata: false,  //是否修改联系人
      data: {}, //联系人的数据
      length: '', //联系人的长度
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.setState({
        ajax: window.api.ajax
      });
      //页面传参
      if (window.api.pageParam.data) {
        console.log(JSON.stringify(window.api.pageParam.data))
        that.setState({
          updata: true,
          disabled: false,
          data: window.api.pageParam.data,
          contactPhone: window.api.pageParam.data.contactPhone,
          contactName: window.api.pageParam.data.contactName,
          contactRelation: [window.api.pageParam.data.contactRelation],
        });
      }

      if (window.api.pageParam.length) {
        that.setState({
          length: window.api.pageParam.length
        })
      }

    };
  }

  relation = [
    {
      label: <div className="relation"><b>亲人</b><span>配偶</span></div>,
      value: "SPOUSE"
    },
    {
      label: <div className="relation"><b>亲人</b><span>父母</span></div>,
      value: "PARENT"
    },
    {
      label: <div className="relation"><b>亲人</b><span>子女</span></div>,
      value: "CHILD"
    },
    {
      label: <div className="relation"><b>亲人</b><span>兄弟</span></div>,
      value: "BROTHER"
    },
    {
      label: <div className="relation"><b>亲人</b><span>姐妹</span></div>,
      value: "SISTER"
    },
    {
      label: <div className="relation"><i>朋友</i></div>,
      value: "FRIEND"
    },
    {
      label: <div className="relation"><i>同学</i></div>,
      value: "CLASSMATER"
    },
    {
      label: <div className="relation"><i>同事</i></div>,
      value: "COLLEAGUE"
    }
  ];

  getAdd = () => {
    let data = {
      contactType: "COMMON",
      contactRelation: this.state.contactRelation[0],
      contactName: this.state.contactName,
      contactPhone: this.state.contactPhone
    };
    let that = this;
    if (!window.api.pageParam.data) {
      //新增联系人
      window.api.ajax(
        {
          url: getLink() + getApi("contacInfoSave"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
          data: {
            body: data
          }
        },
        function (ret, err) {
          console.log(JSON.stringify(ret))
          if (ret.code === "200") {
            window.api.openFrame({
              name: "contactsList",
              url: "./contactsList.html",
              reload: true,
              rect: {
                w: "auto",
                marginTop: window.api.safeArea.top,
                marginBottom: window.api.safeArea.bottom
              },
              useWKWebView: true,
              historyGestureEnabled: true
            });
            window.api.closeFrame({ name: "contactsAdd" });
          } else {
            if (err) {
              Toast.info('请求失败', 3)

            } else {
              Toast.info(ret.message, 3)

            }
          }
        }
      );
    } else {
      //修改联系人
      window.api.ajax(
        {
          url: getLink() + getApi("contacInfoUpdate"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
          data: {
            body: {
              contactType: this.state.data.contactType,
              contactRelation: this.state.contactRelation[0],
              contactName: this.state.contactName,
              contactPhone: this.state.contactPhone,
              contactId: this.state.data.contactId,
            }
          }
        },
        (res, err) => {
          if (res.code == '200') {
            window.api.openFrame({
              name: "contactsList",
              url: "./contactsList.html",
              reload: true,
              rect: {
                w: "auto",
                marginTop: window.api.safeArea.top,
                marginBottom: window.api.safeArea.bottom
              },
              useWKWebView: true,
              historyGestureEnabled: true
            });
            window.api.closeFrame({ name: "contactsAdd" });
          } else {
            Toast.info(ret.message, 3)
          }
        },
      )
      if (err) {
        Toast.info(err.msg, 3)
      }
    }
  };

  decide = () => {
    //不能为空
    if (this.state.contactPhone !== "" && this.state.contactRelation !== [] && this.state.contactName !== "") {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };

  contactPhone = value => {
    if (
      !/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
        value
      )
    ) {
      this.setState({
        hasError: true,
        contactPhone: value,
        disabled: true,
        error: "请输入正确手机号！"
      });
    } else {
      this.setState({
        hasError: false,
        error: "",
        contactPhone: value
      }, () => { this.decide() })
    }
  }

  dataOnChange = value => {
    this.setState({
      contactRelation: value
    }, () => { this.decide() })

  }

  contactNameChange = value => {
    this.setState({
      contactName: value
    }, () => { this.decide() })
  }

  goBack = () => {
    if (window.api) {
      window.api.openFrame({
        name: "contactsList",
        url: "./contactsList.html",
        reload: true,
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom
        },
        useWKWebView: true,
        historyGestureEnabled: true
      });
      window.api.closeFrame({ name: "contactsAdd" });
    }
  };

  render() {
    const { getFieldProps } = this.props.form;
    return (
      <div
        className="contactsAdd"
        style={{ minHeight: "100%", backgroundColor: "#FFF" }}
      >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#444D54" />}
          onLeftClick={() => this.goBack()}
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 100,
            fontSize: "17px",
            color: "#444D54"
          }}
        >
          {this.state.updata ? '修改联系人' : "常用联系人" + Number(this.state.length+1)  + ""}
        </NavBar>
        <div style={{ height: "45px" }} />
        <List style={{ backgroundColor: "white" }} className="picker-list">
          <Picker
            data={this.relation}
            cols={1}
            extra='请选择 至少1人为亲属关系'
            className="forss"
            value={this.state.contactRelation}
            onOk={this.dataOnChange}
          >
            <List.Item arrow="horizontal">关系</List.Item>
          </Picker>
          <InputItem
            clear
            name="contactName"
            placeholder="请输入姓名"
            value={this.state.contactName}
            onChange={this.contactNameChange}
          >
            姓名
          </InputItem>
          <InputItem
            clear
            type="number"
            maxLength={11}
            name="contactPhone"
            value={this.state.contactPhone}
            onChange={this.contactPhone}
            placeholder="请输入手机号"
          >
            手机号
          </InputItem>
        </List>
        {this.state.error === "" ? null : (
          <p className="error">{this.state.error}</p>
        )}
        <div className='hint'>*请如实填写联系人信息，否则会导致授信审核失败</div>
        <Button className="next" disabled={this.state.disabled} onClick={this.getAdd}>
          保存
        </Button>
      </div>
    );
  }
}

const ContactsAdd = createForm()(ContactsAddForm);
ReactDOM.render(<ContactsAdd />, document.getElementById("contactsAdd"));
