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
 * 首页客户逾期信息查询
 */
export async function overdueDetail() {
  return axiosService({
    url: '/app-api/home/overdue-detail',
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
  limitDetail,
  overdueDetail
}
