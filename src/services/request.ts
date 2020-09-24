import Taro from '@tarojs/taro'
import storage from '@utils/storage'

const getCityAlias = (): string => {
    const city = storage.getItem('city')
    if (city) {
        return city.alias
    }
    return ''
}

const agreement: string = 'http://'
const topDomain: string = '.fczx.com'
const apiDomain: string = `${agreement}api${topDomain}`
const testApiDomain: string = `${agreement}192.168.2.248:12306`

const app: any = {};
app.mockApi = 'http://192.168.2.248:12306';
app.baseApi = 'http://api.fczx.com';
app.apiUrl = (uri: string) => {
    return apiDomain + uri
}

app.areaApiUrl = (uri: string) => {
    return `${agreement}${getCityAlias()}.api${topDomain}${uri}`
}

app.testApiUrl = (uri: string) => {
    return testApiDomain + uri
}

app.request = (params: any, { loading = true, toast = true }: any = {}) => {

    return new Promise((resolve, reject) => {
        if (loading) {
            Taro.showLoading({
                title: '加载中......',
                mask: true
            })
        }
        Taro.request({
            url: params.url,
            data: params.data || {},
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

export default app;