import React, { useState } from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import storage from '@utils/storage'
import ChatEvent from '@utils/event'
import Confirm from '@components/confirm'
import { PROJECT_NAME } from '@constants/global'
import { fetchSessionKey, fetchDecryptData } from '@services/login'
import './index.scss'

const Login = () => {
    const currentRouter: any = getCurrentInstance().router
    const isTab: string = currentRouter.params?.isTab || ''
    const backUrl: string = currentRouter.params?.backUrl || ''
    const [loginCode, setLoginCode] = useState<string>('')
    const [showConfirm, setShowConfirm] = useState<boolean>(false)

    useReady(() => {
        fetchSessionKey().then((result: any) => {
            setLoginCode(result)
        })
    })

    const handleAuthorizeLogin = (loginData: any) => {
        fetchDecryptData({
            sessionKey: loginCode,
            encryptedData: loginData.encryptedData,
            iv: loginData.iv
        }).then((result: any) => {
            if (result.token) {
                storage.setItem('token', result.token, 'login')
                ChatEvent.emit('chat')
                handleRedirect()
            } else {
                setShowConfirm(true)
            }
        })
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

    const handelGetUserInfo = (e) => {
        const errMsg = e.detail.errMsg
        if (errMsg === 'getUserInfo:ok') {
            // fetchSessionKey().then((result: any) => {
            //     setLoginCode(result)
            handleAuthorizeLogin(e.detail)
            // })
        }
    }

    const handleGetPhoneNumber = (e: any) => {
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            handleAuthorizeLogin(e.detail)
        }
    }

    const renderUserInfo = () => {
        const userButton = (
            <Button
                className="action-item"
                open-type="getPhoneNumber"
                onGetPhoneNumber={handleGetPhoneNumber}
                onClick={() => setShowConfirm(false)}
            >登录并绑定</Button>
        )
        return (
            <Confirm
                title='绑定微信关联手机号完成登录'
                SpecialBtn={userButton}
                showCancel={false}
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
                <Button className="btn btn-primary" openType="getUserInfo" onGetUserInfo={handelGetUserInfo}>
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
