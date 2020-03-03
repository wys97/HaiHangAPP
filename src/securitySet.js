import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon } from "antd-mobile";
import { getLink, getApi } from "./linkConfig";
import "./assets/reset.scss";
import "./securitySet.scss";



export default class SecuritySet extends React.Component {
  static displayName = "SecuritySet";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: {
        cardNumber: '',
        loginMobile: '',
        isSetPassword: '',
      }
    };
  }

  goBack = () => {
 
      window.api.closeFrame();

  };


  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.getDate();
    };
  }


  getDate = () => {
    const that = this;
      window.api.ajax(
        {
          url: getLink() + getApi("checkStatus"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          }
        },
        function (ret, err) {
          // console.log(JSON.stringify(ret));
          if (ret.code === "200") {
            console.log(JSON.stringify(ret))
            that.setState({
              data: ret.data
            });
          }
        }
      
    );
  }

  goSetPassword = () => {
    //去设置密码
    window.api.openFrame({
      url: './setPassword.html',
      name: 'setPassword',
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },

      pageParam: {
        from: 'userInfo',
        backtrack: 'securitySet',
        setId:true
      },
      useWKWebView: true,
      historyGestureEnabled: true
    })
  }

  //修改密码
  changePassword = () => {
    window.api.openFrame({
      url: './changePassword.html',
      name: 'changePassword',
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    })
  

  }



  render() {

    let phone = this.state.data.loginMobile !== '' && this.state.data.loginMobile.substring(0, 3) + '****' + this.state.data.loginMobile.substring(7, 11);

    return (
      <div className="securitySet">
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
            color: "#444D54",
            borderBottom: '1px solid #EEEEEE'
          }}
        >
          安全设置
        </NavBar>
        {<div className='content'>
          <div className='wrap'>
            <div className='title'>用户ID</div>
            <div className='id'>{this.state.data.cardNumber}</div>
          </div>
          <div className='wrap'>
            <div className='title'>登录手机号</div>
            <div className='id'>{phone}</div>
          </div>
          <div className='wrap'>
            <div className='title'>密码登录</div>
            <div className='set'>
              {
                this.state.data.isSetPassword ?
                  <div className='set_di' onClick={this.changePassword}>
                    已设置
                  <img src={require('./assets/image/go.png')} />
                  </div>
                  :
                  <div className='set_ti' onClick={this.goSetPassword} >
                    未设置
                    <img src={require('./assets/image/go.png')} />
                  </div>
              }
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}

ReactDOM.render(<SecuritySet />, document.getElementById("securitySet"));
