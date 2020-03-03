import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon, InputItem, Toast } from "antd-mobile";
import { setH5Token, clearToken, clearH5Token, getH5Token } from "./loginToken";
import "./assets/reset.scss";
import "./changePassword.scss";
import md5 from "js-md5";
import { getLink, getApi, getMenu } from "./linkConfig";

export default class ChangePassword extends React.Component {
  static displayName = "ChangePassword";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      inputType: "password",
      passsword: '',  //原密码
      setPasssword: '',    //新密码
      confirmPassword: '',   //   确定的新密码
      repeat: false,   // 防重复点击
    };
  }

  goBack = () => {
    //返回上一页
    window.api.closeFrame();
    // window.api.closeFrame({name:'securitySet'});
  };


  //输入原密码
  getPassword = (value) => {
    this.setState({
      passsword: value
    })
  }

  //输入新密码
  setPasssword = (value) => {

    this.setState({
      setPasssword: value
    })

  }
  //确定的新密码
  confirmPassword = (value) => {
    this.setState({
      confirmPassword: value
    })
  }


  //提交设置
  submit =()=>{

    let { passsword, setPasssword, confirmPassword, repeat } = this.state;
    //防重点击
    if(repeat)
    return
 
    this.setState({
      repeat:true
    })
   
    setTimeout(()=>{
      this.setState({
        repeat:false
      })
    },2000)
    if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/.test(setPasssword)){
      Toast.info('新密码必须8~18位（不能全是数字或字母）',3);
      return 
    }else if(confirmPassword !== setPasssword ){
      Toast.info('新密码不一致',3);
      return 
    }else{
      window.api.ajax({
        url: getLink() + getApi("passwordModify"),
        method:'post',
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
          'appToken': window.localStorage.Apptoken
        },
        data:{
          body:{
            oldPassword: md5(passsword).toUpperCase(),
            newPassword: md5(setPasssword).toUpperCase(),
          }
        }
      },
      (res, err)=>{
       
        if(res.code=='200'){
          clearToken();
          clearH5Token();
          window.api.openFrame({
            name: 'login',
            url: "./login.html",
            rect: {
              w: "auto",
              marginTop: window.api.safeArea.top,
            },
            pageParam: {
              from: 'userInfo',
            },
            useWKWebView: true,
            historyGestureEnabled: true
          });
          window.api.closeFrame({ name: "securitySet" });
          window.api.closeFrame({ name: "changePassword" });
        }else{
          Toast.info(res.message,3)
       
        }
        if(err){
          Toast.info(err.body.message,3)
        }
      
      })
    }

  }



  render() {
    // const { data } = this.state.data;
    return (
      <div className="changePassword">
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
            borderBottom: '1px solid #EEEEEE'
          }}
        >
          修改登录密码
        </NavBar>
        <div className="content">
          <div className='item'>
            <span className='title'>原密码</span>
            <InputItem
              name="passsword"
              type={this.state.inputType}
              onChange={this.getPassword}
              value={this.state.passsword}
              minLength="8"
              maxLength='18'
              clear
              extra="   "
              placeholder="请输入原密码"
              className='input'
            />
          </div>
          <div className='item'>
            <span className='title'>新密码</span>
            <InputItem
              name="passsword"
              type={this.state.inputType}
              onChange={this.setPasssword}
              value={this.state.setPasssword}
              minLength="8"
              maxLength='18'
              clear
              extra="   "
              placeholder="请输入新密码"
              className='input'
            />
          </div>
          <div className='item'>
            <span className='title'>确定新密码</span>
            <InputItem
              name="passsword"
              type={this.state.inputType}
              onChange={this.confirmPassword}
              value={this.state.confirmPassword}
              minLength="8"
              maxLength='18'
              clear
              extra="   "
              placeholder="再次输入新密码"
              className='input'
            />
          </div>
          <div className='hint'>*密码规则： 8~18位（不能全是数字或字母）</div>
          <div className='btn_wrap'>
            {this.state.passsword !== '' && this.state.setPasssword !== '' && this.state.confirmPassword !== '' ?
              <button className='button' onClick={this.submit}>提交设置</button> :
              <button className='button2'>提交设置</button>
            }
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ChangePassword />, document.getElementById("changePassword"));
