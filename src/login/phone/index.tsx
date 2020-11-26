import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import NavBar from '@components/navbar/index'
import { PHONE_PATTERN } from '@constants/pattern'
import './index.scss'

interface ILoginData {
    mobile?: string
    account?: string
    verifyCode?: string
    password?: string
}

interface IVerifyStatus {
    verifyText: string
    actived: boolean
}

const INIT_LOGIN_PHONE: ILoginData = {
    mobile: '',
    account: '',
    verifyCode: '',
    password: ''
}

const INIT_VERIFY_STATUS: IVerifyStatus = {
    verifyText: '获取验证码',
    actived: false
}
const loginTabs = [{
    type: 'pass',
    name: '账号密码登录',
    login_url: api.loginByPassword
}, {
    type: 'code',
    name: '验证码登录',
    login_url: api.loginByVerifyCode
}]

const LoginPhone = () => {
    const params: any = getCurrentInstance().router?.params
    const isTab: string = params?.isTab
    const backUrl: string = params?.backUrl
    const authorizationCode = app.randCode(16);
    const [tab, setTab] = useState(loginTabs[0])
    const [loginData, setLoginData] = useState<ILoginData>(INIT_LOGIN_PHONE)
    const [verifyStatus, setVerifyStatus] = useState<IVerifyStatus>(INIT_VERIFY_STATUS)
    const phoneRegExp = new RegExp(PHONE_PATTERN)

    const navData = {
        title: '登录',
        back: true
    }

    const handleInput = (e: any, name: string) => {
        const value = e.detail.value;
        setLoginData({
            ...loginData,
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
                mobile: loginData.mobile
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

    const validateData = () => {
        if (tab.type === 'code') {
            return {
                mobile: loginData.mobile,
                randCode: loginData.verifyCode,
                requestId: authorizationCode
            }
        }
        if (tab.type === 'pass') {
            return {
                account: loginData.account,
                password: loginData.password,
            }
        }
    }

    const handleSubmit = () => {
        let postData = validateData()
        app.request({
            method: 'POST',
            url: app.apiUrl(tab.login_url),
            data: postData
        }).then((result: any) => {
            storage.setItem('token', result, 'login')
            if (backUrl && !isTab) {
                Taro.redirectTo({ url: decodeURIComponent(backUrl) })
            }
            else if (isTab) {
                Taro.switchTab({ url: decodeURIComponent(backUrl) })
            }
            else {
                Taro.switchTab({
                    url: '/pages/user/index'
                })
            }
        })
    }

    return (
        <View className="login-phone">
            <NavBar {...navData} />
            <View className="login-phone-header">
                {
                    loginTabs.map((item: any, index: number) => (
                        <View
                            key={index}
                            className={classnames(item.type === tab.type && 'actived')}
                            onClick={() => setTab(item)}
                        >
                            <Text>{item.name}</Text>
                        </View>
                    ))
                }
            </View>
            <View className="login-phone-form">
                {
                    tab.type === 'code' &&
                    <View className="sub-form">
                        <View className="form-item">
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
                    </View>

                }
                {
                    tab.type === 'pass' &&
                    <View className="sub-form">
                        <View className="form-item">
                            <Input
                                type="text"
                                className="input-control"
                                placeholder="请输入登录账号"
                                maxlength={11}
                                onInput={(e) => handleInput(e, 'account')}
                                autoFocus
                            />
                        </View>
                        <View className="form-item">
                            <Input
                                password
                                className="input-control"
                                placeholder="请输入密码"
                                onInput={(e) => handleInput(e, 'password')}
                            />
                        </View>
                    </View>
                }
                <View onClick={handleSubmit} className="btn btn-primary">立即登录</View>
            </View>
        </View>
    )
}

export default LoginPhone
