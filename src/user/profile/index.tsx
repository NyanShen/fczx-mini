import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Input, Image, RadioGroup, Label, Radio } from "@tarojs/components"

import api from '@services/api'
import app from '@services/request'
import './index.scss'
const SEX = [
    {
        id: '1',
        name: '男'
    },
    {
        id: '2',
        name: '女'
    }
]

const Profile = () => {
    const params: any = getCurrentInstance().router?.params
    const INIT_PICKER_VALUE = {
        sex: { id: params.sex }
    }
    const [photo, setPhoto] = useState<string>(params.avatar)
    const [inputValue, setInputValue] = useState<any>({ nickname: params.nickname })
    const [pickerValue, setPickerValue] = useState<any>(INIT_PICKER_VALUE)

    const handleInputChange = (e: any, name: string) => {
        setInputValue({
            ...inputValue,
            [name]: e.detail.value
        })
    }

    const handleRadioChange = (item: any, name: string) => {
        setPickerValue({
            ...pickerValue,
            [name]: item
        })
    }

    const handlePhotoChange = () => {
        Taro.chooseImage({
            count: 1,
            sourceType: ['album', 'camera'],
            success: (res: any) => {
                app.uploadFile(res, (result: string) => {
                    setPhoto(result)
                })
            }
        })
    }

    const handleSubmit = () => {
        app.request({
            url: app.apiUrl(api.updateUser),
            method: 'POST',
            data: {
                id: params.id,
                avatar: photo,
                nickname: inputValue.nickname,
                sex: pickerValue.sex.id
            }
        }).then(() => {
            Taro.showToast({
                title: '保存成功',
                icon: 'success'
            })
            Taro.navigateBack({ delta: 1 })
        })
    }

    return (
        <View className="profile">
            <View className="profile-photo" onClick={handlePhotoChange}>
                <View className="photo">
                    <Image className="taro-image" src={photo} mode="aspectFill" />
                </View>
                <View className="text">点击修改头像</View>
            </View>
            <View className="profile-info">
                <View className="profile-item">
                    <View className="item-label">账号</View>
                    <View className="item-input">
                        <Text className="input-text">{params.username}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="profile-item">
                    <View className="item-label">手机号码</View>
                    <View className="item-input">
                        <Text className="input-text">{params.mobile}</Text>
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="profile-item">
                    <View className="item-label">昵称</View>
                    <View className="item-input">
                        <Input
                            placeholder="请输入"
                            value={inputValue.nickname}
                            onInput={(e: any) => handleInputChange(e, 'nickname')}
                            maxlength={20}
                        />
                    </View>
                    <View className="item-icon"></View>
                </View>
                <View className="profile-item">
                    <View className="item-label">性别</View>
                    <View className="item-input">
                        <RadioGroup>
                            {
                                SEX.map((item: any, index: number) => (
                                    <Label
                                        className='input-radio-label'
                                        key={index}
                                        onClick={() => handleRadioChange(item, 'sex')}
                                    >
                                        <Radio
                                            className='input-radio-radio'
                                            value={item.id}
                                            checked={item.id === pickerValue.sex.id}
                                        >{item.name}</Radio>
                                    </Label>
                                ))
                            }
                        </RadioGroup>
                    </View>
                    <View className="item-icon">
                        <Text className="iconfont iconarrow-right-bold"></Text>
                    </View>
                </View>
                <View className="profile-submit">
                    <View className="btn btn-primary" onClick={handleSubmit}>保存</View>
                </View>
            </View>
        </View>
    )
}

export default Profile