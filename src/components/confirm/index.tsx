import React, { ReactElement, useState } from 'react'
import { View } from "@tarojs/components"

import './index.scss'
import { useDidShow } from '@tarojs/taro'
interface IProps {
    title?: string,
    message?: string,
    okText?: string,
    cancelText?: string,
    SpecialBtn?: ReactElement,
    onCancel?: () => void,
    onConfirm?: () => void
}

const Confirm = (props: IProps) => {
    const { title, message, SpecialBtn, okText = '是', cancelText = '否' } = props
    const { onConfirm, onCancel } = props

    const renderOkBtn = () => {
        return SpecialBtn ? SpecialBtn :
            <View className="action-item" onClick={onConfirm}>{okText}</View>
    }

    return (
        <View className="confirm">
            <View className="confirm-wrap">
                <View className="mask show"></View>
                <View className="confirm-box">
                    <View className="confirm-content">
                        {title && <View className="title">{title}</View>}
                        {message && <View className="message">{message}</View>}
                    </View>
                    <View className="confirm-action">
                        <View className="action-item" onClick={onCancel}>{cancelText}</View>
                        {renderOkBtn()}
                    </View>
                </View>
            </View>
        </View>
    ) 
}

export default Confirm