/* 登录相关接口 */
import axiosService from "../apiConfig";

/*
 * 计算
 */
export async function toCompute(params) {
    return axiosService({
        url: '/app-api/home/calculator',
        method: 'post',
        data: params
    });
}

export default {
    toCompute,
}
