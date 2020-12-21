import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Button, Image } from '@tarojs/components'

import storage from '@utils/storage'
import CustomSocket from '@utils/socket'
import logo from '@assets/icons/logo.png'
import { PROJECT_NAME } from '@constants/global'
import { fetchSessionKey, fetchDecryptData } from '@services/login'
import './index.scss'

const Login = () => {
    const currentRouter: any = getCurrentInstance().router
    const isTab: string = currentRouter.params?.isTab || ''
    const backUrl: string = currentRouter.params?.backUrl || ''
    const INIT_CODE = storage.getItem('session_key')
    const [valid, setValid] = useState<Boolean>(false)
    const [loginCode, setLoginCode] = useState<string>(INIT_CODE)
    const [showConfirm, setShowConfirm] = useState<boolean>(false)

    useEffect(() => {
        Taro.checkSession({
            success: () => {
                if (loginCode) {
                    setValid(true)
                } else {
                    setSessionKey()
                }
            },
            fail: () => {
                setSessionKey()
            }
        })
    }, [])

    const setSessionKey = () => {
        fetchSessionKey().then((result: any) => {
            setLoginCode(result)
            setValid(true)
        })
    }

    const handleAuthorizeLogin = (loginData: any) => {
        fetchDecryptData({
            sessionKey: loginCode,
            encryptedData: loginData.encryptedData,
            iv: loginData.iv
        }).then((result: any) => {
            if (result.token) {
                storage.setItem('token', result.token)
                CustomSocket.connectSocket()
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
            handleAuthorizeLogin(e.detail)
        }
    }

    const handleGetPhoneNumber = (e: any) => {
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            handleAuthorizeLogin(e.detail)
        }
    }

    const renderUserInfo = () => {
        return (
            <View className="login-accredit">
                <View className="acrredit-content">
                    <View className="logo">
                        <Image src={logo} mode="aspectFill"></Image>
                    </View>
                    <View className="context">
                        <View className="title">授权微信手机号</View>
                        <View className="desc">更方便为您提供服务</View>
                    </View>
                    <Button
                        className="btn btn-primary"
                        open-type="getPhoneNumber"
                        onGetPhoneNumber={handleGetPhoneNumber}
                    >立即授权</Button>
                </View>
            </View>
        )
    }

    return valid &&
        (
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
