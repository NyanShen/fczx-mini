import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar/index'
import { PHONE_PATTERN } from '@constants/pattern'
import './index.scss'
import storage from '@utils/storage'

interface ILoginPhone {
    mobile: string
    verifyCode: string
}

interface IVerifyStatus {
    verifyText: string
    actived: boolean
}

const INIT_LOGIN_PHONE: ILoginPhone = {
    mobile: '',
    verifyCode: '',
}

const INIT_VERIFY_STATUS: IVerifyStatus = {
    verifyText: '获取验证码',
    actived: false
}

const LoginPhone = () => {
    const authorizationCode = app.randCode(16);
    const [loginPhone, setLoginPhone] = useState<ILoginPhone>(INIT_LOGIN_PHONE)
    const [verifyStatus, setVerifyStatus] = useState<IVerifyStatus>(INIT_VERIFY_STATUS)
    const phoneRegExp = new RegExp(PHONE_PATTERN)

    const navData = {
        title: '登录',
        back: true
    }

    const handleInput = (e: any, name: string) => {
        const value = e.detail.value;
        setLoginPhone({
            ...loginPhone,
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
            url: app.apiUrl(api.getUserVerifyCode),
            data: {
                mobile: loginPhone.mobile
            }
        }).then(() => {
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
        if (phoneRegExp.test(loginPhone.mobile) && loginPhone.verifyCode) {
            app.request({
                method: 'POST',
                url: app.apiUrl(api.loginByVerifyCode),
                data: {
                    mobile: loginPhone.mobile,
                    randCode: loginPhone.verifyCode,
                    requestId: authorizationCode
                }
            }).then((result: any) => {
                storage.setItem('token', result, 'login')
                Taro.switchTab({
                    url: '/pages/user/index'
                })
            })
        }
    }

    return (
        <View className="login-phone">
            <NavBar {...navData} />
            <View className="login-phone-header">
                <Text className="title">手机号登录</Text>
            </View>
            <View className="login-phone-form">
                <View className="form-item">
                    <Text className="label-control">手机号</Text>
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
                    <Text className="label-control">验证码</Text>
                    <Input
                        type="number"
                        className="input-control"
                        placeholder="请输入手机验证码"
                        maxlength={6}
                        onInput={(e) => handleInput(e, 'verifyCode')}
                    />
                    <Text
                        onClick={handleCodeBtnClick}
                        className={classnames('btn-code', verifyStatus.actived && 'actived')}
                    >{verifyStatus.verifyText}
                    </Text>
                </View>
                <View onClick={handleSubmit} className="btn btn-primary">登录</View>
            </View>
        </View>
    )
}

export default LoginPhone
