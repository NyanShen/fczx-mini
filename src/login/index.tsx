import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import storage from '@utils/storage'
import { fetchSessionKey, fetchDecryptData } from '@services/login'
import NavBar from '@components/navbar/index'
import './index.scss'

const Login = () => {
    const navData = {
        title: '',
        back: true,
        color: '#000000',
        backgroundColor: '#ffffff'
    }
    const currentRouter: any = getCurrentInstance().router
    const backUrl: any = currentRouter.params?.backUrl

    const [loginCode, setLoginCode] = useState<string>('')

    Taro.setNavigationBarColor({
        frontColor: navData.color,
        backgroundColor: navData.backgroundColor
    })

    const handleLogin = () => {
        fetchSessionKey().then((result: any) => {
            setLoginCode(result)
        })
    }

    const getUserInfo = (e) => {
        const errMsg = e.detail.errMsg
        if (errMsg === 'getPhoneNumber:ok') {
            fetchDecryptData({
                sessionKey: loginCode,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
            }).then((result: any) => {
                console.log(result)
                const user = {
                    nickName: result.nickName,
                    avatarUrl: result.avatarUrl,
                }
                storage.setItem('user', user, 'login')
                if (backUrl) {
                    Taro.redirectTo({ url: backUrl })
                } else {
                    Taro.navigateBack({
                        delta: 1
                    })
                }
            })
        }

    }

    const handleLoginByPhone = () => {
        Taro.navigateTo({
            url: `/login/phone/index?backUrl=${backUrl}`
        })
    }

    return (
        <View className="login">
            <NavBar {...navData} />
            <View className="login-header">
                <Text className="title">房产在线</Text>
                <Text className="small">Fczx.com</Text>
            </View>
            <View className="login-content">
                <View className="login-memo">
                    <View className="cut-line"></View>
                    <Text className="desc">推荐使用登录方式</Text>
                </View>
                <Button className="btn btn-primary" openType="getPhoneNumber" onGetPhoneNumber={getUserInfo} onClick={handleLogin}>
                    <Text>微信登录</Text>
                </Button>
                <View className="btn btn-plain" onClick={handleLoginByPhone}>
                    <Text>手机快捷登录</Text>
                </View>
            </View>
        </View>
    )
}

export default Login
