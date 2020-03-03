/* 我的相关接口 */
import axiosService from "../apiConfig";

/*
 * 我的信息
 */
export async function checkStatus() {
  return axiosService({
    url: '/app-api/points/check-status',
    method: 'post',
  });
}

/*
 * 额度信息
 */
export async function limitDisplay() {
  return axiosService({
    url: '/app-api/home/limit-display',
    method: 'post',
  });
}

export default {
  limitDisplay,
  checkStatus,
  limitDisplay
}
