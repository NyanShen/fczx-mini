import Taro from '@tarojs/taro'
import storage from '@utils/storage'

const getCityAlias = (): string => {
    const city = storage.getItem('city')
    if (city) {
        return city.alias
    } else {
        Taro.navigateTo({
            url: '/house/city/index'
        })
        return ''
    }
}

const agreement: string = 'https://'
const topDomain: string = '.fczx.com'
const uploadFileUrl = `${agreement}api${topDomain}/file/upload`
const app: any = {};
app.apiUrl = (uri: string) => {
    return `${agreement}api${topDomain}${uri}`
}

app.areaApiUrl = (uri: string) => {
    return `${agreement}areaapi${topDomain}${uri}`
}

app.testApiUrl = (uri: string) => {
    return `http://192.168.2.248:12306${uri}`
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

app.request = (params: any, { loading = true, toast = true }: any = {}) => {

    if (!params.data) {
        params.data = {}
    }

    const city = { 'X-City': getCityAlias() }
    const token = { 'X-Token': storage.getItem('token', 'login') }
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
                if (data.code == 1 && data.message == 'ok') {
                    if (loading) {
                        Taro.hideLoading()
                    }
                    resolve(data.data)
                } else {
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

app.uploadFile = (data: any, callback: (string) => void) => {
    for (let i = 0; i < data.tempFiles.length; i++) {
        Taro.uploadFile({
            url: uploadFileUrl,
            filePath: data.tempFilePaths[i],
            name: 'file',
            formData: {
                file: data.tempFiles[i]
            },
            header: {
                'X-Token': storage.getItem('token', 'login')
            },
            success: ((result: any) => {
                callback(JSON.parse(result.data).data)
            })
        })
    }
}

export default app;