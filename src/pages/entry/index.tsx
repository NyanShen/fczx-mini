import Taro, { getCurrentInstance, useReady } from "@tarojs/taro"

import api from '@services/api'
import app from '@services/request'
import { toUrlParam, transferUrlParam } from "@utils/urlHandler"

const Entry = () => {
    const router = getCurrentInstance().router
    const params = router?.params.scene || ''

    const urlMapper = {
        'chat': '/chat/room/index'
    }

    useReady(() => {
        const scene: string = decodeURIComponent(params)
        const paramObj: any = transferUrlParam(scene)
        if (paramObj.t === 'chat') {
            app.request({
                url: app.apiUrl(api.getChatUser),
                method: 'POST',
                data: {
                    id: paramObj.id
                }
            }, { loading: false }).then((result: any) => {
                const paramString = toUrlParam({
                    entry: true,
                    fromUserId: paramObj.id,
                    toUser: JSON.stringify(result)
                })
                Taro.redirectTo({
                    url: `${urlMapper[paramObj.t]}${paramString}`
                })
            }).catch(() => {
                setTimeout(() => {
                    Taro.switchTab({
                        url: `/pages/index/index`
                    })
                }, 2000)
            })
        }
    })

    return null
}

export default Entry