import React from "react";
import ReactDOM from "react-dom";
import { getShowTitle } from "./loginToken";
import myPoints from "./api/myPoints/myPoints"
import {
  Button,
  Flex,
  Icon,
  InputItem,
  List,
  NavBar,
  Toast,
  Modal
} from "antd-mobile";
import * as _ from "lodash";
import { getLink, getApi, getMenu } from "./linkConfig";
import "./myPoint.scss";
import "./assets/reset.scss";

const Item = List.Item;
const Brief = Item.Brief;

class MyPoint extends React.Component {
  static displayName = "MyPoint";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      deviceType: getShowTitle(),
      list: [],
      points: "",
      visible: false
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function() {
      that.getDate();
    };
  }

  componentDidMount() {
    this.getDate()
  }

  getDate = () => {
    const that = this;
    window.api.ajax(
      {
        url: getLink() + getApi("pointsLog"),
        method: "post",
        dataType: "json",
        headers: {
          "Content-Type": "application/json",
          Apptoken: window.localStorage.Apptoken
        }
      },
      function(ret, err) {
        if (ret.code === "200") {
          that.setState({
            list: ret.data.list,
            points: ret.data.points
          });
        }
      }
    );
  };

  goMyPointsList = () => {
    window.api.openFrame({
      url: "./myPointList.html",
      name: "myPointList",
      rect: {
        w: "auto",
        marginTop: window.api.safeArea.top,
        marginBottom: window.api.safeArea.bottom
      },
      useWKWebView: true,
      historyGestureEnabled: true
    });
  };

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="myPoint"
        style={{ minHeight: "100%", backgroundColor: "#fff" }}
      >
        <NavBar
          mode="light"
          icon={<Icon type="left" color="#333333" />}
          onLeftClick={() => this.goBack()}
          rightContent={
            <p
              key="0"
              onClick={() => {
                this.setState({ visible: true });
              }}
              style={{color:'#585858', fontSize:'14px'}}
            >
              积分规则
            </p>
          }
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1,
            fontSize: "17px",
            color: "#444D54",
            borderBottom: "1px solid #EFEFEF"
      }}
    >
      积分信息
        </NavBar>
        <div style={{ height: "45px" }} />
        <div className="point">
          <p>您拥有积分</p>
          <h3>{this.state.points}</h3>
        </div>
        <div className="welfare">
          <h3>福利专区</h3>
          <ul>
            <li>
              <div onClick={() => {}}>
                <img src={require("./assets/image/increaseRoll.png")} alt="" />
                <p>提额券</p>
              </div>
            </li>
            <li>
              <div onClick={() => {}}>
                <img src={require("./assets/image/coupon.png")} alt="" />
                <p>利息折扣券</p>
              </div>
            </li>
            <li>
              <div onClick={() => {}}>
                <img src={require("./assets/image/refundPacket.png")} alt="" />
                <p>还款红包</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="integralWater">
          <div className="integralWater-header">
            <h3>积分流水</h3>
            <p onClick={this.goMyPointsList}>
              更多流水
              <img src={require("./assets/image/go.png")} alt="" />
            </p>
          </div>
          <List>
            {this.state.list.map((item, index) => {
              return (
                <Item
                  extra={"+" + item.varyPoints}
                  key={index}
                  thumb={item.bankLogo}
                  multipleLine
                  onClick={() => {}}
                >
                  {item.typeText}
                  <Brief>{item.varyDate}</Brief>
                </Item>
              );
            })}
          </List>
          <Modal
            popup
            title="积分规则"
            visible={this.state.visible}
            closable
            maskClosable
            animationType="slide-up"
            onClose={() => {
              this.setState({ visible: false });
            }}
          >
            <h3>积分</h3>
            <p>
              是公司根据用户在业务中的日常操作获取的，积分可用作衡量用户等级和兑换权益所用。
            </p>
            <div style={{ height: "17px" }}></div>
            <h3>等级积分</h3>
            <p>
              为用户在等级有效期内获取的积分总计，包含日常操作获取的积分全部计入等级积分中（包含签到、抽奖、完成任务、奖励积分等）。如果用户升级或者达到有效期，等级积分自动清零，用户正常获取积分和逾期扣分会影响等级积分，使用积分兑换权益、兑换失败或者积分过期清理都不影响等级积分。
            </p>
            <div style={{ height: "17px" }}></div>
            <h3>可用积分</h3>
            <p>
              此部分积分为展示在用户信息和积分页的可用于使用和兑换权益的积分，有效期与积分获取时间相关。
            </p>
            <div style={{ height: "17px" }}></div>
            <h3>过期积分</h3>
            <p>
              每年/每月固定时间逐步清理1年前获取但未被使用的积分。时间暂定为每年年底12月31日，举例如下：“2019年12月31日开始清理2018年1月1日-2018年12月31日获取的积分”。
            </p>
            <div style={{ height: "17px" }}></div>
            <span>兑换权益功能正在规划中，逐步与您见面。</span>
          </Modal>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MyPoint />, document.getElementById("myPoint"));
