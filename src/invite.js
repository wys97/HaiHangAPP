import React from "react";
import ReactDOM from "react-dom";
import { Button, List, NavBar, Modal, Icon } from "antd-mobile";
import "./assets/reset.scss";
import "./invite.scss";



export default class Invite extends React.Component {
  static displayName = "Invite";
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
      <div className="invite">
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
          邀请好友
        </NavBar>
        <div className='content'>
          <div>
            <img src={require('./assets/image/construction.png')} alt='' />
            <div className='hint'>此功能正在建设中<p>敬请期待！</p></div>
          </div>
          <div className='placeholder'></div>
          <div className='feature'>
            <p className='title'>功能介绍</p>
            <p>1.邀请好友注册或借钱，好友及本人均可获得现金红包，累计邀请好友达到一定数量，可获得额外现金大礼包；</p>
            <p className='content2'>2.每日分享可获得随机红包，还可获得抽奖机会，随机抽取iPhone，888元现金大礼包等。</p>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Invite />, document.getElementById("invite"));
