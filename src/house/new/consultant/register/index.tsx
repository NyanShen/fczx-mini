import React, { useEffect, useState } from 'react'
import Taro, { getCurrentPages, useDidShow } from '@tarojs/taro'
import { View, Image, Text, Input, Textarea } from '@tarojs/components'

import './index.scss'
import { fetchUserData } from '@services/login'
import app from '@services/request'

const HouseConsultant = () => {
    const [inputValue, setInputValue] = useState<any>({})

    useDidShow(() => {
        const pages: any = getCurrentPages()
        const currPageData: any = pages[pages.length - 1].data
        const houseId = currPageData.id
        const houseTitle = currPageData.title
        if (houseId) {
            setInputValue({
                ...inputValue,
                houseId,
                houseTitle
            })
        }
    })

    useEffect(() => {
        setUserData()
    }, [])

    const setUserData = () => {
        fetchUserData().then((result: any) => {
            setInputValue({
                ...inputValue,
                real_name: result.nickname,
                mobile: result.mobile
            })
        })
    }

    const toHouseSearch = () => {
        Taro.navigateTo({ url: '/house/new/consultant/houseSearch/index' })
    }

    const handleInputChange = (e: any, name: string) => {
        setInputValue({
            ...inputValue,
            [name]: e.detail.value
        })
    }

    const handleUploadImage = (name: string) => {
        Taro.chooseImage({
            count: 1,
            success: ((res: any) => {
                app.uploadFile(res, (result: string) => {
                    setInputValue({
                        ...inputValue,
                        [name]: result
                    })
                })
            })
        })
    }

    const renderInput = (name: string, maxLen: number, type: any = 'text') => {
        return (
            <Input
                placeholder="请输入"
                adjustPosition={false}
                value={inputValue[name]}
                onInput={(e: any) => handleInputChange(e, name)}
                type={type}
                maxlength={maxLen}
            />
        )
    }

    const renderImage = (name: string) => {
        return (
            <View className="item-image" onClick={() => handleUploadImage(name)}>
                {
                    inputValue[name] ?
                        <Image src={inputValue[name]} mode="aspectFill"/> :
                        <Text className="iconfont iconphotograph"></Text>
                }
                <Text className="image-tip">点击上传</Text>
            </View>
        )
    }

    const handleSubmit = () => {
        console.log(inputValue)
    }

    return (
        <View className="consultant-register">
            <View className="consultant-form">
                <View className="form-item flex-item">
                    <View className="item-label"><Text className="required">*</Text>姓名</View>
                    <View className="item-input">
                        {renderInput('real_name', 30)}
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">微信号</View>
                    <View className="item-input">
                        {renderInput('wechat', 30)}
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">楼盘信息</View>
                    <View className="item-select" onClick={toHouseSearch}>
                        <Text className="select-text">{inputValue.houseTitle || '请搜索选择楼盘信息'}</Text>
                        <Text className="iconfont iconarrow-right-bold"></Text>
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label"><Text className="required">*</Text>手机号</View>
                    <View className="item-select">
                        <Text className="select-text">{inputValue.mobile}</Text>
                        <Text className="placeholder">(如需切换手机号,请重新登录)</Text>
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label"><Text className="required">*</Text>验证码</View>
                    <View className="item-input">
                        {renderInput('randCode', 6)}
                        <View className="btn btn-plain">获取验证码</View>
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">邀请码</View>
                    <View className="item-input">
                        {renderInput('inviteCode', 30)}
                    </View>
                </View>
                <View className="form-item">
                    <View className="item-label">个人简介</View>
                    <View className="item-input">
                        <Textarea
                            placeholder="请输入个人简介"
                            maxlength={300}
                            value={inputValue.introduce}
                            onInput={(e: any) => handleInputChange(e, 'introduce')}
                        />
                    </View>
                </View>
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传头像</View>
                    {renderImage('profile_image')}
                </View>
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传微信二维码</View>
                    {renderImage('wechat_image')}
                </View>
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传工作证（名片）</View>
                    {renderImage('voucher_image')}
                </View>
                <View className="form-submit">
                    <View className="btn btn-primary" onClick={handleSubmit}>立即入驻</View>
                </View>
                <View className="form-submit">
                    <View className="tip-text">注：为了避免他人冒充置业顾问/经纪人我们需要验证您的名片或者工牌 谢谢您的配合</View>
                    <View className="tip-text">如果遇到图片无法上传或者其他的问题请联系客服，我们将及时为您解决</View>
                    <View className="tip-text">
                        客服微信：<Text style={{ color: '#f90' }}>1234444</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HouseConsultant