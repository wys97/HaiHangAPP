import React from "react";
import ReactDOM from "react-dom";
import "./creditFailure.scss";
import "./assets/reset.scss";
import * as _ from "lodash";
import contactsApi from "./api/contacts/contacts";
import {
  List,
  NavBar,
  Icon,
  Toast,
  Button,
  Modal,
  Picker,
  InputItem
} from "antd-mobile";

export default class CreditFailure extends React.Component {
  static displayName = "CreditFailure";
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      bankCode: {},
      ajax: null
    };
  }

  componentWillMount() {}

  goBack = () => {
    if (window.api) {
      window.api.closeFrame();
    }
  };

  render() {
    return (
      <div
        className="creditFailure"
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
          海航白条
        </NavBar>
        <div style={{ height: "45px" }} />
        <div className="succeed">
          <img src={require("./assets/image/creditFailure.png")} alt="" />
          <h2>授信审核未通过</h2>
          <p>很遗憾，您未通过海航白条授信审核</p>
          <span>请保持良好的信用，30天之后重试</span>
        </div>
        <div className="buttom">
          <p className="title">
            保持海南航空良好乘机记录，将有助于提升额度及获得授信
          </p>
          <Button className="next" onClick={this.goBack}>
            完成
          </Button>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<CreditFailure />, document.getElementById("creditFailure"));
