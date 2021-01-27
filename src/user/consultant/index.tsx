import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from "@tarojs/components"

import api from '@services/api'
import app from '@services/request'
import { toUrlParam } from '@utils/urlHandler'
import './index.scss'

const serviceTypes = {
    '1': '全天接听',
    '2': '晚10点到早8点拒接',
    '3': '全天拒接'
}

// const checkStatus = {
//     '1': '审核通过',
//     '2': '账号已被禁用',
//     '3': '正在审核中',
//     '4': '审核不通过'
// }

const HouseConsultant = () => {
    const [consultant, setConsultant] = useState<any>({ user: {}, fangHouse: {} })

    useEffect(() => {
        fetchConsultant()
    }, [])

    const fetchConsultant = () => {
        app.request({
            url: app.testApiUrl(api.getHouseConsultantData),
        }).then((result: any) => {
            setConsultant(result)
        })
    }

    const toConsultantForm = () => {
        const consultant_encode = encodeURIComponent(JSON.stringify(consultant))
        if (consultant.status == '1') {
            const navTitle: string = '修改置业顾问信息'
            const paramString: any = toUrlParam({ consultant: consultant_encode, navTitle })
            Taro.navigateTo({
                url: `/consultant/register/index${paramString}`
            })
        } else {
            const paramString: any = toUrlParam({ consultant: consultant_encode, apply: true })
            Taro.navigateTo({
                url: `/consultant/register/index${paramString}`
            })
        }
    }

    return (
        <View className="consultant">
            <View className="consultant-content">
                <View className="consultant-header">
                    基本信息
                </View>
                <View className="consultant-item">
                    <View className="item-label">姓名</View>
                    <View className="item-input">
                        <Text className="input-text">{consultant.user.nickname}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">微信号</View>
                    <View className="item-input">
                        <Text className="input-text">{consultant.user.wx || '暂无信息'}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                {/* <View className="consultant-item">
                    <View className="item-label">个人简介</View>
                    <View className="item-input">
                        <Text className="input-text">{params.introduce || '暂无信息'}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View> */}
                <View className="consultant-item">
                    <View className="item-label">关联楼盘</View>
                    <View className="item-input">
                        <Text className="input-text">{consultant.fangHouse.title}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">服务时间</View>
                    <View className="item-input">
                        <Text className="input-text">{serviceTypes[consultant.service_type]}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">手机号码</View>
                    <View className="item-input">
                        <Text className="input-text">{consultant.user.mobile}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                {/* <View className="consultant-item">
                    <View className="item-label">邀请码</View>
                    <View className="item-input">
                        <Text className="input-text">{params.inviteCode || '暂无信息'}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View> */}
                <View className="consultant-header">
                    图片信息
                </View>
                <View className="consultant-item">
                    <View className="item-image">
                        <Image src={consultant.user.avatar} mode="aspectFill" />
                        <View className="image-label">头像</View>
                    </View>
                    <View className="item-image">
                        <Image src={consultant.wx_qrcode_path} mode="aspectFill" />
                        <View className="image-label">微信二维码</View>
                    </View>
                    <View className="item-image">
                        <Image src={consultant.work_photo_path} mode="aspectFill" />
                        <View className="image-label">工作证(名片)</View>
                    </View>
                </View>
                <View className="consultant-action">
                    {consultant.status == '1' && <View className="btn btn-primary" onClick={toConsultantForm}>修改</View>}
                    {consultant.status == '4' && <View className="btn btn-primary" onClick={toConsultantForm}>重新申请</View>}
                </View>
            </View>
        </View>
    )
}

export default HouseConsultant