import React from "react";
import ReactDOM from "react-dom";
import "./myPointList.scss";
import "./assets/reset.scss";
import * as _ from "lodash";
import { getLink, getApi, getMenu } from "./linkConfig";
import { List, NavBar, Icon, Modal,Toast } from "antd-mobile";


const Item = List.Item;
const Brief = Item.Brief;

export default class MyPointList extends React.Component {
  static displayName = "MyPointList";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.getDate();
    };
  }

  componentDidMount() {
  }


  getDate = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("pointsLogWeek"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            Apptoken: window.localStorage.Apptoken
          },
        },
        function (ret, err) {
          if (ret) {
            that.setState({
              data: ret.data.list
            });
          } else {
            Toast.info(ret.message,3)
           
          }
          if(err){
            Toast.info(err.body.message,3)
          }
        }
      );
    }
  };

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="myPointList"
        style={{ minHeight: "100%", backgroundColor: "#F9FAF9" }}
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
            >
              积分规则
            </p>
          }
          style={{
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 1,
            fontSize: "18px",
            color: "#333333"
          }}
        >
          积分流水
        </NavBar>
        <div style={{ height: "46px", borderBottom: "1px solid #EFEFEF" }} />
        <List>
          {this.state.data.map((item, index) => {
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
    );
  }
}

ReactDOM.render(<MyPointList />, document.getElementById("myPointList"));
