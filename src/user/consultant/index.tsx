import React from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image } from "@tarojs/components"

import './index.scss'

const HouseConsultant = () => {
    const params: any = getCurrentInstance().router?.params

    const toConsultantForm = () => {
        Taro.navigateTo({
            url: `/house/new/consultant/register/index?consultantId=${''}`
        })
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
                        <Text className="input-text">{params.nickname}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">微信号</View>
                    <View className="item-input">
                        <Text className="input-text">{params.wx || '暂无信息'}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">个人简介</View>
                    <View className="item-input">
                        <Text className="input-text">{params.introduce || '暂无信息'}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">楼盘信息</View>
                    <View className="item-input">
                        <Text className="input-text">{params.houseTitle}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">服务时间</View>
                    <View className="item-input">
                        <Text className="input-text">{params.serviceTime}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">手机号码</View>
                    <View className="item-input">
                        <Text className="input-text">{params.mobile}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-item">
                    <View className="item-label">邀请码</View>
                    <View className="item-input">
                        <Text className="input-text">{params.inviteCode || '暂无信息'}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="consultant-header">
                    图片信息
                </View>
                <View className="consultant-item">
                    <View className="item-image">
                        <Image src="" mode="aspectFill" />
                        <View className="image-label">头像</View>
                    </View>
                    <View className="item-image">
                        <Image src="" mode="aspectFill" />
                        <View className="image-label">微信二维码</View>
                    </View>
                    <View className="item-image">
                        <Image src="" mode="aspectFill" />
                        <View className="image-label">工作证(名片)</View>
                    </View>
                </View>
                <View className="consultant-action">
                    <View className="btn btn-primary" onClick={toConsultantForm}>修改</View>
                </View>
            </View>
        </View>
    )
}

export default HouseConsultant