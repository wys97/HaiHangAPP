/* 公共接口 */
import axios from "axios";
import { getDeviceId, getDeviceType, getH5Token, setToken, getToken} from "../loginToken";
import editorInfo from "../editorConfig";
// import loadQuickLogin from "../quickLogin";

let axiosService = null;
// if (getDeviceType() === 'h5') {
    axiosService = axios.create();

    axiosService.interceptors.request.use(function (config) {
        // 设置自定义请求头
        config.headers.common['h5Token'] = getH5Token();
        config.headers.common['Apptoken'] = getToken();
        config.headers.common['appVersion'] = (window.api ? window.api.appVersion : '') + ',' + editorInfo.version;
        config.headers.common['appDeviceType'] = getDeviceType();
        config.headers.common['appDeviceId'] = getDeviceId();
        return config
    });

    axiosService.interceptors.response.use(
        (response) => { // 接口拦截
            // 获取token
            if (JSON.stringify(response.headers).indexOf('Apptoken') !== -1) {
                setToken(response.headers['Apptoken']);
            }
            // if (response.data.code === '401') {
            //     loadQuickLogin();
            //     return Promise.reject(response);
            // }
            return response;
        }
    );
/*} else {
    axiosService = window.api.ajax;
}*/

export default axiosService
