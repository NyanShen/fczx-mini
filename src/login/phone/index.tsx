import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import CustomSocket from '@utils/socket'
import NavBar from '@/components/navbar'
import { hasLogin } from '@services/login'
import { PHONE_PATTERN } from '@constants/pattern'
import './index.scss'

interface ILoginData {
    mobile?: string
    account?: string
    verifyCode?: string
    password?: string
}

const INIT_LOGIN_PHONE: ILoginData = {
    mobile: '',
    account: '',
    verifyCode: '',
    password: ''
}

interface IVerifyStatus {
    verifyText: string
    actived: boolean
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

const DISABLED_CLASS = 'btn-disabled'
const ACTIVED_CLASS = 'btn-primary'

const LoginPhone = () => {
    const params: any = getCurrentInstance().router?.params
    const isTab: string = params?.isTab
    const backUrl: string = params?.backUrl
    const authorizationCode = app.randCode(16);
    const [tab, setTab] = useState(loginTabs[0])
    const [submitClass, setSubmitClass] = useState<string>(DISABLED_CLASS)
    const [loginData, setLoginData] = useState<ILoginData>(INIT_LOGIN_PHONE)
    const [verifyStatus, setVerifyStatus] = useState<IVerifyStatus>(INIT_VERIFY_STATUS)
    const phoneRegExp = new RegExp(PHONE_PATTERN)

    useEffect(() => {
        if (tab.type === 'code') {
            if (loginData.mobile && loginData.verifyCode) {
                setSubmitClass(ACTIVED_CLASS)
            } else {
                setSubmitClass(DISABLED_CLASS)
            }
        }
        if (tab.type === 'pass') {
            if (loginData.account && loginData.password) {
                setSubmitClass(ACTIVED_CLASS)
            } else {
                setSubmitClass(DISABLED_CLASS)
            }
        }
    }, [loginData, tab])

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
            if (loginData.mobile && loginData.verifyCode) {
                return {
                    mobile: loginData.mobile,
                    randCode: loginData.verifyCode,
                    requestId: authorizationCode
                }
            } else {
                return null
            }
        }
        if (tab.type === 'pass') {
            if (loginData.account && loginData.password) {
                return {
                    account: loginData.account,
                    password: loginData.password,
                }
            } else {
                return null
            }
        }
    }

    const handleSubmit = () => {
        let postData = validateData()
        if (postData) {
            app.request({
                method: 'POST',
                url: app.apiUrl(tab.login_url),
                data: postData
            }).then((result: any) => {
                storage.setItem('token', result)
                CustomSocket.connectSocket()
                syncLoginData()
                handleRedirect()
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
            Taro.switchTab({
                url: '/pages/user/index'
            })
        }
    }

    const syncLoginData = () => {
        hasLogin().then((user: any) => {
            if (user) {
                storage.setItem('login_user', {
                    id: user.id,
                    avatar: user.avatar,
                    mobile: user.mobile,
                    nickname: user.nickname
                })
                CustomSocket.syncChatUnreadInLogout(user.id)
            }
        })
    }

    const toRegister = () => {
        Taro.navigateTo({
            url: '/login/register/index'
        })
    }

    return (
        <View className="login-phone">
            <NavBar title="登录" />
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
                                value={loginData.mobile}
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
                                value={loginData.verifyCode}
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
                                value={loginData.account}
                                onInput={(e) => handleInput(e, 'account')}
                                autoFocus
                            />
                        </View>
                        <View className="form-item">
                            <Input
                                password
                                className="input-control"
                                placeholder="请输入密码"
                                value={loginData.password}
                                onInput={(e) => handleInput(e, 'password')}
                            />
                        </View>
                    </View>
                }
                <View className="register" onClick={toRegister}>
                    <View className="register-text">
                        立即注册
                    </View>
                </View>
                <View onClick={handleSubmit} className={classnames('btn', submitClass)}>立即登录</View>
            </View>

        </View>
    )
}

export default LoginPhone
