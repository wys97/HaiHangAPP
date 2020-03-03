/* 用于存取token */
export function getToken() {
    if (window) {
        return window.localStorage.getItem('Apptoken') ? window.localStorage.getItem('Apptoken') : '';
    }
    throw '非浏览器浏览'
}

export function getH5Token() {
    if (window) {
        return window.localStorage.getItem('h5Token') ? window.localStorage.getItem('h5Token') : '';
    }
    throw '非浏览器浏览'
}

export function setToken(token) {
    if (window) {
        window.localStorage.setItem('Apptoken', token);
    } else {
        throw "非浏览器浏览"
    }
}

export function setH5Token(token) {
    if (window) {
        window.localStorage.setItem('h5Token', token);
    } else {
        throw "非浏览器浏览"
    }
}

export function clearToken() {
    if (window) {
        window.localStorage.setItem('Apptoken', "");
    } else {
        throw "非浏览器浏览"
    }
}

export function clearH5Token() {
    if (window) {
        window.localStorage.setItem('h5Token', "");
    } else {
        throw "非浏览器浏览"
    }
}

/* 用于存取设备系统信息 */
export function getDeviceType() {
    if (window) {
        return window.localStorage.getItem('appdeviceType');
    }
    throw '非浏览器浏览'
}

export function setDeviceType(token) {
    if (window) {
        window.localStorage.setItem('appdeviceType', token);
    } else {
        throw "非浏览器浏览"
    }
}

/* 用于存取设备识别码信息 */
export function getDeviceId() {
    if (window) {
        if (window.localStorage.getItem('appDeviceId')) {
            return window.localStorage.getItem('appDeviceId');
        } else {
            setDeviceId(('' + Math.random()).split('.').join(''));
            return window.localStorage.getItem('appDeviceId');
        }
    }
    throw '非浏览器浏览'
}

export function setDeviceId(id) {
    if (window) {
        window.localStorage.setItem('appDeviceId', id);
    } else {
        throw "非浏览器浏览"
    }
}

export function getShowTitle() {
    if (window) {
        if (!window.localStorage.getItem('showTitle')) {
            window.localStorage.setItem('showTitle', 'h5');
        }
        return window.localStorage.getItem('showTitle');
    } else {
        throw "非浏览器浏览"
    }
}

export function setShowTitle(type) {
    if (window) {
        window.localStorage.setItem('showTitle', type);
    } else {
        throw "非浏览器浏览"
    }
}

export default {
    getToken,
    getH5Token,
    setToken,
    setH5Token,
    clearToken,
    clearH5Token,
    getDeviceType,
    setDeviceType,
    getDeviceId,
    setDeviceId,
    getShowTitle,
    setShowTitle
}
