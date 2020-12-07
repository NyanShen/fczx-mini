import React, { useCallback, useState } from "react"
import Taro, { getCurrentInstance, useReady } from "@tarojs/taro"
import { Button, View } from "@tarojs/components"

import api from '@services/api'
import app from '@services/request'
import Confirm from "@components/confirm"
import { toUrlParam, transferUrlParam } from "@utils/urlHandler"

const Entry = () => {
    const router: any = getCurrentInstance().router
    const scene: any = router?.params.scene || ''
    const [pageParam, setPageParam] = useState<any>()
    const currentPath = `${router.path}?scene=${scene}`

    const urlMapper = {
        'chat': '/chat/room/index',
        'house': '/house/new/index/index',
        'esf': '/house/esf/index/index',
        'rent': '/house/rent/index/index',
        'news': '/news/detail/index',
    }

    const toPageIndex = useCallback(() => {
        Taro.switchTab({
            url: `/pages/index/index`
        })
    }, [])

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
                    toPageIndex()
                }, 2000)
            }
        })
    }, [])

    useReady(() => {
        const parseScene: string = decodeURIComponent(scene)
        const paramObj: any = transferUrlParam(parseScene)
        switch (paramObj.t) {
            case 'chat':
                fetChatData(paramObj)
                break
            case 'service':
                const serviceBtn = <Button className="action-item" openType="contact" onClick={toPageIndex}>允许</Button>
                const pageModule = (
                    <Confirm
                        title='即将进入“小程序在线客服”'
                        specialBtn={serviceBtn}
                        onCancel={toPageIndex}
                        cancelText='取消'
                    ></Confirm>
                )
                setPageParam(pageModule)
                break
            case 'house':
            case 'esf':
            case 'rent':
                const paramString = toUrlParam({
                    id: paramObj.id,
                    c: paramObj.c || ''
                })
                Taro.redirectTo({
                    url: `${urlMapper[paramObj.t]}${paramString}`
                })
                break
            case 'news':
                console.log('news', `${urlMapper[paramObj.t]}&id=${paramObj.id}`)
                Taro.redirectTo({
                    url: `${urlMapper[paramObj.t]}?id=${paramObj.id}`
                })
                break
            default:
                toPageIndex()
        }
    })

    return (
        <View className="entry">
            {pageParam}
        </View>
    )
}

export default Entry