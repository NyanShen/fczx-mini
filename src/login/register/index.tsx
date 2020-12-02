import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import { PHONE_PATTERN } from '@constants/pattern'
import './index.scss'

interface IVerifyStatus {
    verifyText: string
    actived: boolean
}

const INIT_VERIFY_STATUS: IVerifyStatus = {
    verifyText: '获取验证码',
    actived: false
}

const Register = () => {
    const [registerData, setRegisterData] = useState<any>({})
    const [verifyStatus, setVerifyStatus] = useState<IVerifyStatus>(INIT_VERIFY_STATUS)
    const phoneRegExp = new RegExp(PHONE_PATTERN)

    const handleInput = (e: any, name: string) => {
        const value = e.detail.value;
        setRegisterData({
            ...registerData,
            [name]: value
        })
        if (name === 'mobile') {
            setVerifyStatus({
                ...verifyStatus,
                actived: phoneRegExp.test(value)
            })
        }
    }

    const handleCodeBtnClick = () => {
        if (!verifyStatus.actived) {
            return
        }
        app.request({
            url: app.apiUrl(api.getRegisterCode),
            data: {
                mobile: registerData.mobile
            }
        }).then((result: any) => {
            if (!result.data) {
                Taro.showModal({
                    title: '提示',
                    content: '您输入的手机号已注册，请直接登录',
                    showCancel: false
                })
                return
            }
            let second = 60
            setVerifyStatus({
                actived: false,
                verifyText: `${second}秒后重新获取`
            })
            let interval = setInterval(function () {
                second--;
                setVerifyStatus({
                    actived: false,
                    verifyText: `${second}秒后重新获取`
                })
                if (second <= 0) {
                    setVerifyStatus({
                        actived: true,
                        verifyText: `重新获取`
                    })
                    clearInterval(interval);
                }
            }, 1000)
        })
    }

    const handleSubmit = () => {
        app.request({
            method: 'POST',
            url: app.apiUrl(api.registerAccount),
            data: {
                mobile: registerData.mobile,
                source: '1',
                password: registerData.password,
                randCode: registerData.randCode
            }
        }).then(() => {
            Taro.switchTab({
                url: '/pages/index/index'
            })
        })
    }

    const toLogin = () => {
        Taro.redirectTo({
            url: '/login/index'
        })
    }


    return (
        <View className="register">
            <View className="register-header">
                <Text>注册账号</Text>
            </View>
            <View className="register-form">
                <View className="form-item">
                    <View className="label-control">手机号</View>
                    <Input
                        type="number"
                        className="input-control"
                        placeholder="请输入手机号"
                        maxlength={11}
                        onInput={(e) => handleInput(e, 'mobile')}
                        autoFocus
                    />
                </View>
                <View className="form-item">
                    <View className="label-control">验证码</View>
                    <Input
                        type="number"
                        className="input-control"
                        placeholder="请输入手机验证码"
                        maxlength={6}
                        onInput={(e) => handleInput(e, 'randCode')}
                    />
                    <Text
                        onClick={handleCodeBtnClick}
                        className={classnames('btn-code', verifyStatus.actived && 'actived')}
                    >{verifyStatus.verifyText}
                    </Text>
                </View>
                <View className="form-item">
                    <View className="label-control">密码</View>
                    <Input
                        password
                        className="input-control"
                        placeholder="请输入密码"
                        onInput={(e) => handleInput(e, 'password')}
                    />
                </View>
                <View className="link" onClick={toLogin}>
                    <Text className="link-text">已有账号？</Text><Text className="link-btn">去登录</Text>
                </View>
                <View onClick={handleSubmit} className="btn btn-primary">立即注册</View>

            </View>

        </View>
    )
}
export default Register