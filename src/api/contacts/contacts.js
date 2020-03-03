/* 联系人相关接口 */
import axiosService from "../apiConfig";

/*
 * 联系人列表
 */
export async function contactInfo() {
  return axiosService({
    url: "/app-api/points/contact_info/list",
    method: "post"
  });
}

/*
 * 新增联系人
 */
export async function contactInfoSave() {
  return axiosService({
    url: "/app-api/points/contact_info/save",
    method: "post"
  });
}

/*
 * 授信结果
 */
export async function creditApply() {
  let data = {
    ip: "127.0.0.1",
    blackBox: "zln的指纹数据"
  };
  return axiosService({
    url: "/app-api/credit/apply",
    method: "post",
    data
  });
}

export default {
  contactInfo,
  contactInfoSave,
  creditApply
};
