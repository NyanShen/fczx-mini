import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import { hasLogin } from '@services/login'
import { PHONE_PATTERN } from '@constants/pattern'
import './index.scss'

interface ICustom {
    id?: string,
    mobile: string
    realname: string
    randCode: string
}

interface IPopupProps {
    type?: string
    houseId: string
    btnText: string
    iconClass?: string
    title?: string
    subTitle?: string
    description?: string
    onConfirm?: () => void,
    onCancel?: () => void,
}

const INIT_CUSTOM = { mobile: '', realname: '', randCode: '123456' }

interface IVerifyStatus {
    verifyText: string
    actived: boolean
}

const INIT_VERIFY_STATUS: IVerifyStatus = {
    verifyText: '获取验证码',
    actived: false
}
const Popup = (props: IPopupProps) => {
    const phoneRegExp = new RegExp(PHONE_PATTERN)
    const [popup, setPopup] = useState<boolean>(false)
    const [custom, setCustomData] = useState<ICustom>(INIT_CUSTOM)
    const [verifyStatus, setVerifyStatus] = useState<IVerifyStatus>(INIT_VERIFY_STATUS)
    const { title, subTitle, description, btnText, iconClass, onConfirm } = props

    const handleBtnClick = () => {
        hasLogin().then((result: any) => {
            if (result) {
                setCustomData({
                    ...custom,
                    id: result.id,
                    mobile: result.mobile,
                    realname: result.nickname || result.customname
                })
            }
            setPopup(true)
        })
    }

    const hidePopup = () => {
        setPopup(false)
        if (!custom.id) {
            setCustomData(INIT_CUSTOM)
            setVerifyStatus(INIT_VERIFY_STATUS)
        }
    }

    const handleInput = (e: any, name: string) => {
        const value = e.detail.value;
        setCustomData({
            ...custom,
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
            url: app.apiUrl(api.getCommonVerifyCode),
            data: {
                mobile: custom.mobile
            }
        }, { loading: false }).then(() => {
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

    const handleConfirm = () => {
        app.request({
            method: 'POST',
            url: app.areaApiUrl(api.postHouseCustomer),
            data: {
                real_name: custom.realname,
                mobile: custom.mobile,
                randCode: custom.randCode,
                type: props.type || '5',
                fang_house_id: props.houseId
            }
        }, { loading: false }).then(() => {
            hidePopup()
            Taro.showToast({
                title: '订阅成功',
                icon: 'none'
            })
            onConfirm && onConfirm()
        })
    }
    return (
        <View className="popup">
            <View className="popup-btn" onClick={handleBtnClick}>
                <Text className={classnames('iconfont', iconClass)}></Text>
                <Text className="popup-btn-text">{btnText}</Text>
            </View>
            {
                popup &&
                <View className="popup-wrap">
                    <View className="popup-mask popup-show"></View>
                    <View className="popup-box">
                        <View className="popup-cont">
                            <View className="popup-header">
                                <View className="popup-title">{title || btnText}</View>
                                <View className="popup-sub-title">{subTitle}</View>
                                <Text className="popup-close iconfont iconclose" onClick={hidePopup}></Text>
                            </View>
                            <View className="popup-desc">
                                <Text>{description}</Text>
                            </View>
                            <View className="popup-form">
                                <View className="form-item">
                                    <Input
                                        id="realname"
                                        type="text"
                                        className="form-item-input"
                                        placeholder="请输入真实姓名"
                                        value={custom.realname}
                                        disabled={!!custom.id}
                                        onInput={(e) => handleInput(e, 'realname')}
                                    />
                                </View>
                                <View className="form-item">
                                    <Input
                                        id="mobile"
                                        type="number"
                                        className="form-item-input"
                                        placeholder="请输入手机号码"
                                        value={custom.mobile}
                                        disabled={!!custom.id}
                                        onInput={(e) => handleInput(e, 'mobile')}
                                    />
                                </View>
                                {
                                    !custom.id &&
                                    <View className="form-item">
                                        <Input
                                            id="randCode"
                                            type="number"
                                            className="form-item-input"
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
                                }

                                <View className="form-btn" onClick={handleConfirm}>
                                    <Text>提交</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>

    )
}

export default Popup