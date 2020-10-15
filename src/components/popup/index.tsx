import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import { fetchUserData } from '@services/login'
import './index.scss'

interface IUser {
    mobile: string
    realname: string
}

interface IPopupProps {
    type?: string
    houseId: string
    btnText: string
    iconClass?: string
    title?: string
    subTitle?: string
    description?: string
    backUrl?: string
    onConfirm?: () => void,
    onCancel?: () => void,
}

const INIT_USER = { mobile: '', realname: '' }

const Popup = (props: IPopupProps) => {
    const [user, setUser] = useState<IUser>(INIT_USER)
    const [popup, setPopup] = useState<boolean>(false)
    const { title, subTitle, description, btnText, iconClass, backUrl, onConfirm } = props

    const handleBtnClick = () => {
        fetchUserData(backUrl).then((result: any) => {
            setUser({
                mobile: result.mobile,
                realname: result.nickname || result.username
            })
            setPopup(true)
        })
    }

    const handleConfirm = () => {
        app.request({
            method: 'POST',
            url: app.areaApiUrl(api.postHouseCustomer),
            data: {
                real_name: user.realname,
                mobile: user.mobile,
                randCode: '123456',
                type: props.type || '5',
                fang_house_id: props.houseId
            }
        }, { loading: false }).then(() => {
            setPopup(false)
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
                                <Text className="popup-close iconfont iconclose" onClick={() => setPopup(false)}></Text>
                            </View>
                            <View className="popup-desc">
                                <Text>{description}</Text>
                            </View>
                            <View className="popup-form">
                                <View className="form-item">
                                    <Input className="form-item-input" type="number" id="mobile" value={user.mobile} disabled />
                                </View>
                                <View className="form-item form-btn" onClick={handleConfirm}>
                                    <Text>确定</Text>
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