import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon, Toast } from "antd-mobile";
import "./assets/reset.scss";
import "./helpCenter.scss";
import { getLink, getApi } from "./linkConfig";



export default class HelpCenter extends React.Component {
  static displayName = "HelpCenter";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      question: [],   //问题
      questionContent: {},   //问题内容 
      showDetails: false,   //显示详情
    };
  }

  componentWillMount() {
    let that = this;
    window.apiready = function () {
      that.getIssue();
    }
  }

  getIssue = () => {
    //请求问题列表
    window.api.ajax({
      url: getLink() + getApi("helpCenterList"),
      method: 'post',
      dataType: 'json',
      headers: {
        "Content-Type": 'application/json'
      },
      data: {
        body: {
          page: 1,
          limit: 40
        }
      }
    },
      (res, err) => {
        if (res.code == '200') {
          this.setState({
            question: res.data.list,
          })
        } else {
          Toast.info(res.message,3)
        }
      }
    )



  }



  showDetails = (id) => {
    //请求问题详情
    this.setState({
      showDetails:true
    })
    window.api.ajax({
      url: getLink() + getApi("helpCenterGet") + id,
      method: 'get',
      dataType: 'json',
    },
      (res, err) => {
        if (res.code == '200') {
          console.log(JSON.stringify(res))
          this.setState({
            questionContent:res.data,
          })
        } else {
          Toast.info(res.message,3)
         
        }
        if(err){
          Toast.info(err.body.message)
        }
      }
    )

  }



  goBack = () => {
    //返回上一页
    window.api.closeFrame();
  };




  render() {
    const { question, questionContent, showDetails } = this.state;

    let Question = <div className='modal'>
      {question.map((item, index) => {
        return <div key={index} className='modal_content' onClick={() => this.showDetails(item.id)}>
          <div className='title'>【问题】{item.questionTitle}</div>
          <div className='time'>{item.createTime}</div>
        </div>
      })
      }
    </div>


    let QuestionContent = <div className='QuestionContent'>
      <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.setState({showDetails:false})}
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1,
            fontSize: "18px",
          color: "#444D54",
    }}
  >
          {questionContent.questionTitle}
        </NavBar>
          <div className='Content'>{questionContent.questionContent}</div>
    </div>



    return (
      <div className="helpCenter">
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
            borderBottom: "1px solid #EFEFEF"
      }}
    >
      帮助中心
        </NavBar>
        {!showDetails?Question:QuestionContent}
      </div>
    );
  }
}

ReactDOM.render(<HelpCenter />, document.getElementById("helpCenter"));
