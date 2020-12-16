import Taro from '@tarojs/taro'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'

export const hasLogin = () => {
    return new Promise((resolve) => {
        app.request({
            url: app.apiUrl(api.getUserData)
        }, { loading: false }).then((result: any) => {
            resolve(result)
        })
    })
}

export const fetchUserData = (backUrl: string = '') => {
    return new Promise((resolve) => {
        app.request({
            url: app.apiUrl(api.getUserData)
        }, { loading: false }).then((result: any) => {
            if (result) {
                resolve(result)
            } else {
                Taro.redirectTo({
                    url: `/login/index?backUrl=${encodeURIComponent(backUrl)}`
                })
            }
        })
    })
}

export const fetchSessionKey = () => {
    return new Promise((resolve) => {
        Taro.login({
            success: function (res) {
                if (res.code) {
                    app.request({
                        url: app.apiUrl(api.getSessionKeyByCode),
                        data: {
                            code: res.code
                        }
                    }, { loading: false }).then((result: any) => {
                        storage.setItem('session_key', result.session_key, 'login')
                        resolve(result.session_key)
                    })
                }
            }
        })
    })
}

interface IDecryptParam {
    sessionKey: string
    encryptedData: string
    iv: string
}

export const fetchDecryptData = (decryptParam: IDecryptParam) => {
    return new Promise((resolve) => {
        app.request({
            method: 'POST',
            url: app.apiUrl(api.decryptData),
            data: decryptParam
        }, { loading: false }).then((result: any) => {
            resolve(result)
        })
    })

}