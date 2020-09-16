import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import NavBar from '@components/navbar/index'
import './login.scss'

const Login = () => {
    const navData = {
        title: '登录',
        back: true,
        color: '#000000',
        backgroundColor: '#ffffff'
    }

    Taro.setNavigationBarColor({
        frontColor: navData.color,
        backgroundColor: navData.backgroundColor
    })

    const onLoginByWeapp = () => {
        Taro.login({
            success: function (res: any) {
                console.log(res)
            }
        })
    }

    const getPhoneNumber = (e) => {

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
                <Button openType="getPhoneNumber" className="btn btn-primary">
                    <Text>微信登录</Text>
                </Button>
                <View className="btn btn-plain">
                    <Text>手机快捷登录</Text>
                </View>
            </View>
        </View>
    )
}

export default Login
