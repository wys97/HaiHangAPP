import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon, ActivityIndicator, Toast } from "antd-mobile";
import { getLink, getApi, getMenu } from "./linkConfig";
import "./assets/reset.scss";
import "./assessment.scss";



export default class Assessment extends React.Component {
  static displayName = "Assessment";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      displayModule: 0,    //显示的模块    1 一个合同时   2  两个合同或以上  3 没有合同      
      data: [],  //请求的数据
      details: false,    //是否显示详情
      item: {}, //详情数据
      animating: false,
      pdfReader: null,
      closePDF: false,
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      const pdfReader = window.api.require("pdfReader");
      that.setState({
        animating: true,
        pdfReader
      })
      that.ajaxApi();
      
    };

  }
 
  ajaxApi = () => {
    let that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("creditAssessment"),
          method: 'post',
          dataType: 'json',
          headers: {
            'Content-Type': 'application/json',
            'appToken': window.localStorage.Apptoken,
          },

        },
        (res, err) => {
          if (res.code === '200') {
            if (res.data.length == 0) {
              this.setState({
                displayModule: 3,
                animating: false
              });

            } else if (res.data.length >= 1) {

              this.setState({
                displayModule: 2,
                data: res.data,
                animating: false
              })

              // } else {
              //   this.setState({
              //     displayModule: 2,
              //     data: res.data,
              //     animating: false
              //   })

            }
          } else {
            Toast.info(err.body.message, 3)

            this.setState({
              animating: false
            })
          }

        }
      )
    }
  }
  goBack = () => {
    //关闭pdf
    if (this.state.closePDF) {
      var pdfReader = window.api.require('pdfReader');
      pdfReader.closePdfView();
      this.setState({
        closePDF: false
      })
    } else {
      //返回上一页
      window.api.openFrame({
        url: './userInfo.html',
        name: 'userInfo',
        rect: {
          w: "auto",
          marginTop: window.api.safeArea.top,
          marginBottom: window.api.safeArea.bottom + 50
        },
        reload: true,
        pageParam: {
          from: 'securitySet',
        },

        useWKWebView: true,
        historyGestureEnabled: true
      })
      window.api.closeFrame();

    }

  };


  showModalDetails = (item) => {
    let systemType = window.api.systemType;
    this.setState({
      animating: true,
      closePDF: true,
    })
    if(systemType == 'ios'){
      let titleTop = document.getElementsByClassName('assessment_title')[0].scrollTop;
      let offsetHeight = document.getElementsByClassName('assessment_title')[0].offsetHeight;
      let h = document.getElementsByClassName('assessment')[0];
      let top = document.body.clientHeight>667? titleTop + offsetHeight+44:titleTop + offsetHeight+20;
      this.state.pdfReader.openPdfView({
        rect:{
          x:0,
          y:Number(top),
          w:'auto',
          h:'auto'
        },
        path:getLink() + item.url,
        fixed:true
      });
    }else{
      this.state.pdfReader.open({
        hidden:{
          print: true,           
          export: true,          
          bookmark: true,         
          email: true           
        },
        path: getLink() + item.url,
          showLoading: true
      });
    }
    setTimeout(() => {
      this.setState({
        animating: false
      })
    }, 1500)
  };

  render() {

    const { displayModule, data, details } = this.state;

    let Modal1 = <div className='modal1'>

      {data.map((item, index) => {
        return <iframe key={index} src={item.url} className='item'
          style={{
            width: window.screen.width,
            height: window.screen.height,
            padding: '30px 0 0'
          }}></iframe>
      })}

    </div>

    let Modal2 = <div className='Modal2'>

      {!details && data.map((item, index) => {
        return <div key={index} onClick={() => this.showModalDetails(item)}>

          <div className='Modal2_item'>
            <div className='item_title'>{item.contract}</div>
            <div className='time'>
              <span>
              {item.contractSignDate}
              </span>
            <Icon type="right" color="#D2D2D2" />

            </div>
          </div>
        </div>
      })
      }

    </div>


    let m = <div className='Modal2_details'>
      <NavBar
        mode="light"
        icon={<Icon type="left" color="#333333" />}
        onLeftClick={() => { this.setState({ details: false }) }}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          fontSize: "18px",
          color: "#333333",
        }}
      >
        {this.state.item.contract}
      </NavBar>
      {this.state.item.url && this.state.item.url != null ? <iframe src={this.state.item.url}
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 90,
          width: window.screen.width,
          height: window.screen.height,
          padding: '50px 0 0'
        }}
      ></iframe> : <div className='occupied'>
          <img src={require('../src/assets/image/contract.png')} />
          <div>合同正在努力迁移中，请您稍后再试......</div>
        </div>}
    </div>


    let Modal3 = <div className='Modal3'>
      <div>合同签署中，请稍后查看！</div>
    </div>


    return (
      <div className="assessment">
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
          className='assessment_title'
        >
          我的合同
        </NavBar>
        {displayModule == 1 && Modal1}
        {displayModule == 2 && Modal2}
        {displayModule == 3 && Modal3}
        {details && m}
        <ActivityIndicator toast animating={this.state.animating} />
        {this.state.animating && <div className='loader_wrap'>
          <div className='loader_img'></div>
          <div className='loader_text'>加载中...</div>
        </div>}
      </div>
    );
  }
}

ReactDOM.render(<Assessment />, document.getElementById("assessment"));
