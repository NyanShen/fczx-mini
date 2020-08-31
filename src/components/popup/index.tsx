import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'

interface IPopupProps {
    title: string
    subTitle?: string
    description?: string
    onConfirm: (IPopupState) => void,
    onCancel: () => void,
}

interface IPopupState {
    mobile: string
    randCode: string
}

const INIT_DATA: IPopupState = { mobile: '', randCode: '' }

const Popup = (props: IPopupProps) => {
    const [codeText, setCodeText] = useState<string>('获取验证码')
    const [formData, setFormData] = useState<IPopupState>(INIT_DATA)
    const { title, subTitle, description, onConfirm, onCancel } = props

    const handleConfirm = () => {
        if (!formData.mobile) {
            Taro.showToast({
                icon: 'none',
                title: '手机号码不能为空'
            })
            return
        }
        if (!formData.randCode) {
            Taro.showToast({
                icon: 'none',
                title: '手机验证码不能为空'
            })
            return
        }
        onConfirm(formData)
    }

    const handleInput = (event) => {
        let target = event.currentTarget;
        setFormData({
            ...formData,
            [target.id]: target.value
        })
    }

    const abtainCode = () => {
        let second = 60
        setCodeText(`${second}秒后重发`)
        let interval = setInterval(function () {
            second--
            setCodeText(`${second}秒后重发`)
            if (second <= 0) {
                setCodeText("重发验证码")
                clearInterval(interval)
            }
        }, 1000)
    }
    return (
        <View className="popup-wrap">
            <View className="popup-mask popup-show"></View>
            <View className="popup-box">
                <View className="popup-cont">
                    <View className="popup-header">
                        <View className="popup-title">{title}</View>
                        <View className="popup-sub-title">{subTitle}</View>
                        <Text className="popup-close iconfont iconclose" onClick={onCancel}></Text>
                    </View>
                    <View className="popup-desc">
                        <Text>{description}</Text>
                    </View>
                    <View className="popup-form">
                        <View className="form-item">
                            <Input className="form-item-input" type="number" placeholder="请输入手机号码" id="mobile" onInput={handleInput} />
                        </View>
                        <View className="form-item">
                            <Input className="form-item-input code-input" type="number" placeholder="请输入验证码" id="randCode" onInput={handleInput} />
                            <View className="verfiy" onClick={abtainCode}>
                                <Text className="code">{codeText}</Text>
                            </View>
                        </View>
                        <View className="form-item form-btn" onClick={handleConfirm}>
                            <Text>确定</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Popup