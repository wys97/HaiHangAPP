/**
 * 接口、链接变量文件
 * 
 */
export function getMenu(menuName) {  //H5跳转url
    const menuList = {
        "个人信息维护": "personalSettings/personalInformation.html",
        "还款": "repayment/repayment.html",
        "支用": "pay/index.html",
        "提额": "liftingAmount/index.html",
        "交易记录": "transactRecord/transaction-record.html",
        "公告列表": "msgCenter/msgCenter.html",
        "公告详情": "msgCenter/groups.html",
        "银行卡维护": "personalSettings/bankcardList.html",
        "修改支付密码": "personalSettings/verifyPassword.html",
        "忘记支付密码": "personalSettings/reset-creditMessage.html",
        "设置支付密码": "personalSettings/payment-password.html",
        "支付密码维护": "personalSettings/passwordSetting.html",
        "个人中心": "userInfo.html",
        "首页": "index.html"
    };
    if (String(menuList[menuName]).includes("/")) {
        return 'https://hnhk.jbhloan.com/cashLoan/' + menuList[menuName]    //测试
        // return 'https://hnhk-uat.jbhloan.com/cashLoan/' + menuList[menuName]         //预生产
        // return 'https://hkbt.jbhloan.com/cashLoan/' + menuList[menuName]         //生产
    } else {
        return menuList[menuName]
    }

};

export function getApi(apiName) {  //api 接口地址
    const apiList = {
        //授信接口
        "creditApply": "/app-api/credit/apply",                 //授信申请
        "getCustomerInfo": "/app-api/credit/getCustomerInfo",   //绑卡前获取用户信息
        "ocrBankCard": "/app-api/credit/ocr-bank-card",        //OCR识别银行卡
        "authFace": "/app-api/credit/auth-face",                //人脸识别
        "ocrIdCard": "/app-api/credit/ocr-id-card",             //OCR识别身份证
        "cardBin": "/app-api/credit/cardBin/",      //根据银行卡号获取卡类型和发卡行
        "preSign": "/app-api/credit/pre-sign/",      //获取绑卡验证码（支付中心-预签约）
        "supportBank": "/app-api/credit/support-bank",         //支持银行列表（含 ICON）
        "bindBankCard": "/app-api/credit/bind-bank-card",          //APP 绑卡接口
        //首页
        "noticeShowto": "/app-api/home/notice-showtop",             //置顶栏公告
        "calculator": "/app-api/home/calculator",                   //费率计算器
        "updateToken": "/app-api/update-token",                 //刷新小贷token
        "limitDetail": "/app-api/home/limit-detail",           //额度详情
        "limitDisplay": "/app-api/home/limit-display",              //首页额度显示
        "overdueDetail": "/app-api/home/overdue-detail",            //客户逾期信息查询
        //积分、用户信息
        "checkStatus": "/app-api/points/check-status",               //用户信息和签到状态查询
        "areaInfo": "/app-api/points/area-info",                    //地区信息
        "versionCheck": "/app-api/points/version/check",        //检查新版本
        "contacInfoList": "/app-api/points/contact_info/list",          //常用联系人-列表
        "contacInfoSave": "/app-api/points/contact_info/save",          //常用联系人-新增
        "contacInfoSaveBatch": "/app-api/points/contact_info/save_batch",      //常用联系人-批量新增
        "contacInfoUpdate": "/app-api/points/contact_info/update",         //常用联系人-更新
        "contacInfoDelete": "/app-api/points/contact_info/delete/",        //常用联系人-删除
        "contacInfoAuthStatus": "/app-api/points/contact_info/auth_status",          //常用联系人-提交认证信息
        "basicInfoSave": "/app-api/points/basic_info/save",                //用户基本资料新增
        "pointsLog": "/app-api/points/log",                     //用户积分流水
        "pointsLogWeek": "/app-api/points/log-week",            //更多积分流水查询
        "pointsCheckIn": "/app-api/points/check-in",            //签到
        //登录&注册
        "loginCaptcha": "/app-api/login/captcha",               //获取图形验证码
        "loginPasswordLogin": "/app-api/login/password-login",   //密码登录
        "loginSmsLogin": "/app-api/login/sms-login",            //手机验证码登录
        "loginPasswordSetting": "/app-api/login/password-setting",   //设置登录密码
        "loginout": '/app-api/logout',                  //登出
        "sendSmsCode": "/app-api/login/send-sms-code",          //发送登录验证码
        "vaildCmsCode": "/app-api/login/reset-password/vaild-sms-code",       //忘记密码-验证短信码
        "verifyIdentity": "/app-api/login/reset-password/verify-identity",          // 忘记密码 - 验证身份证号码
        "passwordSetting": "/app-api/login/reset-password/password-setting",        //忘记密码-设置密码
        //我的
        "creditAssessment": "/app-api/mine/credit-assessment",              //授信评估-合同
        "helpCenterList": "/app-api/help-center/list",                      //帮助中心-问题列表
        "helpCenterGet": "/app-api/help-center/get/",                       //帮助中心-问题详情
        "passwordModify": "/app-api/mine/password-modify",                  //修改密码
        "creditAgreementParam": "/app-api/credit/credit-agreement-param",                  //协议用户信息详情
        "withholdAgreementParam": "/app-api/credit/withhold-agreement-param",                  //协议用户信息详情  代扣协议
        'supplement': '/app-api/credit/sign-hs-supplement',   //签署恒生数据迁移补充协议
        'isNeed2Sign': '/app-api/mine/is-need2-sign',   //判断同步额度按钮是否显示
        'showCustomer': '/app-api/credit/is-show-customer-auth', //是否显示 用户授权委托书
        'supplwementData':'/app-api/credit/hs-supplwement-data', //判断同步额度变量

        //公共分类
        "sendCode": "/app-api/sms/send-code",              //发送验证码
        "vaildSmsCode": "/app-api/sms/vaild-sms-code",      //验证验证码

    };

    return apiList[apiName]

};
export function getLink() {
    // const link = "https://api.jbhloan.com"           //生产
    const link = "http://ccs46.tunnel.onepaypass.com"         //测试
    // const link = "http://ccs45.tunnel.onepaypass.com"         //预生产
    // const link = "https://preccs.jbhloan.com/"        //灰度
    // const link = "http://10.188.0.151:8080"        //联调测试
    return link
};

export function getBanner() {//banner地址
    const bannerList = [
        { banner:"/images/banner/banner2x.png", bannerUrl: "/operation-guide.html"},
        { banner: "/images/banner/banner3x.png", bannerUrl:""}
    ];
    bannerList.map((ite,index)=>{
        bannerList[index].banner = 'https://hnhk.jbhloan.com' + ite.banner    //测试
        //bannerList[index].banner = 'https://hnhk-uat.jbhloan.com' + ite.banner        //预生产
        // bannerList[index].banner = 'https://hkbt.jbhloan.com' + ite.banner              //生产

        bannerList[index].bannerUrl = 'https://hnhk.jbhloan.com' + ite.bannerUrl    //测试
        //bannerList[index].bannerUrl = 'https://hnhk-uat.jbhloan.com' + ite.bannerUrl        //预生产
        // bannerList[index].bannerUrl = 'https://hkbt.jbhloan.com' + ite.bannerUrl            //生产
    })
    return bannerList
}

export function ticketOffice() {

    // const Office = 'http://m.hnair.com/'    //买机票  生产地址链接
    const Office = 'https://uat-app.hnair.com/app_web_nightly/index.html#/?_k=nfielw'   //买机票  测试地址链接

    return Office
};




export default {
    getMenu,
    getApi,
    getLink,
    ticketOffice
}
