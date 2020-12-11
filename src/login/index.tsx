import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import ChatEvent from '@utils/event'
import { PROJECT_NAME } from '@constants/global'
import { fetchSessionKey, fetchDecryptData } from '@services/login'
import './index.scss'
import Confirm from '@components/confirm'

const Login = () => {
    const currentRouter: any = getCurrentInstance().router
    const isTab: string = currentRouter.params?.isTab || ''
    const backUrl: string = currentRouter.params?.backUrl || ''
    const [loginCode, setLoginCode] = useState<string>('')
    const [showConfirm, setShowConfirm] = useState<boolean>(false)

    const handleLogin = () => {
        fetchSessionKey().then((result: any) => {
            setLoginCode(result)
        })
    }

    const getPhoneNumber = (e) => {
        const errMsg = e.detail.errMsg
        if (errMsg === 'getPhoneNumber:ok') {
            fetchDecryptData({
                sessionKey: loginCode,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
            }).then((result: any) => {
                storage.setItem('token', result.token, 'login')
                if (result.is_need_sync) {
                    setShowConfirm(true)
                    return
                }
                handleRedirect()
                ChatEvent.emit('chat')
            })
        }
    }

    const handleRedirect = () => {
        if (backUrl && !isTab) {
            Taro.redirectTo({ url: decodeURIComponent(backUrl) })
        }
        else if (isTab) {
            Taro.switchTab({ url: decodeURIComponent(backUrl) })
        }
        else {
            Taro.navigateBack({
                delta: 1
            })
        }
    }

    const handleLoginByPhone = () => {
        Taro.navigateTo({
            url: `/login/phone/index?backUrl=${backUrl}&isTab=${isTab}`
        })
    }

    const getUserInfo = (e: any) => {
        if (e.detail.errMsg === 'getUserInfo:ok') {
            app.request({
                url: app.apiUrl(api.syncWxUser),
                method: 'POST',
                data: { ...e.detail.userInfo }
            }, { loading: false })
        }
        handleRedirect()
    }

    const handleCancel = () => {
        setShowConfirm(false)
        handleRedirect()
    }

    const renderUserInfo = () => {
        const userButton = (
            <Button
                className="action-item"
                open-type="getUserInfo"
                onGetUserInfo={getUserInfo}
                onClick={() => setShowConfirm(false)}
            >同步</Button>
        )
        return (
            <Confirm
                title='是否同步微信昵称，头像信息'
                SpecialBtn={userButton}
                cancelText='取消'
                onCancel={handleCancel}
            ></Confirm>
        )
    }

    return (
        <View className="login">
            <View className="login-header">
                <Text className="title">{PROJECT_NAME}</Text>
                <Text className="small">Fczx.com</Text>
            </View>
            <View className="login-content">
                <View className="login-memo">
                    <View className="cut-line"></View>
                    <Text className="desc">推荐使用登录方式</Text>
                </View>
                <Button className="btn btn-primary" openType="getPhoneNumber" onGetPhoneNumber={getPhoneNumber} onClick={handleLogin}>
                    <Text>微信登录</Text>
                </Button>
                <View className="btn btn-plain" onClick={handleLoginByPhone}>
                    <Text>账号登录</Text>
                </View>
            </View>
            {showConfirm && renderUserInfo()}
        </View>
    )
}

export default Login
