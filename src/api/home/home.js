/* 首页相关接口 */
import axiosService from "../apiConfig";

/*
 * 首页公告
 */
export async function noticeShowtop(params) {
  return axiosService({
    url: 'app-api/home/notice-showtop',
    method: 'post',
    data: params
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

/*
 * 授信详情
 */
export async function limitDetail() {
  return axiosService({
    url: '/app-api/home/limit-detail',
    method: 'post',
  });
}

export default {
  noticeShowtop,
  limitDisplay,
  limitDetail
}
