/* 登录相关接口 */
import axiosService from "../apiConfig";

/*
 * 密码登录
 */
export async function passwordLogin(params) {
    return axiosService({
        url: 'app-api/login/password-login',
        method: 'post',
        data: params
    });
}

/*
 * 获取验证码
 */
export async function sendSmsCode(data) {
    return axiosService({
        url: 'app-api/login/send-sms-code/',
        method: 'post',
        data
    });
}

/*
 * 验证码登录
 */
export async function smsLogin(data) {
    return axiosService({
        url: 'app-api/login/sms-login',
        method: 'post',
        data
    });
}

export default {
    passwordLogin,
    sendSmsCode,
    smsLogin
}
