import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon } from "antd-mobile";
import "./assets/reset.scss";
import "./updata.scss";
import { getLink, getApi } from "./linkConfig";



export default class Updata extends React.Component {
  static displayName = "Updata";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: {
        versionNo: '',
        createTime: '',
        content: '',
        url: '',

      },
      appVersion: '',
      show: false
    };
  }


  componentWillMount() {
    let that = this;
    window.apiready = function () {
      that.getData();
    }
  }

  getData = () => {
    let appVersion = window.api.appVersion;  //获取版本
    let systemType = window.api.systemType == 'android' ? 'Android' : 'iOS';   //获取系统  ios/android
    this.setState({
      appVersion: appVersion
    })
    window.api.ajax(
      {
        url: getLink() + getApi("versionCheck"),
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        dataType: "json",
        data: {
          body: {
            versionNo: appVersion,
            platform: systemType
          }
        },
      },
      (res, err) => {
        console.log(JSON.stringify(res.data.url))
        this.setState({
          data: res.data
        })

      }
    )

  }


  goBack = () => {
    //返回上一页
    window.api.closeFrame();
  };

  download = () => {
    this.setState({
      show: true
    })
  }




  render() {
    let that = this;

    let content = that.state.data.content.split('；');


    let modal = <div className='modal'>
      <NavBar
        mode="light"
        icon={<Icon type="left" color="#333333" />}
        onLeftClick={() => that.setState({ show: false })}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 100,
          fontSize: "18px",
          color: "#333333",
          borderBottom: '1px solid #EEEEEE'
        }}
      >
        版本更新
        </NavBar>
      <iframe src={that.state.data.url}
        style={{
          width: window.screen.width,
          height: window.screen.height,
          padding: '30px 0 0'
        }}
      ></iframe>
    </div>





    return (
      <div className="updata">
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
          版本更新
        </NavBar>
        {!that.state.show && <div className='content'>
          <div className='head'>
            <img src={require('./assets/image/login-logo.png')} className='img' />
            <div className='head_right'>
              <p>海航钱包</p>
              <p>当前版本: {that.state.appVersion}</p>
              <p>最新版本: {that.state.data.versionNo}</p>
            </div>

          </div>
          <div className='body'>
            <div className='updata_content'>{
              content.map((item, index) => {
                return <div key={index}>{item}</div>
              })
            }</div>
            <p className='time'>发布时间：{that.state.data.createTime}</p>
          </div>
          <div className='bottom'>
   
            {JSON.stringify(this.state.appVersion) === JSON.stringify(this.state.data.versionNo) || 
            JSON.stringify(this.state.data.versionNo) <= JSON.stringify(this.state.appVersion)?
              <div>当前已是最新版本~</div>
              : // <button><a download href={data.url}>立即更新</a></button>
              <button onClick={that.download}>立即更新</button>
            }
          </div>
        </div>}

        {that.state.show && modal}

      </div>
    );
  }
}

ReactDOM.render(<Updata />, document.getElementById("updata"));
