import React from "react";
import ReactDOM from "react-dom";
import { getShowTitle } from "./loginToken";
import { NavBar, Icon } from "antd-mobile";
import * as _ from "lodash";
import "./amountDetail.scss";
import amountDetailApi from "./api/home/home";
import "./assets/reset.scss";
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import { getLink, getApi, getMenu } from "./linkConfig";

export default class AmountDetail extends React.Component {
  static displayName = "AmountDetail";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      data: {},
      eCahrtData: [0, 1]
    };
  }

  componentWillMount() {
    const that = this;
    window.apiready = function () {
      that.getDate()
    };
  }
  componentDidMount() {
    this.initBarEcharts()
  }

  componentDidUpdate() {
    this.initBarEcharts();
  }

  initBarEcharts() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    myChart.setOption({
      series: [
        {
          name:"额度详情",
          type: 'pie',
          radius: ['94%', '100%'],
          avoidLabelOverlap: false,
          legendHoverLink: false,
          hoverAnimation: false,
          startAngle: 90,
          color: ['#ffe8e8', '#E1514C'],
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.state.eCahrtData
        }
      ]
    })
  }



  getDate = () => {
    const that = this;
    if (window.api) {
      window.api.ajax(
        {
          url: getLink() + getApi("limitDetail"),
          method: "post",
          dataType: "json",
          headers: {
            "Content-Type": "application/json",
            "Apptoken": window.localStorage.Apptoken
          }
        },
        function (ret, err) {
          if (ret) {    
            console.log(JSON.stringify(ret.data)) 
            let data2 = (ret.data.availableCashLimitNumber / ret.data.availableLimitNumber)*100
            let data1 = 0;
            if(data2 === 100) {
              data1 = 0
            } else if(data2 = null) {
              data2 = 0;
              data1 = 1;
            } else {
              data1 = 100-data2
            }
            let eCahrtData1 = { value: data1 };
            let eCahrtData2 = { value: data2 };
            let eCahrtData = [eCahrtData1, eCahrtData2];
            console.log(JSON.stringify(eCahrtData))
            that.setState({
              data: ret.data,
              eCahrtData
            });
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
        className="amountDetail"
        style={{ minHeight: "100%", backgroundColor: "#FFF" }}
      >
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
          授信额度
        </NavBar>
        <div className="creditPercent">
          <div id="main" style={{ width: 200, height: 200 }}></div>
          <div className="character">
            <p>可用额度(元)</p>
            <span className="limit">{this.state.data.availableLimit}</span>
            {/* <span >5,000.00</span> */}
            <b>可提现{this.state.data.availableCashLimit}元</b>
            {/* <b>可提现<span>2,000.00</span>元</b> */}
          </div>
        </div>
        <div className="blank"></div>
        <div className="detailLimit">
          <div className="detailLimit-title">
            <div className='detailLimit-name'>总额度</div>
            <div className='detailLimit-limit'>
              <p className="availableLimit">{this.state.data.totalLimit}</p>
              <p className="usedLimit">
                可提现：<span>{this.state.data.availableCashLimit}</span>
              </p>
            </div>
          </div>
          <div className="detailLimit-title">
            <div className='detailLimit-name'>已用额度</div>
            <div className='detailLimit-limit'>
              <p className="availableLimit">{this.state.data.usedLimit}</p>
              <p className="usedLimit">
                提现：<span>{this.state.data.usedCashLimit}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="goBack" onClick={() => { this.goBack() }}>
          返回
        </div>
      </div>
    );
  }
}
ReactDOM.render(<AmountDetail />, document.getElementById("amountDetail"));
