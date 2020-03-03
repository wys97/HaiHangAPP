/* 我的相关接口 */
import axiosService from "../apiConfig";

/*
 * 活体识别上传图片
 */
export async function uploadAlivePicture({name, idCard, photoBase64}) {
    const param = {
        name,
        idCard,
        photoBase64
    };

    return axiosService({
        url: '/app-api/credit/auth-face',
        method: 'post',
        data: param
    });
}

export default {
    uploadAlivePicture
}
