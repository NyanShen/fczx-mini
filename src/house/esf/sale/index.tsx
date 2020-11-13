import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentPages, useDidShow } from '@tarojs/taro'
import { View, Text, Input, Textarea, Image } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import { IImage } from '@house/sale/photo'
import { fetchUserData } from '@services/login'
import CustomPicker, { IPicker, INIT_PICKER } from '@components/picker'
import './index.scss'

const INIT_PICKER_VALUE = {
    areaList: {},
    elevator: {},
    propertyType: {},
    renovationStatus: {},
    fangDirectionType: {}
}

const INIT_SELECT_VALUE = {
    fangProjectFeature: {}
}

const EsfSale = () => {
    const [houseAttr, setHouseAttr] = useState<any>({})
    const [inputValue, setInputValue] = useState<any>({})
    const [images, setImages] = useState<IImage[]>([])
    const [picker, setPicker] = useState<IPicker>(INIT_PICKER)
    const [selectValue, setSelectValue] = useState<any>(INIT_SELECT_VALUE)
    const [pickerValue, setPickerValue] = useState<any>(INIT_PICKER_VALUE)

    useDidShow(() => {
        const pages: any = getCurrentPages()
        const currPageData: any = pages[pages.length - 1].data
        const images = currPageData.images
        if (images) {
            setImages(images)
        }
        const community = currPageData.community
        if (community) {
            const areaTarget = find(houseAttr.areaList, { id: community.fang_area_id })
            if (areaTarget) {
                setPickerValue({
                    ...pickerValue,
                    areaList: areaTarget
                })
            }
            setInputValue({
                ...inputValue,
                address: community.address,
                fang_house_id: community.id,
                fang_house_name: community.title,
                fang_area_id: community.fang_area_id
            })
        }
    })

    useEffect(() => {
        setUserData()
        app.request({
            url: app.areaApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setHouseAttr(result)
        })
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

    const toSaleModule = (module: string) => {
        Taro.navigateTo({
            url: `/house/sale/${module}/index`
        })
    }

    const findFaceImage = () => {
        for (const image of images) {
            if (image.is_face == '1') {
                return image.image_path
            }
        }
        return ''
    }

    const handleInputChange = (e: any, name: string) => {
        setInputValue({
            ...inputValue,
            [name]: e.detail.value
        })
    }

    const handleSelectChange = (item: any, name) => {
        const current = selectValue[name]
        if (current.hasOwnProperty(item.id)) {
            delete current[item.id]
        } else {
            current[item.id] = 1
        }
        setSelectValue({
            ...selectValue,
            [name]: current
        })
    }

    const selectPicker = (name: string) => {
        setPicker({
            name,
            show: true,
            list: houseAttr[name]
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
            name: '',
            show: false,
            list: []
        })
    }

    const handleSubmit = () => {
        console.log(inputValue, pickerValue, selectValue, images)
        app.request({
            url: app.areaApiUrl(api.esfSale),
            method: 'POST',
            data: {
                ...inputValue,
                ...selectValue,
                esfImages: images,
                is_elevator: pickerValue.elevator.id,
                fang_property_type_id: pickerValue.propertyType.id,
                fang_direction_type_id: pickerValue.fangDirectionType.id,
                fang_renovation_status_id: pickerValue.renovationStatus.id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }).then(() => {
            Taro.showToast({
                icon: 'none',
                title: '发布成功'
            })
        })
    }

    const renderInput = (name: string, type: any = 'text') => {
        return (
            <Input
                placeholder="请输入"
                adjustPosition={false}
                value={inputValue[name]}
                onBlur={(e: any) => handleInputChange(e, name)}
                type={type}
            />
        )
    }

    const renderTextarea = (name: string, text: string, isRequired: boolean = false) => {
        return (
            <View className="sale-item sale-item-auto">
                <View className="item-text">
                    {isRequired && <Text className="required">*</Text>}
                    {text}
                </View>
                <View className="item-input">
                    <Textarea
                        className="input-whole"
                        adjustPosition={false}
                        autoHeight
                        placeholder="请输入"
                        value={inputValue[name]}
                        onBlur={(e: any) => handleInputChange(e, name)}
                    />
                </View>
            </View>
        )
    }

    const renderValue = (value: string) => {
        return value ?
            <Text className="input-text">{value}</Text> :
            <Text className="input-placeholder">请选择</Text>
    }

    const renderPicker = (name: string, text: string) => (
        <View className="sale-item mt20" onClick={() => selectPicker(name)}>
            <View className="item-text"><Text className="required">*</Text>{text}</View>
            <View className="item-input">
                {renderValue(pickerValue[name].name)}
            </View>
            <View className="item-icon">
                <Text className="iconfont iconarrow-right-bold"></Text>
            </View>
        </View>
    )

    const customPicker = () => useMemo(() => {
        return (
            <CustomPicker
                name={picker.name}
                show={picker.show}
                list={picker.list}
                onConfirm={handlePickerConfirm}
            ></CustomPicker>
        )
    }, [picker])

    return (
        <View className="sale">
            <NavBar title="发布出售" back={true}></NavBar>
            <View className="sale-content">
                <View className="sale-item" onClick={() => toSaleModule('photo')}>
                    <View className="item-image">
                        <View className="image-icon">
                            {
                                findFaceImage() ?
                                    <Image src={findFaceImage()} mode="aspectFill" /> :
                                    <Text className="iconfont iconaddphoto"></Text>
                            }

                        </View>
                        <View className="btn btn-plain image-btn">上传照片</View>
                        <View className="image-desc"><Text className="required">*</Text>上传房源照片，最多可以上传10张图片</View>
                    </View>
                </View>

                {renderPicker('propertyType', '业务类型')}

                <View className="sale-item mt20" onClick={() => toSaleModule('community')}>
                    <View className="item-text"><Text className="required">*</Text>小区名称</View>
                    <View className="item-input">
                        {renderValue(inputValue.fang_house_name)}
                    </View>
                    <View className="item-icon">
                        <Text className="iconfont iconarrow-right-bold"></Text>
                    </View>
                </View>

                {renderPicker('areaList', '区域')}
                {renderTextarea('address', '详细地址', true)}

                <View className="sale-item mt20">
                    <View className="item-text"><Text className="required">*</Text>户型</View>
                    <View className="item-input">
                        <View className="input-apart">
                            {renderInput('room', 'number')}
                            <Text className="unit">室</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('office', 'number')}
                            <Text className="unit">厅</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('toilet', 'number')}
                            <Text className="unit">卫</Text>
                        </View>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>建筑面积</View>
                    <View className="item-input">
                        {renderInput('building_area', 'digit')}
                    </View>
                    <View className="item-icon">
                        <Text className="unit">㎡</Text>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>出售总价</View>
                    <View className="item-input">
                        {renderInput('price_total', 'digit')}
                    </View>
                    <View className="item-icon">
                        <Text className="unit">万</Text>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>楼栋号</View>
                    <View className="item-input">
                        <View className="input-apart">
                            {renderInput('building_no')}
                            <Text className="unit">栋</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('building_unit')}
                            <Text className="unit">单元</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('building_room')}
                            <Text className="unit">室</Text>
                        </View>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>楼层</View>
                    <View className="item-input">
                        <View className="input-apart">
                            <Text className="unit">第</Text>
                            {renderInput('height_self')}
                            <Text className="unit">层</Text>
                        </View>
                        <View className="input-apart">
                            <Text className="unit">共</Text>
                            {renderInput('height_total', 'number')}
                            <Text className="unit">层</Text>
                        </View>
                    </View>
                </View>

                {renderPicker('fangDirectionType', '朝向')}
                {renderPicker('elevator', '有无电梯')}
                {renderPicker('renovationStatus', '装修程度')}

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>建造年代</View>
                    <View className="item-input">
                        {renderInput('build_year', 'number')}
                    </View>
                    <View className="item-icon">
                        <Text className="unit">年</Text>
                    </View>
                </View>

                <View className="sale-item sale-item-auto">
                    <View className="item-text">项目特色</View>
                    <View className="item-input item-input-option">
                        {
                            houseAttr['projectFeature'] &&
                            houseAttr['projectFeature'].map((item: any, index: number) => (
                                <View
                                    key={index}
                                    className={classnames('input-option',
                                        selectValue['fangProjectFeature'][item.id] == 1 && 'actived')}
                                    onClick={() => handleSelectChange(item, 'fangProjectFeature')}
                                >
                                    {item.name}
                                </View>
                            ))
                        }
                    </View>
                </View>

                <View className="mt20">
                    {renderTextarea('title', '房源标题', true)}
                </View>
                {renderTextarea('description', '房源描述')}
                {renderTextarea('selling_point', '核心卖点')}
                {renderTextarea('attitude_point', '业主心态')}
                {renderTextarea('service_point', '服务介绍')}

                <View className="sale-item mt20">
                    <View className="item-text"><Text className="required">*</Text>联系人</View>
                    <View className="item-input">
                        {renderInput('real_name')}
                    </View>
                </View>
                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>联系手机</View>
                    <View className="item-input">
                        <Text className="input-text">13927486756</Text>
                    </View>
                    <View className="item-desc">
                        (如需切换手机号，请重新登录)
                    </View>
                </View>

                <View className="sale-submit">
                    <View className="btn btn-primary" onClick={handleSubmit}>确认发布</View>
                </View>
            </View>
            {customPicker()}
        </View>
    )
}

export default EsfSale