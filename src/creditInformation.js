import React from "react";
import ReactDOM from "react-dom";
import { NavBar, Icon, Picker, List, InputItem, Button, Toast } from "antd-mobile";
import { getShowTitle, setH5Token } from "./loginToken";
import * as _ from "lodash";
import "./assets/reset.scss";
import { getLink, getApi, getMenu } from "./linkConfig";
import "./creditInformation.scss";

export default class CreditInformation extends React.Component {
  static displayName = "CreditInformation";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      house: [],
      ajax: null,
      disabled: true,
      deviceType: getShowTitle(),
      error: "",
      email: "",
      addressError: "",
      hasErrors: false,
      income: [],
      companyName: '',
      houseAddress: "",
      hasError: false
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.setState({
        ajax: window.api.ajax
      });
      that.getDate();
    };
  }

  income = [
    {
      label: "3000元以下",
      value: "3000元以下"
    },
    {
      label: "3001~5000元",
      value: "3001~5000元"
    },
    {
      label: "5001~8000元",
      value: "5001~8000元"
    },
    {
      label: "8001~11000元",
      value: "8001~11000元"
    },
    {
      label: "11001~14000元",
      value: "11001~14000元"
    },
    {
      label: "14001~18000元",
      value: "14001~18000元"
    },
    {
      label: "18001~22000元",
      value: "18001~22000元"
    },
    {
      label: "22001~26000元",
      value: "22001~26000元"
    },
    {
      label: "26001~30000元",
      value: "26001~30000元"
    },
    {
      label: "30001~34000元",
      value: "30001~34000元"
    },
    {
      label: "34001~42000元",
      value: "34001~42000元"
    },
    {
      label: "42001~50000元",
      value: "42001~50000元"
    },
    {
      label: "50000元以上",
      value: "50000元以上"
    }
  ];

  getDate = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("areaInfo"),
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
              data: ret.data
            });
          } else {
            if (err) {
              Toast.info("请求失败", 3)

            } else {
              Toast.info(ret.message, 3)
            }
          }
          that.refresh()
        }
      );
    }
  };

  decide = () => {
    console.log(this.state.companyName.length)
    //不能为空
    if (this.state.house !== "" && this.state.email !== "" && this.state.income !== "" && this.state.houseAddress.length > 5
      && ((!/(^[\u4E00-\u9FA5]{2}$)|(^[a-zA-Z]{8,}$)/.test(this.state.companyName) && this.state.companyName.length >= 7)
        || /(^[\u4E00-\u9FA5]{2}$)|(^[a-zA-Z]{8,}$)/.test(this.state.companyName))
    ) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  };
  emailOnChange = value => {
    if (
      !/^([A-Za-z0-9_\-\.\u4e00-\u9fa5])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,8})$/.test(
        value
      )
    ) {
      this.setState({
        hasError: true,
        error: "请输入正确邮箱号！",
        email: value,
        disabled: true
      });
    } else {
      this.setState({
        hasError: false,
        error: "",
        email: value
      });
      this.decide()
    }
  };
  dataOnChange = value => {
    this.setState({
      house: value,
    })
    this.decide()
  }
  incomeOnChange = value => {
    this.setState({
      income: value,
    })
    this.decide()
  }
  companyNameOnChange = value => {
    console.log(value)
    if (value) {
      this.setState({
        companyName: value,
      })
      this.decide()
    } else {
      this.setState({
        companyName: value,
        disabled: true
      })
    }


  }
  houseAddressOnChange = value => {
    if (value.length > 5) {
      this.setState({
        houseAddress: value,
        addressError: "",
        hasErrors: false
      }, () => { this.decide() })

    } else {
      this.setState({
        houseAddress: value,
        disabled: true,
        hasErrors: true,
        addressError: "请输入最少6个字符！"
      })
    }
  }
  submit = () => {
    let data = {
      companyName: this.state.companyName,
      houseProvinceNo: this.state.house[0],
      houseCityNo: this.state.house[1],
      houseAreaNo: this.state.house[2],
      houseAddress: this.state.houseAddress,
      email: this.state.email,
      incomeMonth: this.state.income[0]
    };
    window.api.ajax(
      {
        url: getLink() + getApi("basicInfoSave"),
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
        if (ret.code === '200') {
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
              console.log("是否有联系人：" + JSON.stringify(ret))
              if (ret.data.length > 1) {
                window.api.openFrame({
                  url: "./contactsList.html",
                  name: "contactsList",
                  rect: {
                    w: "auto",
                    marginTop: window.api.safeArea.top,
                    marginBottom: window.api.safeArea.bottom
                  },
                  useWKWebView: true,
                  historyGestureEnabled: true
                });
              } else {
                window.api.openFrame({
                  url: "./contactsAdds.html",
                  name: "contactsAdds",
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
          );

        } else {
          if (err) {
            Toast.info("请求失败", 3)

          } else {
            Toast.info(ret.message, 3)

          }
        }
      }
    );
  };

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
        console.log(JSON.stringify(ret))
        if (ret.code === "200") {
          setH5Token(ret.data);
        }
      }
    )
  }

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="creditInformation"
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
            background: "#fff"
          }}
        >
          用户基本信息
        </NavBar>
        <div style={{ height: "45px" }} />
        <List style={{ backgroundColor: "white" }} className="picker-list">
          <Picker
            data={this.income}
            cols={1}
            value={this.state.income}
            onOk={this.incomeOnChange}
            className="forss"
          >
            <List.Item arrow="horizontal">月收入</List.Item>
          </Picker>
          <InputItem
            clear
            name="companyName"
            placeholder="请输入单位名称"
            onChange={this.companyNameOnChange}
            value={this.state.companyName}
          >
            单位名称
          </InputItem>
          {this.state.companyName === "" || /(?=.*[\u4e00-\u9fa5]).{7,}/.test(this.state.companyName) || /(?=(.*[\u4e00-\u9fa5]){2}).{6,}/.test(this.state.companyName) || /(?=(.*[\u4e00-\u9fa5]){3}).{5,}/.test(this.state.companyName) || /(?=(.*[\u4e00-\u9fa5]){4,}|.{8,}).*/.test(this.state.companyName) ? null : <p className="error">至少4个中文字符或8个字符！</p>
          }
          <Picker
            data={this.state.data}
            cols={3}
            className="forss"
            value={this.state.house}
            onOk={this.dataOnChange}
          >
            <List.Item arrow="horizontal">现居住地址</List.Item>
          </Picker>
          <InputItem
            clear
            name="houseAddress"
            placeholder="请输入详细地址"
            onChange={this.houseAddressOnChange}
            value={this.state.houseAddress}
            error={this.state.hasErrors}
          >
            详细地址
          </InputItem>
          {this.state.addressError === "" ? null : (
            <p className="error">{this.state.addressError}</p>
          )}
          <InputItem
            clear
            name="email"
            placeholder="请输入邮箱号"
            onChange={this.emailOnChange}
            value={this.state.email}
            error={this.state.hasError}
          >
            邮箱
          </InputItem>
        </List>
        {this.state.error === "" ? null : (
          <p className="error">{this.state.error}</p>
        )}
        <Button
          disabled={this.state.disabled}
          className="next"
          onClick={() => {
            this.submit();
          }}
        >
          下一步
        </Button>
      </div>
    );
  }
}
ReactDOM.render(
  <CreditInformation />,
  document.getElementById("creditInformation")
);
