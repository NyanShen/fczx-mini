import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Input } from "@tarojs/components"

import './index.scss'

const Consultant = () => {
    const params: any = getCurrentInstance().router?.params
    const [inputValue, setInputValue] = useState<any>({ nickname: params.nickname })

    const handleInputChange = (e: any, name: string) => {
        setInputValue({
            ...inputValue,
            [name]: e.detail.value
        })
    }

    const toHouseConsultant = () => {
        Taro.navigateTo({
            url: `/house/new/consultant/register?consultantId=${''}`
        })
    }

    return (
        <View className="profile">
            <View className="profile-info">
                <View className="profile-item">
                    <View className="item-label">账号</View>
                    <View className="item-input">
                        <Text className="input-text">{params.username}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="profile-item">
                    <View className="item-label">手机号码</View>
                    <View className="item-input">
                        <Text className="input-text">{params.mobile}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="profile-item">
                    <View className="item-label">昵称</View>
                    <View className="item-input">
                        <Input
                            placeholder="请输入"
                            value={inputValue.nickname}
                            onInput={(e: any) => handleInputChange(e, 'nickname')}
                            maxlength={20}
                        />
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="profile-submit">
                    <View className="btn btn-primary" onClick={toHouseConsultant}>修改</View>
                </View>
            </View>
        </View>
    )
}

export default Consultant