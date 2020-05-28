import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon, Toast } from "antd-mobile";
import "./assets/reset.scss";
import "./aboutUs.scss";
import protocol from './common/protocol/protocol'



export default class AboutUs extends React.Component {
  static displayName = "AboutUs";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      showModule: 0,
    };
  }

  goBack = () => {
    //返回上一页
    window.api.closeFrame();
  };



  showModule = (value) => {
    this.setState({
      showModule: value
    })
  }

  //打开浏览器
  openApp = () => {
    window.api.openApp({
      androidPkg: 'android.intent.action.VIEW',
      mimeType: 'text/html',
      uri: 'https://www.jbhloan.com',
      iosUrl: "https://www.jbhloan.com"
    }, function (ret, err) {

      if (ret.msg === '未找到可执行的应用') {

      }
      if (err) {
        //有报错
        window.api.openWin({
          name: '航旅分期',
          url: 'https://www.jbhloan.com',
          rect: {
            x: 0,
            y: 0,
          }
        })
      }
    })
  }


  copyUrl2 = (value) => {
    if (value === 1) {
      var Url2 = document.getElementsByClassName('copy')[0].innerText;
      var oInput = document.createElement('input');
      oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display = 'none';
      Toast.info('复制成功')
    } else if (value === 2) {
      var Url2 = document.getElementsByClassName("copy")[1].innerText;
      var oInput = document.createElement("input");
      oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = "oInput";
      oInput.style.display = "none";
      Toast.info("复制成功");
    }else {
      var Url2 = document.getElementsByClassName('copy')[2].innerText;
      var oInput = document.createElement('input');
      oInput.value = Url2;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象
      document.execCommand("Copy"); // 执行浏览器复制命令
      oInput.className = 'oInput';
      oInput.style.display = 'none';
      Toast.info('复制成功')
    }
  }

  call = () => {
    window.api.call({
      type: 'tel_prompt',
      number: '950718'
    });
  }


  render() {

    //服务协议
    let serviceModule = <div className='serviceModule'>
      <NavBar
        mode="light"
        icon={<Icon type="left" color="#333333" />}
        onLeftClick={() => this.showModule(0)}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1,
          fontSize: "18px",
          color: "#444D54"
        }}
      >
        航旅分期服务协议
        </NavBar>
      <div className='serviceModule_content' >
        {protocol.serviceProtocol}
      </div>
    </div>
    //隐私协议
    let privacyAgreement = <div className='serviceModule'>

      <NavBar
        mode="light"
        icon={<Icon type="left" color="#333333" />}
        onLeftClick={() => this.showModule(0)}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1,
          fontSize: "18px",
          color: "#444D54"
        }}
      >
        航旅分期隐私协议
        </NavBar>
      <div className='serviceModule_content' >
        {protocol.privacyProtocol}
      </div>
    </div>

    //联系我们
    let relationModule = <div className='relationModule'>
      <NavBar
        mode="light"
        icon={<Icon type="left" color="#333333" />}
        onLeftClick={() => this.showModule(0)}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 1,
          fontSize: "18px",
          color: "#444D54",
            borderBottom: "1px solid #EFEFEF"
        }}
      >
        联系我们
        </NavBar>
      <div className='relationModule_content'>
        <div className='relationModule_title'>
          <p>联系电话：<i onClick={() => this.call()}>950718</i></p>
          <p>网站地址：<i onClick={() => { this.openApp() }} className="url" >https://www.jbhloan.com</i></p>
        </div>
        <div className='message'>
          <h4>线下还款指引</h4>
          <div className="title">
            <p className="header"><span>1</span><i>将还款金额汇款至如下账号</i></p>
            <div className="introducer ">
              <p><span>户<span style={{display:"inline-block", width:"14px"}}/>名：</span><i className='copy'>北京聚宝小额贷款有限公司</i><button  onClick={() => this.copyUrl2(1)}>复制</button></p>
              <p><span>开户行：</span><i>光大银行北京东城支行</i></p>
              <p><span>账<span style={{display:"inline-block", width:"14px"}}/>户：</span><i className='copy'>7509&nbsp;0188&nbsp;0001&nbsp;04349</i><button  onClick={() => this.copyUrl2(2)}>复制</button></p>
              <div><p>* 汇款时备注填写信息“姓名+海航白条”，</p><p>&nbsp;如“张三海航白条”</p></div>
            </div>
          </div>
          <div className="title">
            <p className="header"><span>2</span><i>将本人姓名及汇款凭证截图发送至如下邮箱</i></p>
            <div className="introducer ">
              <p className="email">邮<span style={{display:"inline-block", width:"14px"}}/>箱：<i className='copy'>bjjbxd@hnair.com</i><button onClick={() => this.copyUrl2(3)}>复制</button></p>
            </div>
          </div>
          <div className="title">
            <p className="header3">3</p>
            <i className="header3_title">我们将在一个工作日内进行确认，您将收到确认<b>短信</b></i>
          </div>     
        </div>
      </div>



    </div>


    return (
      <div className="aboutUs">
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
            borderBottom: "1px solid #EFEFEF"
          }}
        >
          关于我们
        </NavBar>
        <div style={{ height: "45px" }} />
        <div className='content'>
          <div className='item' onClick={() => { this.showModule(1) }}>
            <div className='title'>航旅分期服务协议</div>
            <img src={require("./assets/image/go.png")} />
          </div>
          <div className='item' onClick={() => { this.showModule(3) }}>
            <div className='title'>航旅分期隐私协议</div>
            <img src={require("./assets/image/go.png")} />
          </div>
          <div className='item' onClick={() => { this.showModule(2) }}>
            <div className='title'>联系我们</div>
            <img src={require("./assets/image/go.png")} />
          </div>
        </div>
        {this.state.showModule == 1 && serviceModule}
        {this.state.showModule == 2 && relationModule}
        {this.state.showModule == 3 && privacyAgreement}
      </div>
    );
  }
}

ReactDOM.render(<AboutUs />, document.getElementById("aboutUs"));
