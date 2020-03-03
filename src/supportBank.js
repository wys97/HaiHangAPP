import React from "react";
import ReactDOM from "react-dom";
import "./supportBank.scss";
import "./assets/reset.scss";
import * as _ from "lodash";
import supportBank from "./api/supportBank/supportBank";
import { List, NavBar, Icon, Toast } from "antd-mobile";
import { getLink, getApi } from "./linkConfig";

const Item = List.Item;
const Brief = Item.Brief;

export default class SupportBank extends React.Component {
  static displayName = "SupportBank";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      bankCode: {},
      ajax: null,
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {
      that.setState({
        ajax: window.api.ajax
      });
      that.getDate();
    };
    supportBank.supportBank(this.state.bankCode).then(res => {
      if (res.data.code === "200") {
        this.setState({
          data: res.data.data
        });
      } else {
        res.data.message && Toast.fail(res.data.message, 1);
      }
    });
  }

  componentDidMount() {}


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
            body:{
              "bankCode":""
            }
          }
        },
        function(ret, err) {
          if (ret) {
            that.setState({
              data: ret.data
            });
          } else {
            Toast.info(ret.message,3)
          }
          if(err){
            Toast.info(err.body.message,3)
          }
        }
      );
    }
  };

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="supportBank"
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
            color: "#333333"
          }}
        >
          支持银行
        </NavBar>
        <div style={{ height: "45px" }} />
        <List>
          {this.state.data.map(item => {
            return (<Item
              key={item.bankCode}
              thumb={item.bankLogo}
              multipleLine
              onClick={() => {}}
            >
              {item.bankName}
              <Brief>
                单笔限额：{item.singleLimit};  单日限额：{item.singleDayLimit}
              </Brief>
            </Item>)
          })}
        </List>
      </div>
    );
  }
}

ReactDOM.render(<SupportBank />, document.getElementById("supportBank"));
