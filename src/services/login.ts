import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'

export const fetchSessionKey = (code: string) => {
    return new Promise((resolve) => {
        app.request({
            url: app.apiUrl(api.getSessionKeyByCode),
            data: {
                code
            }
        }).then((result: any) => {
            storage.setItem('session_key', result.session_key, 'login')
            resolve(result)
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