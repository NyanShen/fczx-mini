import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance, getCurrentPages, useDidShow } from '@tarojs/taro'
import { View, Text, Input, Textarea, Image } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import qs from 'qs'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import { IImage } from '@house/sale/photo'
import { fetchUserData } from '@services/login'
import CustomPicker, { IPicker, INIT_PICKER } from '@components/picker'
import '../sale.scss'

const INIT_PICKER_VALUE = {
    areaList: {},
    payType: {},
    rentType: {},
    elevator: {},
    propertyType: {},
    renovationStatus: {},
    fangDirectionType: {}
}

const RentSale = () => {
    const router = getCurrentInstance().router
    const houseId = router?.params.id
    const [houseAttr, setHouseAttr] = useState<any>({})
    const [inputValue, setInputValue] = useState<any>({})
    const [images, setImages] = useState<IImage[]>([])
    const [picker, setPicker] = useState<IPicker>(INIT_PICKER)
    const [selectValue, setSelectValue] = useState<any>({ fangMatching: {} })
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
        if (houseId) {

        }
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
                mobile: result.mobile,
                sex: result.sex
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
            current[item.id] = item.name
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
        app.request({
            url: app.areaApiUrl(api.rentAdd),
            method: 'POST',
            data: qs.stringify({
                ...inputValue,
                ...selectValue,
                rentImage: images,
                pay_type: pickerValue.payType.id,
                rent_type: pickerValue.rentType.id,
                is_elevator: pickerValue.elevator.id,
                fang_property_type_id: pickerValue.propertyType.id,
                fang_direction_type_id: pickerValue.fangDirectionType.id,
                fang_renovation_status_id: pickerValue.renovationStatus.id
            }),
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
            }
        }).then(() => {
            Taro.showModal({
                title: '提示',
                content: '房源发布成功，请耐心等待后台审核，点击确认返回',
                showCancel: false,
                success: () => {
                    const pages: any = getCurrentPages()
                    const prevPage: any = pages[pages.length - 2]
                    prevPage.setData({
                        isUpdate: true
                    })
                    Taro.navigateBack({ delta: 1 })
                }
            })
        })
    }

    const renderInput = (name: string, maxLen: number, type: any = 'text') => {
        return (
            <Input
                placeholder="请输入"
                adjustPosition={false}
                value={inputValue[name]}
                onBlur={(e: any) => handleInputChange(e, name)}
                type={type}
                maxlength={maxLen}
            />
        )
    }

    const renderTextarea = (name: string, text: string, maxLen: number, isRequired: boolean = false) => {
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
                        maxlength={maxLen}
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
        <View className="sale-item" onClick={() => selectPicker(name)}>
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
                {renderTextarea('address', '详细地址', 100, true)}

                <View className="sale-item mt20">
                    <View className="item-text"><Text className="required">*</Text>户型</View>
                    <View className="item-input">
                        <View className="input-apart">
                            {renderInput('room', 2, 'number')}
                            <Text className="unit">室</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('office', 2, 'number')}
                            <Text className="unit">厅</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('toilet', 2, 'number')}
                            <Text className="unit">卫</Text>
                        </View>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>建筑面积</View>
                    <View className="item-input">
                        {renderInput('building_area', 10, 'digit')}
                    </View>
                    <View className="item-icon">
                        <Text className="unit">㎡</Text>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>租金</View>
                    <View className="item-input">
                        {renderInput('price', 10, 'digit')}
                    </View>
                    <View className="item-icon">
                        <Text className="unit">元/月</Text>
                    </View>
                </View>
                {renderPicker('payType', '付款方式')}
                {renderPicker('rentType', '租赁方式')}

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>楼栋号</View>
                    <View className="item-input">
                        <View className="input-apart">
                            {renderInput('building_no', 5)}
                            <Text className="unit">栋</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('building_unit', 5)}
                            <Text className="unit">单元</Text>
                        </View>
                        <View className="input-apart">
                            {renderInput('building_room', 5)}
                            <Text className="unit">室</Text>
                        </View>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>楼层</View>
                    <View className="item-input">
                        <View className="input-apart">
                            <Text className="unit">第</Text>
                            {renderInput('height_self', 5)}
                            <Text className="unit">层</Text>
                        </View>
                        <View className="input-apart">
                            <Text className="unit">共</Text>
                            {renderInput('height_total', 5, 'number')}
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
                        {renderInput('build_year', 4, 'number')}
                    </View>
                    <View className="item-icon">
                        <Text className="unit">年</Text>
                    </View>
                </View>

                <View className="sale-item">
                    <View className="item-text">出租要求</View>
                    <View className="item-input">
                        {renderInput('special_requirement', 20)}
                    </View>
                    <View className="item-desc">
                        (如男女不限)
                    </View>
                </View>

                <View className="sale-item sale-item-auto">
                    <View className="item-text">配套设施</View>
                    <View className="item-input item-input-option">
                        {
                            houseAttr['fangMatching'] &&
                            houseAttr['fangMatching'].map((item: any, index: number) => (
                                <View
                                    key={index}
                                    className={classnames('input-option',
                                        selectValue['fangMatching'][item.id] == item.name && 'actived')}
                                    onClick={() => handleSelectChange(item, 'fangMatching')}
                                >
                                    {item.name}
                                </View>
                            ))
                        }
                    </View>
                </View>

                <View className="mt20">
                    {renderTextarea('title', '房源标题', 30, true)}
                </View>
                {renderTextarea('description', '房源描述', 500)}

                <View className="sale-item mt20">
                    <View className="item-text"><Text className="required">*</Text>联系人</View>
                    <View className="item-input">
                        {renderInput('real_name', 10)}
                    </View>
                </View>
                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>联系手机</View>
                    <View className="item-input">
                        <Text className="input-text">{inputValue.mobile}</Text>
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

export default RentSale