import React, { ReactNode } from 'react'
import { View } from "@tarojs/components"

import './index.scss'
interface IProps {
    title?: string,
    message?: string,
    okText?: string,
    cancelText?: string,
    specialBtn?: ReactNode,
    onCancel?: () => void,
    onConfirm?: () => void
}

const Confirm = (props: IProps) => {
    const { title, message, specialBtn, okText = '是', cancelText = '否' } = props
    const renderOkBtn = () => {
        return specialBtn ? specialBtn :
            <View className="action-item" onClick={props.onConfirm}>{okText}</View>
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
                        <View className="action-item" onClick={props.onCancel}>{cancelText}</View>
                        {renderOkBtn()}
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Confirm