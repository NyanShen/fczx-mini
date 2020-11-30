import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { toUrlParam } from '@utils/urlHandler'
import { formatPhoneCall } from '@utils/index'
import './index.scss'

const HouseConsultant = () => {
    const router = getCurrentInstance().router
    const houseId: any = router?.params.id
    const messageType: any = router?.params.messageType
    const houseData: any = router?.params.houseMain
    const [consultants, setConsultants] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getHouseConsultantList),
            data: {
                fang_house_id: houseId
            }
        }).then((result: any) => {
            setConsultants(result)
        })
    }, [])

    const handleCopyWechat = (text: string) => {
        Taro.setClipboardData({ data: text })
    }

    const handlePhoneCall = (mobile: string) => {
        Taro.makePhoneCall({
            phoneNumber: formatPhoneCall(mobile),
            fail: (err: any) => {
                if (err.errMsg == 'makePhoneCall:fail') {
                    Taro.showModal({
                        title: '联系电话',
                        content: mobile,
                        showCancel: false
                    })
                }
            }
        })
    }

    const toChatRoom = (item: any) => {
        const paramString = toUrlParam({
            messageType,
            fromUserId: item.user_id,
            toUser: JSON.stringify(item.user),
            content: houseData
        })
        Taro.navigateTo({
            url: `/chat/room/index${paramString}`
        })
    }
    return (
        <View className="house-consultant">
            <View className="house-consultant-content">
                {
                    consultants.map((item: any, index: number) => (
                        <View key={index} className="consultant-item">
                            <View className="item-image">
                                <Image src={item.user.avatar}></Image>
                            </View>
                            <View className="item-text">
                                <View className="name">{item.user.nickname}</View>
                                <View className="wechat" onClick={() => handleCopyWechat(item.wx)}>
                                    <Text> 微信：{item.wx}</Text>
                                    <Text className="iconfont iconcopy"></Text>
                                </View>
                            </View>
                            <View className="item-action" onClick={() => toChatRoom(item)}>
                                <Text className="iconfont iconmessage"></Text>
                            </View>
                            <View className="item-action" onClick={() => handlePhoneCall(item.user.mobile)}>
                                <Text className="iconfont iconcall"></Text>
                            </View>
                        </View>
                    ))
                }
            </View>
        </View>
    )
}

export default HouseConsultant