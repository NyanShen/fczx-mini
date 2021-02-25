import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { hasLoginBack } from '@services/login'
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

    const toConsultantModule = () => {
        hasLoginBack().then(() => {
            app.request({
                url: app.areaApiUrl(api.getHouseConsultantData),
            }).then((result: any) => {
                let toUrl: string = ''
                const consultant = encodeURIComponent(JSON.stringify(result))
                switch (result.status) {
                    case '1': // 正常
                        const navTitle: string = '修改置业顾问信息'
                        const paramString: any = toUrlParam({ consultant, navTitle })
                        toUrl = `/consultant/register/index${paramString}`
                        break;
                    case '2': // 禁用
                    case '3': // 审核中
                        toUrl = `/consultant/checkStatus/index?status=${result.status}`
                        break;
                    case '4': // 审核不通过
                        toUrl = `/consultant/checkStatus/index${toUrlParam({ consultant, status: result.status })}`
                        break;
                    default:
                        toUrl = `/consultant/register/index`
                }
                Taro.navigateTo({
                    url: toUrl
                })
            })
        })
    }
    return (
        <View className="house-consultant-wrapper">
            <View className="house-consultant-content">
                {
                    consultants.map((item: any, index: number) => (
                        <View key={index} className="consultant-item">
                            <View className="item-image">
                                <Image className="taro-image" src={item.user.avatar}></Image>
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
            <View className="consultant-action" onClick={toConsultantModule}>
                <View className="btn btn-primary">立即入驻</View>
            </View>
        </View>
    )
}

export default HouseConsultant