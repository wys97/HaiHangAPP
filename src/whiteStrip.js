import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon  } from "antd-mobile";
import "./assets/reset.scss";
import "./whiteStrip.scss";



export default class WhiteStrip extends React.Component {
  static displayName = "WhiteStrip";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  goBack = () => {
    //返回上一页
    window.api.closeFrame();
  };


  render() {
    // const { data } = this.state.data;
    return (
      <div className="whiteStrip">
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
          白条介绍
        </NavBar>
        <div className="content">
          <div className='title'>什么是海航白条？</div>
          <p >航旅分期是一款基于个人虚拟支付账户，集实名、充值、转账、支付、提现、授信、放款、白条支付以及其他增值服务为一体的多功能账户。</p>
          <p>【借款额度灵活】最低1000元，最高300万</p>
          <p>【流程简洁放款快】评估流程精简，下款速度快</p>
          <p>【智能安全】支持活体人脸识别，认证流程更便捷</p>
          <p>【随心分期】支持最短1个月，最长12个月随心分期</p>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<WhiteStrip />, document.getElementById("whiteStrip"));
