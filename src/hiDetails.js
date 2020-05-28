import React from "react";
import ReactDOM from "react-dom";
import { getShowTitle } from "./loginToken";
import { NavBar, Icon } from "antd-mobile";
import openH5Link from "./openH5Link";
import * as _ from "lodash";
import "./hiDetails.scss";
import "./assets/reset.scss";
import echarts from 'echarts/lib/echarts';


import 'echarts/lib/chart/pie';
import { getLink, getApi, getMenu } from "./linkConfig";

export default class HiDetails extends React.Component {
  static displayName = "hiDetails";
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
          clockwise:false,
          startAngle: 90,
          color: ['#ffe8e8','#E1514C'],
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
          if (ret.code=='200') {    
            let data2 = (ret.data.hiAvailableCashLimitNumber / ret.data.hiTotalLimitNumber)*100;
            let data1 = 0;
            if(data2 === 100) {
              data1 = 0
            } else if(data2 == null) {
              data2 = 0;
              data1 = 1;
            } else {
              data1 = 100-data2
            }
            let eCahrtData1 = { value: data1 };
            let eCahrtData2 = { value: data2 };
            let eCahrtData = [eCahrtData1, eCahrtData2];
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


  goWithdraw = ()=>{
    const url = getMenu('支用');
    const link = url + "?token=" + window.localStorage.h5Token + "&channel=cashLoanApp&type=2&productNo=PD003";
    openH5Link(link);
    setTimeout(()=>{
      window.api.closeFrame({name:'hiDetails'});
    },300)
  }



  render() {
    return (
      <div
        className="hiDetails"
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
          嗨贷授信额度
        </NavBar>
        <div className="creditPercent">
          <div id="main" style={{ width: 240, height: 240 }}></div>
          <div className="character">
            <p>可用额度(元)</p>
            <span className="limit">{this.state.data.hiAvailableCashLimit}</span>
            {/* <span className="limit">5,000.00</span> */}
            <b>总额度{this.state.data.hiTotalLimit}元</b>
            {/* <b>可提现<span>2,000,000.00</span>元</b> */}
          </div>
        </div>
       
        <div className="bottom" >
          <div>授信有效期：截止到聚宝匯理财订单到期之前一个月</div>
          <div className='goBack' onClick={this.goWithdraw}>去提现</div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<HiDetails />, document.getElementById("hiDetails"));
