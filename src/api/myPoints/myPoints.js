/* 我的积分相关接口 */
import axiosService from "../apiConfig";

/*
 * 我的信息
 */
export async function points() {
  return axiosService({
    url: '/app-api/points/log',
    method: 'post',
  });
}

export default {
  points
}
