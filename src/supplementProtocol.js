import React from "react";
import ReactDOM from "react-dom";
import "./supplementProtocol.scss";
import { getLink, getApi, getMenu } from "./linkConfig";
import protocol from "./common/protocol/protocol.js";

import "./assets/reset.scss";
import * as _ from "lodash";
import { setH5Token, clearToken, clearH5Token, getH5Token } from "./loginToken";
import { List, NavBar, Icon, Toast, Button, Modal } from "antd-mobile";
import { stringify } from "qs";


const Item = List.Item;
const Brief = Item.Brief;
const operation = Modal.operation;
const alert = Modal.alert;

export default class SupplementProtocol extends React.Component {
    static displayName = "SupplementProtocol";
    static propTypes = {};
    static defaultProps = {};

    constructor(props) {
        super(props);
        this.state = {
            ajax: null,
            toDisabled: true,
            timeText: "(3s)",
            data: '',
            from: '',
            repeat: true,
            isNeed2SignCustomerAuth: false,
            showProtocolTitle: false,
            titleContent: '补充协议',
            supplwementData: [],
            idCardNo:'',
            customerName:'',
        };
    }

    componentWillMount() {
        const that = this;
        window.apiready = function () {
            that.setState({
                ajax: window.api.ajax,
                data: window.api.pageParam.data,
                from: window.api.pageParam.from,
                isNeed2SignCustomerAuth: window.api.pageParam.isNeed2SignCustomerAuth,
            });
            that.getSupplwementData();

        };



    }

    componentDidMount() {
        let that = this;
        let timeo = 3;
        let timeStop = setInterval(() => {
            timeo--;
            if (timeo > 0) {
                this.setState({
                    timeText: "(" + timeo + "s)",
                    toDisabled: true
                });
            } else {
                timeo = 3; //当减到0时赋值为60
                this.setState({
                    timeText: "",
                    toDisabled: false,
                });
                clearInterval(timeStop); //清除定时器
            }
        }, 1000);
        setTimeout(() => {
            let protocol = document.getElementsByClassName('protocol')[0];
            let zation = document.getElementsByClassName('userAuthorization')[0];
            protocol.addEventListener('scroll', e => {
                let offsetTop = e.target.offsetTop; //滚动条高度
                let scrollTop = e.target.scrollTop; //滚动条到顶部的距离
                let scrollHeight = e.target.scrollHeight; //元素的总高度
                let zationOffsetTop = zation ? zation.offsetTop : scrollHeight + 100;

                if (scrollTop >= offsetTop - 25 && scrollTop < zationOffsetTop - 25) {
                    this.setState({
                        titleContent: "补充协议",
                        showProtocolTitle: true
                    })
                } else if (scrollTop >= zationOffsetTop - 25 && scrollTop > offsetTop - 25) {
                    this.setState({
                        titleContent: "用户授权委托书",
                        showProtocolTitle: true
                    })
                } else {
                    this.setState({
                        titleContent: "补充协议",
                        showProtocolTitle: false
                    })
                }

            })
        }, 300)

    }

    getSupplwementData = () => {
        let that = this;
        window.api.ajax({
            url: getLink() + getApi("supplwementData"),
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                Apptoken: window.localStorage.Apptoken
            }
        },
            function (res) {
                if (res.code = '200') {
                    that.setState({
                        supplwementData: res.data.list,
                        idCardNo:res.data.idCardNo,
                        customerName:res.data.customerName
                    })
                }
            }
        )
    }

    goBack = () => {
        if (window.api) {
            window.api.closeFrame();
        }
    };


    //退出app
    exitApp = () => {
        let protocol = document.getElementsByClassName('protocol')[0];
        protocol.removeEventListener('scroll', () => { });
        window.api.ajax({
            url: getLink() + getApi("loginout"),
            method: "post",
            dataType: "json",
            headers: {
                "Content-Type": "application/json",
                Apptoken: window.localStorage.Apptoken
            }
        },
            function (res, err) {
                if (res.code == '200') {
                    clearToken(),
                        clearH5Token(),
                        window.api.closeWidget({
                            id: "A6025238071881", //这里改成自己的应用ID
                            retData: { name: "closeWidget" },
                            silent: true
                        });
                }

            }
        )

    };

    goCredits = () => {

        let that = this;
        if (!that.state.repeat)
            return;
        let protocol = document.getElementsByClassName('protocol')[0];
        protocol.removeEventListener('scroll', () => { });
        that.setState({
            repeat: false
        })
        setTimeout(() => {
            that.setState({
                repeat: true
            })
        }, 3000)

        if (window.api) {
            window.api.ajax(
                {
                    url: getLink() + getApi("supplement"),
                    method: "post",
                    returnAll: true,
                    headers: {
                        "Content-Type": "application/json",
                        Apptoken: window.localStorage.Apptoken
                    },
                    dataType: "json",
                },

                function (res, err) {
                    if (res.body.code == '200') {
                        if (window.api.pageParam.data == 'login') {
                            if (!window.api.pageParam.isNeed2CreditPage) { //true 非重叠客户 false 重叠客户
                                window.api.openFrame({
                                    url: "./index.html",
                                    name: "index",
                                    rect: {
                                        w: "auto",
                                        marginTop: window.api.safeArea.top,
                                        marginBottom: window.api.safeArea.bottom,
                                    },
                                    pageParam: {
                                        from: window.api.pageParam.from,
                                    },
                                    reload: true,
                                    useWKWebView: true,
                                    historyGestureEnabled: true,
                                });
                                window.api.closeFrame({ name: "userInfo" });
                                window.api.closeFrame({ name: "supplementProtocol" });

                            } else {
                                window.api.openFrame({
                                    name: 'hnaIous',
                                    url: "./hnaIous.html",
                                    rect: {
                                        w: "auto",
                                        marginTop: window.api.safeArea.top,
                                        marginBottom: window.api.safeArea.bottom

                                    },
                                    reload: true,
                                    useWKWebView: true,
                                    historyGestureEnabled: true
                                });
                                window.api.closeFrame({ name: "login" });
                                window.api.closeFrame({ name: "userInfo" });
                                window.api.closeFrame({ name: "supplementProtocol" });
                            }
                        } else {

                            let fromData = window.api.pageParam.from;

                            if (fromData.creditCash) {

                                alert("提示", '已将您的授信额度关联到新版系统！', [
                                    {
                                        text: "确定", onPress: () => {
                                            window.api.openFrame({
                                                name: "index",
                                                url: "./index.html",
                                                reload: true,
                                                rect: {
                                                    w: "auto",
                                                    marginTop: window.api.safeArea.top,
                                                    marginBottom: window.api.safeArea.bottom
                                                },
                                                useWKWebView: true,
                                                historyGestureEnabled: true
                                            });
                                            window.api.closeFrame();

                                        }
                                    }
                                ])
                            } else {
                                //嗨贷以授信，且第一次打开显示弹窗
                                if (fromData.creditHra && fromData.hraSync) {
                                    alert("提示", '已将您的嗨贷授信额度关联到新版系统！', [
                                        {
                                            text: "取消", onPress: () => {
                                                window.api.openFrame({
                                                    name: "index",
                                                    url: "./index.html",
                                                    rect: {
                                                        w: "auto",
                                                        marginTop: window.api.safeArea.top,
                                                        marginBottom: window.api.safeArea.bottom
                                                    },
                                                    reload: true,
                                                    useWKWebView: true,
                                                    historyGestureEnabled: true
                                                });
                                                window.api.closeFrame({ name: "supplementProtocol" });
                                            }
                                        },
                                        {
                                            text: "继续现金贷授信",
                                            onPress: () => {
                                                //现金贷授信跳转
                                                that.criteria(fromData.agreementBindCard, fromData.bindRepayBankCard, fromData.bankCardNo)
                                            }
                                        }
                                    ])
                                } else {
                                    that.criteria(fromData.agreementBindCard, fromData.bindRepayBankCard, fromData.bankCardNo)
                                }
                            }

                        }
                    }
                }
            )
        }
    }


    //现金贷授信跳转判断
    criteria = (agreementBindCard, bindRepayBankCard, bankCardNo) => {
        //没有绑定还款账号
        if (!bindRepayBankCard) {
            window.api.openFrame({
                name: "addBankCard",
                url: "./addBankCard.html",
                rect: {
                    w: "auto",
                    marginTop: window.api.safeArea.top,
                    marginBottom: window.api.safeArea.bottom
                },
                useWKWebView: true,
                historyGestureEnabled: true
            });
            //有协议绑卡 ，有还款计划  跳用户基本信息
        } else if (bindRepayBankCard && agreementBindCard) {
            window.api.openFrame({
                name: "creditInformation",
                url: "./creditInformation.html",
                rect: {
                    w: "auto",
                    marginTop: window.api.safeArea.top,
                    marginBottom: window.api.safeArea.bottom
                },
                useWKWebView: true,
                historyGestureEnabled: true
            });
            //有还款账号，没有协议绑卡跳协议绑卡
        } else {
            window.api.openFrame({
                name: "addBankPhone",
                url: "./addBankPhone.html",
                rect: {
                    w: "auto",
                    marginTop: window.api.safeArea.top,
                    marginBottom: window.api.safeArea.bottom
                },
                pageParam: {
                    cardNo: bankCardNo
                },
                useWKWebView: true,
                historyGestureEnabled: true
            });
        }
    }

    render() {

        return (
            <div
                className="supplementProtocol"
                style={{ minHeight: "100%", backgroundColor: "#F9FAF9" }}
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
                        color: "#333333"
                    }}
                >
                    额度同步
        </NavBar>
                <div className='content'>
                    <div className='title'>
                        <p>您在其它系统中 <span >授信过海航白条，</span></p>
                        <p> 点击 <span>【同意】</span>按钮后，<span>可同步额度到该系统中</span></p>
                        <p>如您不同意，将无法继续使用海航白条</p>
                    </div>
                    <div className='protocol_wrap'>
                        {this.state.showProtocolTitle && <div className='protocol_title'>{this.state.titleContent}</div>}
                        <div className='protocol'>
                            <h2>补充协议</h2>
                            <div className='weight'>客户姓名：{this.state.customerName}</div>
                            <div className='weight'>客户身份证号：{this.state.idCardNo}</div>
                            <div className='weight' style={{ margin: '10px 0' }}>平台公司名称：北京聚宝小额贷款有限公司</div>
                            <div className='weight'>特别提醒：</div>
                            <div className='weight indent'>本协议条款一经点击确认，即视为您已完全理解并同意本协议条款（包括有关权利义务和/或责任限制、免责条款），并视为本协议已由我公司与您双方签署生效。您的使用、
                        登录等行为即视为您已阅读并同意接受本协议的约束，您对此可能存在的风险及后果已准确、清晰地知悉和理解。</div>
                            <div className='indent weight'>本协议为借款人（以下可称为“客户”）在“聚宝匯—海航白条”（以下可称为“原平台”）借款时签订的协议关于业务数据迁移及平台变更的补充协议，除非有特殊说明，其他条款与原协议一致。</div>
                            <div className='indent weight'>借款人同我公司已签订的全部借款协议见下表所示：</div>
                            <div className='table'>
                                <table >
                                    <tbody>
                                        <tr>
                                            <th style={{width:'10%',borderLeft:'none'}}>序号</th>
                                            <th>签订日期</th>
                                            <th>编号(如有)</th>
                                            <th>协议名称</th>
                                        </tr>
                                    </tbody>
                                    {this.state.supplwementData.map((item, index) => {
                                        return <tbody key={index}>
                                            <tr>
                                                <td style={{width:'10%', borderLeft:'none'}}>{index + 1}</td>
                                                <td>{item.signDate}</td>
                                                <td>{item.contractNo}</td>
                                                <td>{item.contractName}</td>
                                            </tr>
                                        </tbody>
                                    })}

                                </table>
                            </div>
                            <div className='weight indent'>上表中所列协议涉及争议解决的条款，若之前协议中内容为“本合同项下及与之有关的一切争议，应首先协商解决；协商不成的，双方均同意提请中国广州仲裁委员会, 按照申请仲裁时该会现行有效的网络仲裁规则进行网络仲裁，并进行书面审理。仲裁裁决是终局的，对双方均有约束力。”的，
                            该条款变更为如下内容：“本合同项下及与之有关的一切争议，应首先协商解决；协商不成的，双方有权将争议提交至我公司住所地有管辖权的人民法院进行起诉，若该争议不影响本协议其他条款的履行，则该其他条款应继续履行。”</div>
                            <div className='weight indent'>为提升客户贷款业务使用体验，加强数据安全，更有效为客户提供专业服务，双方就如下内容达成一致：</div>
                            <div> 1. 借款人同意将当前所使用的“聚宝匯—海航白条”所产生的全部业务数据迁移至“航旅分期”App
                            （以下可称为“新平台”）进行存储。我公司保障客户数据迁移的完整性及安全性。借款人在数据迁移完成后，需在新平台进行日常借款、还款等全部操作。</div>
                            <div> 2. 借款人需根据引导下载“航旅分期”APP绑定原有账号，具体方法为：根据公告引导在引导页面或应用市场
                            下载“航旅分期”App，通过个人手机号码进行注册，并根据提示完成账号绑定，在账号完成绑定后，客户在新平台之各项业务数据会同客户在原平台注册账号进行关联及同步。 </div>
                            <div> 3. 借款人注册成功即视为完成数据迁移及平台变更。我公司会以新系统账号密
                            码作为唯一标识识别您的身份。后续借款人在新平台上发生的使用借款账号及密码的行为均代表客户的正常行为和本人意思的表达，并由客户承担相应的法律后果。</div>
                            <div> 4. 借款人应当妥善保管在新平台的账号和密码，防止账号和密码泄露，因客户个人出现账号和密码泄露借所造成的损失，需由借款人自行承担。</div>
                            <div> 5. 本合同的订立、效力、解释、履行和争议的解决均受中国法律管辖。</div>
                            <div> 6. 本合同项下及与之有关的一切争议，应首先协商解决；协商不成的，双方有权将争议提交至我公司住所地有管辖权的人民法院进行起诉，若该争议不影响本协议其他条款的履行，则该其他条款应继续履行。</div>
                            <div> 7. 我公司对本协议拥有最终的解释权。</div>
                            {this.state.isNeed2SignCustomerAuth && protocol.userAuthorization}
                        </div>
                    </div>
                    <div className="footer">
                        <span
                            className="no"
                            onClick={() => {
                                this.exitApp()
                            }}
                        >
                            不同意
                        </span>
                        <Button
                            className="yes"
                            disabled={this.state.toDisabled}
                            onClick={() => {
                                this.goCredits();
                            }}
                        >
                            同意{this.state.timeText}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<SupplementProtocol />, document.getElementById("supplementProtocol"));
