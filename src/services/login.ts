import Taro, { getCurrentInstance } from '@tarojs/taro'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import { toUrlParam } from '@utils/urlHandler'

export const getToken = () => storage.getItem('token')

export const hasLoginBack = (backUrl: string = '') => {
    return new Promise((resolve: any) => {
        if (getToken()) {
            resolve(true)
        } else {
            if (!backUrl) {
                const router: any = getCurrentInstance().router
                if (router?.path) {
                    backUrl = `${router?.path}${toUrlParam(router?.params)}`
                } else {
                    const lastIndex = router?.onReady.lastIndexOf('.')
                    backUrl = router?.onReady.substring(0, lastIndex)
                }
            }
            app.toLogin(backUrl)
        }
    })
}

export const hasLogin = () => {
    return new Promise((resolve: any) => {
        app.request({
            url: app.apiUrl(api.getUserData)
        }, { loading: false }).then((result: any) => {
            resolve(result)
        })
    })
}

export const fetchUserData = (backUrl: string = '') => {
    return new Promise((resolve: any) => {
        app.request({
            url: app.apiUrl(api.getUserData)
        }, { loading: false }).then((result: any) => {
            if (result) {
                resolve(result)
            } else {
                app.toLogin(backUrl)
            }
        })
    })
}

export const fetchSessionKey = () => {
    return new Promise((resolve: any) => {
        Taro.login({
            success: function (res) {
                if (res.code) {
                    app.request({
                        url: app.apiUrl(api.getSessionKeyByCode),
                        data: {
                            code: res.code
                        }
                    }, { loading: false }).then((result: any) => {
                        storage.setItem('session_key', result.session_key)
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
    return new Promise((resolve: any) => {
        app.request({
            method: 'POST',
            url: app.apiUrl(api.decryptData),
            data: decryptParam
        }, { loading: false }).then((result: any) => {
            resolve(result)
        })
    })

}