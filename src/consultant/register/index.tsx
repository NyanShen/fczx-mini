import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance, getCurrentPages, useDidShow } from '@tarojs/taro'
import { View, Image, Text, Input } from '@tarojs/components'
import find from 'lodash/find'

import './index.scss'
import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import CustomPicker, { INIT_PICKER, IPicker } from '@components/picker'

const PICKER_LIST = [
    { id: '1', name: '全天接听' },
    { id: '2', name: '晚10点到早8点拒接' },
    { id: '3', name: '全天拒接' }
]

const INIT_PICKER_VALUE = {
    service_type: PICKER_LIST[0]
}

const HouseConsultantForm = () => {
    const params: any = getCurrentInstance().router?.params
    const [inputValue, setInputValue] = useState<any>({})
    const [picker, setPicker] = useState<IPicker>(INIT_PICKER)
    const [pickerValue, setPickerValue] = useState<any>(INIT_PICKER_VALUE)

    useDidShow(() => {
        const pages: any = getCurrentPages()
        const currPageData: any = pages[pages.length - 1].data
        const houseId = currPageData.id
        const houseTitle = currPageData.title
        if (houseId) {
            setInputValue({
                ...inputValue,
                fang_house_id: houseId,
                fang_house_title: houseTitle
            })
        }
    })

    useEffect(() => {
        Taro.setNavigationBarTitle({
            title: params.navTitle ? params.navTitle : '申请成为置业顾问'
        })
        if (params.consultant) {
            const consultant = JSON.parse(decodeURIComponent(params.consultant))
            const serviceType = find(PICKER_LIST, { id: consultant.service_type })
            setInputValue({
                avatar: consultant.user.avatar,
                mobile: consultant.user.mobile,
                nickname: consultant.user.nickname,
                fang_house_id: consultant.fangHouse.id,
                fang_house_title: consultant.fangHouse.title,
                wx_qrcode_path: consultant.wx_qrcode_path,
                work_photo_path: consultant.work_photo_path,
                id: consultant.id,
                wx: consultant.wx,
            })
            setPickerValue({ service_type: serviceType })
        } else {
            const user = storage.getItem('login_user')
            setInputValue({
                avatar: user.avatar,
                mobile: user.mobile,
                nickname: user.nickname,
            })
        }
    }, [])

    const toHouseSearch = () => {
        Taro.navigateTo({ url: '/consultant/houseSearch/index' })
    }

    const handleInputChange = (e: any, name: string) => {
        setInputValue({
            ...inputValue,
            [name]: e.detail.value
        })
    }

    const handlePickerConfirm = (item: any) => {
        if (item) {
            setPickerValue({
                ...pickerValue,
                [picker.name]: item
            })
        }
        setPicker({
            ...picker,
            show: false,
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

    const selectPicker = (name: string) => {
        setPicker({
            name,
            show: true,
            list: PICKER_LIST,
            item: pickerValue[name].id ? pickerValue[name] : INIT_PICKER_VALUE[name]
        })
    }

    const validateData = (data: string, text: string) => {
        if (!data) {
            Taro.showToast({
                title: text,
                icon: 'none'
            })
            return true
        }
    }

    const handleSubmit = () => {
        const {
            id,
            wx,
            fang_house_id,
            wx_qrcode_path,
            work_photo_path
        } = inputValue

        if (validateData(fang_house_id, '请填写关联楼盘')) return
        if (validateData(wx_qrcode_path, '请上传微信二维码')) return
        if (validateData(work_photo_path, '请上传工作证(名片)')) return

        const url = id ? api.updateHouseConsultant : api.applyHouseConsultant
        app.request({
            url: app.areaApiUrl(url),
            method: 'POST',
            data: {
                id,
                wx,
                fang_house_id,
                wx_qrcode_path,
                work_photo_path,
                service_type: pickerValue.service_type.id
            }
        }).then(() => {
            Taro.redirectTo({
                url: `/consultant/checkStatus/index`
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
                        <Image src={inputValue[name]} mode="aspectFill" /> :
                        <Text className="iconfont iconphotograph"></Text>
                }
                <Text className="image-tip">点击上传</Text>
            </View>
        )
    }

    const renderPicker = (name: string, text: string) => (
        <View className="form-item flex-item" onClick={() => selectPicker(name)}>
            <View className="item-label">{text}</View>
            <View className="item-select">
                <Text className="select-text">{pickerValue[name].name || '请选择'}</Text>
                <Text className="iconfont iconarrow-right-bold"></Text>
            </View>
        </View>
    )

    const customPicker = () => useMemo(() => {
        return (
            <CustomPicker
                item={picker.item}
                name={picker.name}
                show={picker.show}
                list={picker.list}
                onConfirm={handlePickerConfirm}
            ></CustomPicker>
        )
    }, [picker])

    return (
        <View className="consultant-register">
            <View className="consultant-form">
                <View className="form-item flex-column">
                    <View className="item-image">
                        <Image src={inputValue.avatar} mode="aspectFill" />
                    </View>
                    <View className="item-label">用户头像</View>
                    <View className="placeholder">(头像, 姓名, 手机号将自动同步关联用户信息)</View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">姓名</View>
                    <View className="item-select">
                        <Text className="select-text">{inputValue.nickname}</Text>
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">手机号</View>
                    <View className="item-select">
                        <Text className="select-text">{inputValue.mobile}</Text>
                        <Text className="placeholder">(如需切换手机号,请重新登录)</Text>
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">微信号</View>
                    <View className="item-input">
                        {renderInput('wx', 30)}
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label"><Text className="required">*</Text>关联楼盘</View>
                    <View className="item-select" onClick={toHouseSearch}>
                        <Text className="select-text">{inputValue.fang_house_title || '请搜索选择楼盘信息'}</Text>
                        <Text className="iconfont iconarrow-right-bold"></Text>
                    </View>
                </View>
                {renderPicker('service_type', '服务时间')}

                {/* <View className="form-item flex-item">
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
                </View> */}
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传微信二维码</View>
                    {renderImage('wx_qrcode_path')}
                </View>
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传工作证（名片）</View>
                    {renderImage('work_photo_path')}
                </View>
                <View className="form-submit">
                    <View className="btn btn-primary" onClick={handleSubmit}>
                        {params.navTitle ? '确认修改' : '立即入驻'}
                    </View>
                </View>
                <View className="form-submit">
                    <View className="tip-text">注：为了避免他人冒充置业顾问/经纪人我们需要验证您的名片或者工牌 谢谢您的配合</View>
                    <View className="tip-text">如果遇到图片无法上传或者其他的问题请联系客服，我们将及时为您解决</View>
                    <View className="tip-text">
                        客服电话：<Text style={{ color: '#f90' }}>0710-3788606</Text>
                    </View>
                </View>
            </View>
            {customPicker()}
        </View>
    )
}

export default HouseConsultantForm