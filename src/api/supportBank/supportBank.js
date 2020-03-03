/* 银行相关接口 */
import axiosService from "../apiConfig";



/*
 * 支持银行
 */
export async function supportBank(data) {
  return axiosService({
    url: '/app-api/credit/support-bank',
    method: 'post',
    data
  });
}

export default {
  supportBank
}