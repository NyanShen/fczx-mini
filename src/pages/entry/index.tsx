import Taro, { getCurrentInstance, useReady } from "@tarojs/taro"


import { useCallback } from "react"

import api from '@services/api'
import app from '@services/request'
import { toUrlParam, transferUrlParam } from "@utils/urlHandler"

const Entry = () => {
    const router: any = getCurrentInstance().router
    const scene: any = router?.params.scene || ''
    const currentPath = `${router.path}?scene=${scene}`

    const urlMapper = {
        'chat': '/chat/room/index'
    }

    const fetChatData = useCallback((paramObj) => {
        app.request({
            url: app.apiUrl(api.getChatUser),
            method: 'POST',
            data: {
                id: paramObj.id
            }
        }, { loading: false }).then((result: any) => {
            const paramString = toUrlParam({
                fromUserId: paramObj.id,
                toUser: JSON.stringify(result)
            })
            Taro.redirectTo({
                url: `${urlMapper[paramObj.t]}${paramString}`
            })
        }).catch((err: any) => {
            if (err.status === 401) {
                Taro.redirectTo({
                    url: `/login/index?backUrl=${encodeURIComponent(currentPath)}`
                })
            } else {
                setTimeout(() => {
                    Taro.switchTab({
                        url: `/pages/index/index`
                    })
                }, 2000)
            }

        })
    }, [])

    useReady(() => {
        const parseScene: string = decodeURIComponent(scene)
        const paramObj: any = transferUrlParam(parseScene)
        if (paramObj.t === 'chat') {
            fetChatData(paramObj)
        }
    })

    return null
}

export default Entry