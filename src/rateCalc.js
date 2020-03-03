import React from 'react';
import ReactDOM from 'react-dom';
import {createForm} from 'rc-form';
import {getShowTitle} from "./loginToken";
import {Button, Flex, Icon, InputItem, List, NavBar, Toast, WingBlank} from "antd-mobile";
import * as _ from "lodash";
import './rateCalc.scss';
import rateCalcApi from "./api/rateCalc/rateCalc";
import downImg from "./assets/image/down.png";
import { getLink, getApi } from "./linkConfig";

const Item = List.Item;
const Brief = Item.Brief;

class RateCalcForm extends React.Component {
    static displayName = 'RateCalc';
    static propTypes = {};
    static defaultProps = {};

    constructor(props) {
        super(props);

        this.state = {
            price: '￥',
            deviceType: getShowTitle(),
            stages: [false, false, false, false, false],
            computeList: []
        };
    }

    componentWillMount() {
        const that = this;
        window.apiready = function () {
            that.setState({
                ajax: window.api.ajax
            });
        }
    }

    changePrice = (val) => {
        if (val.indexOf('￥') !== -1) {
            this.setState({
                price: val
            })
        } else {
            this.setState({
                price: '￥' + val
            })
        }
    };

    toCompute = () => {
        const that = this;
        const index = _.findIndex(this.state.stages, (obj) => {
            return obj;
        });
        const data = {
            loanAmount: this.state.price.substring(1),
            loanTerm: index ? index * 3 : 1,
            partnerNo: 'CO001',
            prdtNo: 'PD002'
        };
        if (window.api) {
            this.state.ajax({
                url: getLink() + getApi("calculator"),
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                dataType: 'json',
                returnAll: true,
                data: {
                    body: data
                }
            }, function (ret, err) {
                if (err) {
                    Toast.fail(err.body.message, 3);
                    return;
                }
                const res = {data: ret.body};
                if (res.data.code !== '200') {
                    Toast.fail(res.data.message, 3);
                    return;
                }
                that.setState({
                    computeList: res.data.data
                });
            });
            return;
        }
        rateCalcApi.toCompute(data).then((res) => {
            if (res.data.code !== '200') {
                Toast.fail(res.data.message, 3);
                return;
            }
            this.setState({
                computeList: res.data.data
            })
        })
    };

    goback = () => {
        if (window.api) {
            window.api.closeFrame();
        }
    };

    render() {
        const {getFieldProps} = this.props.form;

        return (
            <div className='rateCalc' style={{minHeight: '100%', backgroundColor: '#F9FAF9'}}>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" color="#333333"/>}
                    onLeftClick={() => this.goback()}
                    style={{
                        position: 'fixed',
                        top: 0,
                        width: '100%',
                        zIndex: 1,
                        fontSize: '18px',
                        color: '#333333'
                    }}
                >费率计算</NavBar>
                <div style={{height: '45px'}}/>
                <div style={{paddingRight: '15px', backgroundColor: '#FFFFFF'}}>
                    <List>
                        <InputItem
                            {...getFieldProps('autofocus')}
                            type='money'
                            maxLength={8}
                            value={this.state.price}
                            moneyKeyboardAlign="right"
                            placeholder="最多输入7位数字"
                            onChange={this.changePrice}
                            style={{
                                textAlign: 'right'
                            }}
                        >借款金额(元)</InputItem>
                        <Item
                            multipleLine
                            onClick={() => {
                            }}
                            activeStyle={{
                                backgroundColor: '#FFFFFF'
                            }}
                            className='tags'
                        >
                            借款期数
                            <Brief>
                                <Flex>
                                    {this.state.stages.map((item, idx) => {
                                        return <Flex.Item key={idx}>
                                            <div><Button
                                                style={item ? {
                                                    border: '1px solid #E1514C',
                                                    backgroundColor: '#FDF1F1',
                                                    color: '#E1514C',
                                                    fontSize: '14px'
                                                } : {
                                                    border: '1px solid #E1E1E1',
                                                    color: '#444D54',
                                                    fontSize: '14px'
                                                }} onClick={() => {
                                                const stages = new Array(5).fill(false);
                                                stages[idx] = true;
                                                this.setState({
                                                    stages
                                                })
                                            }}>{idx ? idx * 3 + '期' : '1期'}</Button>
                                            </div>
                                        </Flex.Item>
                                    })}
                                </Flex>
                            </Brief>
                        </Item>
                        <Item extra={'等额本息'} style={{borderBottom:'2px solid #F4F4F4',}}>
                            还款方式
                        </Item>
                    </List>
                </div>
                <div style={{
                    padding: '8px 15px',
                    fontSize: '12px',
                    color: '#9B9B9B',
                    height: '17px',
                    lineHeight: '17px'
                }}>注：计算结果仅供参考，请以实际借款数据为准
                </div>
                {this.state.computeList.length ? <div>
                    <div style={{
                        textAlign: 'center',
                        fontSize: 0
                    }}>
                        <div style={{
                            padding: '32px 15px 0',
                            fontSize: '16px',
                            height: '22px',
                            lineHeight: '22px',
                            color: '#E1514C'
                        }}>计算结果
                        </div>
                        <img src={downImg} alt='' style={{width: '17px', margin: '0 auto'}}/>
                        <WingBlank>
                            <div style={{
                                padding: '10px 0',
                                color: '#9B9B9B',
                                fontSize: '12px',
                                borderBottom: '1px solid #EDEDED'
                            }}>

                                <Flex>
                                    <Flex.Item>
                                        <div>期数</div>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <div style={{textAlign: 'right'}}>还款金额</div>
                                    </Flex.Item>
                                </Flex>
                            </div>
                        </WingBlank>
                    </div>
                    <WingBlank>
                        {
                            this.state.computeList.map((item, idx) => {
                                return <div key={idx} style={{height: '74px', borderBottom: '1px solid #EDEDED'}}>
                                    <Flex>
                                        <Flex.Item style={{width: '20%', flex: 'auto'}}>
                                            <div style={{height: '74px', lineHeight: '74px',}}>{item.periodNo}</div>
                                        </Flex.Item>
                                        <Flex.Item style={{width: '80%', flex: 'auto'}}>
                                            <div style={{
                                                textAlign: 'right',
                                                color: '#444D54',
                                                fontSize: '16px'
                                            }}>{item.periodAmt}</div>
                                            <div style={{
                                                textAlign: 'right',
                                                color: '#9B9B9B',
                                                fontSize: '14px'
                                            }}>{'本金:' + item.principal + ' + ' + '利息:' + item.interest}</div>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            })
                        }
                    </WingBlank>
                </div> : null}
                <div style={{height: '95px'}}/>
                <div style={{
                    boxSizing: 'border-box',
                    width: '100%',
                    padding: '30px 28px 20px',
                    backgroundColor: '#F9FAF9',
                    // boxShadow: '0px -8px 24px 0px rgba(63,22,3,0.1)',
                    position: 'fixed',
                    bottom: 0,
                    zIndex: 20
                }}>
                    <NavBar
                        style={JSON.stringify(this.state.stages).indexOf('true') !== -1 && this.state.price.length > 1 ? {
                            backgroundColor: '#E1514C',
                            borderRadius: '22px 0 22px 0',
                            height: '45px'
                        } : {
                            backgroundColor: '#BDBDBD',
                            color: '#FFFFFF',
                            borderRadius: '22px 0 22px 0',
                            height: '45px'
                        }}
                        mode="dark"
                        onClick={JSON.stringify(this.state.stages).indexOf('true') !== -1 && this.state.price.length > 1 ?
                            this.toCompute :
                            () => {
                            }
                        }
                    >计算</NavBar>
                </div>
            </div>
        );
    }
}

const RateCalc = createForm()(RateCalcForm);
ReactDOM.render(<RateCalc/>, document.getElementById('rate'));
