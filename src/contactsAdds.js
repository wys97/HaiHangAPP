import React from "react";
import ReactDOM from "react-dom";
import "./contactsAdd.scss";
import "./assets/reset.scss";
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

export default class ContactsAdds extends React.Component {
  static displayName = "ContactsAdds";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      bankCode: {},
      ajax: null,
      contactPhone1: "",
      contactPhone2: "",
      hasError: false,
      hasError2: false,
      error: "",
      error2: "",
      contactName1: "",
      contactName2: "",
      contactRelation1: [],
      ontactRelation2: [],
      disabled: true,

    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.setState({
        ajax: window.api.ajax
      });
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
    let data = [
      {
        contactType: "COMMON",
        contactRelation: this.state.contactRelation1[0],
        contactName: this.state.contactName1,
        contactPhone: this.state.contactPhone1
      },
      {
        contactType: "COMMON",
        contactRelation: this.state.contactRelation2[0],
        contactName: this.state.contactName2,
        contactPhone: this.state.contactPhone2
      }];
    console.log("联系人：" + JSON.stringify(data))
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("contacInfoSaveBatch"),
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
          console.log(JSON.stringify(err))
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
      contactsApi.contactInfoSave(data).then(res => {
        if (res.data.code === "200") {
        } else {
          res.data.message && Toast.fail(res.data.message, 1);
        }
      });
    }
  };

  decide = () => {
    //不能为空
    if (this.state.contactPhone1 !== "" && this.state.contactRelation1 !== [] && this.state.contactName1 !== "" && this.state.contactPhone2 !== "" && this.state.contactRelation2 !== [] && this.state.contactName2 !== "") {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };

  contactPhone1 = value => {    //常用联系人手机1
    if (
      !/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
        value
      )
    ) {
      this.setState({
        hasError: true,
        contactPhone1: value,
        disabled: true,
        error: "请输入正确手机号！"
      });
    } else {
      this.setState({
        hasError: false,
        error: "",
        contactPhone1: value
      });
      this.decide();
    }
  }
  contactPhone2 = value => {    //常用联系人手机2
    if (
      !/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/.test(
        value
      )
    ) {
      this.setState({
        hasError2: true,
        contactPhone2: value,
        disabled: true,
        error2: "请输入正确手机号！"
      });
    } else {
      this.setState({
        hasError2: false,
        error2: "",
        contactPhone2: value
      });
      this.decide();
    }
  }

  dataOnChange1 = value => {      //常营联系人关系1
    this.setState({
      contactRelation1: value
    })
    this.decide()
  }

  dataOnChange2 = value => {        //常营联系人关系2
    this.setState({
      contactRelation2: value
    })
    this.decide()
  }

  contactNameChange1 = value => {   //常营联系人姓名 1
    this.setState({
      contactName1: value
    })
    this.decide()
  }
  contactNameChange2 = value => {     //常营联系人姓名 2
    this.setState({
      contactName2: value
    })
    this.decide()
  }

  goBack = () => {
    window.api.closeFrame({ name: "contactsAdds" });
  }


  render() {
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
            color: "#444D54",
            background: "#fff",
            borderBottom: "1px solid #EFEFEF"
          }}
        >
          联系人
        </NavBar>
        <div style={{ height: "45px" }} />
        <List renderHeader={() => '常用联系人1'} style={{ backgroundColor: "white" }} className="picker-list">
          <Picker
            data={this.relation}
            cols={1}
            extra='请选择 至少1人为亲属关系'
            className="forss"
            value={this.state.contactRelation1}
            onOk={this.dataOnChange1}
          >
            <List.Item arrow="horizontal">关系</List.Item>
          </Picker>
          <InputItem
            clear
            name="contactName1"
            placeholder="请输入姓名"
            value={this.state.contactName1}
            onChange={this.contactNameChange1}
          >
            姓名
          </InputItem>
          <InputItem
            clear
            type="number"
            maxLength={11}
            name="contactPhone1"
            value={this.state.contactPhone1}
            onChange={this.contactPhone1}
            placeholder="请输入手机号"
          >
            手机号
          </InputItem>
        </List>
        {this.state.error === "" ? null : (
          <p className="error">{this.state.error}</p>
        )}
        <List renderHeader={() => '常用联系人2'} style={{ backgroundColor: "white" }} className="picker-list">
          <Picker
            data={this.relation}
            cols={1}
            extra='请选择 至少1人为亲属关系'
            className="forss"
            value={this.state.contactRelation2}
            onOk={this.dataOnChange2}
          >
            <List.Item arrow="horizontal">关系</List.Item>
          </Picker>
          <InputItem
            clear
            name="contactName2"
            placeholder="请输入姓名"
            value={this.state.contactName2}
            onChange={this.contactNameChange2}
          >
            姓名
          </InputItem>
          <InputItem
            clear
            type="number"
            maxLength={11}
            name="contactPhone2"
            value={this.state.contactPhone2}
            onChange={this.contactPhone2}
            placeholder="请输入手机号"
          >
            手机号
          </InputItem>
        </List>
        {this.state.error2 === "" ? null : (
          <p className="error">{this.state.error2}</p>
          )}
          <div className='hint'>*请如实填写联系人信息，至少填写2个联系人，其中一人需为直系亲属，否则会导致授信审核失败。</div>
        <Button className="next" disabled={this.state.disabled} onClick={this.getAdd}>
          下一步
        </Button>
      </div>
    );
  }
}

ReactDOM.render(<ContactsAdds />, document.getElementById("contactsAdds"));
