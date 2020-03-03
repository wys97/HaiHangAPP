/* 用户基本资料相关接口 */
import axiosService from "../apiConfig";

/*
 * 地区信息
 */
export async function areaInfo() {
  return axiosService({
    url: '/app-api/points/area-info',
    method: 'post',
  });
}
/*
 * 提交资料
 */
export async function save(data) {
  return axiosService({
    url: '/app-api/points/basic_info/save',
    method: 'post',
    data
  });
}

export default {
  areaInfo,
  save
}