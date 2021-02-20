import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro'
import storage from '@utils/storage'
import { toUrlParam } from '@utils/urlHandler'
import api from './api'

let count: number = 0

const getToken = () => storage.getItem('token')

const getBackUrl = () => {
    let path: string = '/pages/index/index'
    const router: any = getCurrentInstance().router
    if (router?.path) {
        path = router?.path
    }
    const backUrl = `${path}${toUrlParam(router?.params)}`
    return backUrl
}

const getCityAlias = (): string => {
    const city = storage.getItem('city')
    if (city) {
        return city.alias
    } else {
        return ''
    }
}

const toCityList = () => {
    count = 0
    Taro.redirectTo({
        url: `/house/city/index?backUrl=${encodeURIComponent(getBackUrl())}`
    })
}

const agreement: string = 'https://'
const topDomain: string = '.fczx.com'
const uploadFileUrl = `${agreement}api${topDomain}/file/upload`
const app: any = {}
app.apiUrl = (uri: string) => {
    return `${API_URL}${uri}`
}

app.areaApiUrl = (uri: string) => {
    return `${AREA_API_URL}${uri}`
}

app.testApiUrl = (uri: string) => {
    return `http://localhost:12306${uri}`
}

app.randCode = (len: number) => {
    const charset = 'abcdefghkmnprstuvwxyzABCDEFGHKMNPRSTUVWXYZ0123456789';
    const charsetLen: number = charset.length - 1;
    let code = '';
    for (let i = 0; i < len; i++) {
        code += charset[parseInt(`${charsetLen * Math.random()}`)];
    }
    return code;
}

app.setLocation = (callback: (any) => void) => {
    if (count > 0) {
        return
    }
    if (IS_H5) {
        toCityList()
        return
    }
    Taro.getLocation({
        type: 'wgs84',
        success: (result: any) => {
            if (result.errMsg === 'getLocation:ok') {
                app.request({
                    url: app.apiUrl(api.getCommonLocation),
                    method: 'POST',
                    data: result
                }).then((result: any) => {
                    if (result) {
                        storage.setItem('city', result)
                        callback && callback(result)
                    } else {
                        toCityList()
                    }
                })
            }
        },
        fail: () => {
            toCityList()
        }
    })
}

app.toLogin = (backUrl: string = '', isTab: string = '', type: string = '') => {
    let url: string = ''
    if (IS_H5) {
        url = `/login/phone/index?backUrl=${encodeURIComponent(backUrl)}&isTab=${isTab}`
    } else {
        url = `/login/index?backUrl=${encodeURIComponent(backUrl)}&isTab=${isTab}`
    }
    if (type) {
        Taro.navigateTo({ url })
    } else {
        Taro.redirectTo({ url })
    }
}

app.request = (params: any, { loading = true, toast = true }: any = {}) => {

    if (!params.data) {
        params.data = {}
    }

    const city = { 'X-City': getCityAlias() }
    const token = { 'X-Token': getToken() }
    params.header = { ...params.header, ...token, ...city }

    const { page, limit } = params.data
    if (typeof page != "undefined" && typeof limit != "undefined") {
        const pageParam = {
            'X-Page': page,
            'X-Page-Size': limit
        }
        params.header = { ...params.header, ...pageParam }
        delete params.data.page
        delete params.data.limit
    }
    return new Promise((resolve, reject) => {
        if (loading) {
            Taro.showLoading({
                title: '加载中......',
                mask: true
            })
        }
        Taro.request({
            url: params.url,
            data: params.data,
            method: params.method,
            header: params.header,
            success: function ({ data }: any) {
                if (data.status === 401) {
                    eventCenter.trigger('logout')
                    if (!params.data.static) {
                        app.toLogin(getBackUrl())
                    }
                    reject(data)
                    return
                }
                if (data.code == 1 && data.message == 'ok') {
                    if (loading) {
                        Taro.hideLoading()
                    }
                    resolve(data.data)
                } else {
                    if (params.url.indexOf('areaapi') !== -1 && !getCityAlias()) {
                        app.setLocation(() => {
                            Taro.reLaunch({
                                url: getBackUrl()
                            })
                        })
                        count = count + 1
                        return
                    }
                    if (toast) {
                        Taro.showToast({
                            title: data.message,
                            icon: 'none',
                            mask: true
                        })
                    } else {
                        Taro.hideLoading()
                    }
                    reject(data)
                }
            },
            fail: function (err: any) {
                console.log('fail', err)
                let msg = err.errMsg
                if (msg == 'request:fail timeout') {
                    msg = '服务器请求超时，请稍后再试'
                }
                Taro.showToast({
                    title: msg,
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}

const taroUploadFile = (filePath: string, callback: (...any) => void, file: any = {}) => {
    Taro.uploadFile({
        url: uploadFileUrl,
        filePath: filePath,
        name: 'file',
        formData: { file },
        header: {
            'X-Token': getToken()
        },
        success: ((result: any) => {
            callback(JSON.parse(result.data).data)
        })
    })
}

app.uploadFile = (data: any, callback: (...any) => void) => {
    if (data.errMsg === 'chooseMedia:ok') {
        const videoData = data.tempFiles[0]
        taroUploadFile(videoData.tempFilePath, callback)
        taroUploadFile(videoData.thumbTempFilePath, callback)
    }
    if (data.errMsg === 'chooseImage:ok') {
        for (let i = 0; i < data.tempFiles.length; i++) {
            taroUploadFile(data.tempFilePaths[i], callback, data.tempFiles[i])
        }
    }
}




//设置cookie

app.setCookie = function (key: string, value: string, expires: number, domain: string, path: string = '/') {
    let today: any = new Date();
    today.setTime(today.getTime());
    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    let expiresDate: any = new Date(today.getTime() + (expires));

    document.cookie = key + "=" + escape(value) +
        ((expires) ? ";expires=" + expiresDate.toGMTString() : "") +
        ((path) ? ";path=" + path : "") +
        ((domain) ? ";domain=" + domain : "");
}

app.getCookie = function (key) {
    let allCookies: string[] = document.cookie.split(';');
    let cookieKey: string = '';
    let cookieValue: string = '';
    let tempCookie: string[] = [];
    let isFound: boolean = false;

    allCookies.forEach(function (item) {
        tempCookie = item.split('=');
        cookieKey = tempCookie[0].replace(/^\s+|\s+$/g, '');
        if (cookieKey == key) {
            isFound = true;
            if (tempCookie.length > 1) {
                cookieValue = unescape(tempCookie[1].replace(/^\s+|\s+$/g, ''));
            }
        }
        cookieKey = '';
        tempCookie = [];
    })

    if (!isFound) {
        return null
    }
    return cookieValue
}

app.deleteCookie = function (key: string, domain: string = 'loubei.com', path: string = '/') {
    if (app.getCookie(key)) {
        document.cookie = key + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
    }
}

export default app;