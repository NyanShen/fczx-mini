import React from 'react'
import { View, Text, Input } from '@tarojs/components'

interface IPopupProps {
    title: string
    subTitle?: string
    description?: string
}

const Popup = (props: IPopupProps) => {
    const { title, subTitle, description } = props
    return (
        <View className="popup-wrap">
            <View className="popup-mask popup-show"></View>
            <View className="popup-box">
                <View className="popup-cont">
                    <View className="popup-header">
                        <View className="popup-title">{title}</View>
                        <View className="popup-sub-title">{subTitle}</View>
                        <Text className="popup-close iconfont iconclose"></Text>
                    </View>
                    <View className="popup-desc">
                        <Text>{description}</Text>
                    </View>
                    <View className="popup-form">
                        <View className="form-item">
                            <Input className="form-item-input" type="number" placeholder="请输入手机号码" />
                        </View>
                        <View className="form-item">
                            <Input className="form-item-input code-input" type="number" placeholder="请输入验证码" />
                            <View className="verfiy">
                                <Text className="code">获取验证码</Text>
                            </View>
                        </View>
                        <View className="form-item form-btn">
                            <Text>确定</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Popup