import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance, getCurrentPages, useDidShow } from '@tarojs/taro'
import { View, Text, Input, Textarea, Image, RadioGroup, Label, Radio } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import qs from 'qs'

import api from '@services/api'
import app from '@services/request'
import { IImage } from '@house/sale/photo'
import { fetchUserData } from '@services/login'
import CustomPicker, { IPicker, INIT_PICKER } from '@components/picker'
import './index.scss'

const INIT_PICKER_VALUE = {
    elevator: {},
    areaList: {},
    propertyType: {},
    renovationStatus: {},
    fangDirectionType: {},

    payType: {},
    rentType: {},
}

const url_mapping = {
    rent: {
        add: api.rentAdd,
        get: api.getRentSelfById,
        update: api.rentUpdate,
    },
    esf: {
        add: api.esfSale,
        get: api.getEsfSelfById,
        update: api.esfUpdate
    }
}

const HouseSale = () => {
    const router = getCurrentInstance().router
    const houseId = router?.params.id
    const saleType = router?.params.type || 'esf'
    const urlObject = url_mapping[saleType]
    const [houseAttr, setHouseAttr] = useState<any>({})
    const [inputValue, setInputValue] = useState<any>({})
    const [images, setImages] = useState<IImage[]>([])
    const [picker, setPicker] = useState<IPicker>(INIT_PICKER)
    const [selectValue, setSelectValue] = useState<any>({
        fangProjectFeature: {},
        fangMatching: {}
    })
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
            if (houseId) {
                fetchHouseDetail(houseId, result)
            }
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

    const fetchHouseDetail = (id: string, houseAttr: any) => {
        app.request({
            url: app.areaApiUrl(urlObject.get),
            data: { id }
        }).then((result: any) => {

            let basePickerValue = {
                elevator: { id: result.is_elevator },
                areaList: result.area,
                propertyType: result.fangPropertyType,
                renovationStatus: result.fangRenovationStatus,
                fangDirectionType: result.fangDirectionType
            }
            let baseInputValue = {
                id: result.id,
                title: result.title,
                fang_area_id: result.area.id,
                fang_house_id: result.fangHouse.id,
                fang_house_name: result.fangHouse.title,
                address: result.address,
                room: result.room,
                office: result.office,
                toilet: result.toilet,
                build_year: result.build_year,
                building_area: result.building_area,
                building_no: result.building_no,
                building_unit: result.building_unit,
                building_room: result.building_room,
                height_self: result.height_self,
                height_total: result.height_total,
                description: result.description,

                real_name: result.real_name,
                mobile: result.mobile,
                sex: result.sex,
            }

            if (saleType === 'esf') {
                setImages(result.esfImage)
                setPickerValue(basePickerValue)
                setInputValue({
                    ...baseInputValue,
                    price_total: result.price_total,
                    service_point: result.service_point,
                    selling_point: result.selling_point,
                    attitude_point: result.attitude_point,
                })
                let fangProjectFeature = {}
                for (const item of result.fang_project_feature) {
                    fangProjectFeature[item] = 1
                }
                setSelectValue({ fangProjectFeature })
            } else {
                setImages(result.rentImage)
                const payTypeTarget = find(houseAttr.payType, { id: result.pay_type })
                const rentTypeTarget = find(houseAttr.rentType, { id: result.rent_type })
                setPickerValue({
                    ...basePickerValue,
                    payType: payTypeTarget,
                    rentType: rentTypeTarget,
                })
                setInputValue({
                    ...baseInputValue,
                    price: result.price,
                    special_requirement: result.special_requirement
                })
                let fangMatching = {}
                for (const item of result.fangMatching) {
                    fangMatching[item.id] = item.name
                }
                setSelectValue({ fangMatching })
            }


        })
    }

    const toSalePhoto = () => {
        const baseImages = JSON.stringify(images)
        Taro.navigateTo({
            url: `/house/sale/photo/index?type=${saleType}&images=${baseImages}`
        })
    }

    const toSaleCommunity = () => {
        Taro.navigateTo({
            url: `/house/sale/community/index?type=${saleType}`
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

    const handleSelectChange = (itemId: string, name: string, value: string | number) => {
        const current = selectValue[name]
        if (current.hasOwnProperty(itemId)) {
            delete current[itemId]
        } else {
            current[itemId] = value
        }
        setSelectValue({
            ...selectValue,
            [name]: current
        })
    }

    const handleRadioChange = (item: any, name: string) => {
        setPickerValue({
            ...pickerValue,
            [name]: item
        })
    }

    const selectPicker = (name: string) => {
        setPicker({
            name,
            show: true,
            list: houseAttr[name],
            item: pickerValue[name].id ? pickerValue[name] : INIT_PICKER_VALUE[name]
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

    const handleSubmit = () => {
        const submit_url = houseId ? urlObject.update : urlObject.add
        let commonData = {
            ...inputValue,
            ...selectValue,
            is_elevator: pickerValue.elevator.id,
            fang_property_type_id: pickerValue.propertyType.id,
            fang_direction_type_id: pickerValue.fangDirectionType.id,
            fang_renovation_status_id: pickerValue.renovationStatus.id
        }
        if (saleType === 'esf') {
            commonData = {
                ...commonData,
                esfImage: images,
            }
        } else {
            commonData = {
                ...commonData,
                rentImage: images,
                pay_type: pickerValue.payType.id,
                rent_type: pickerValue.rentType.id,
            }
        }
        app.request({
            url: app.areaApiUrl(submit_url),
            method: 'POST',
            data: qs.stringify(commonData),
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
                onInput={(e: any) => handleInputChange(e, name)}
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
                        onInput={(e: any) => handleInputChange(e, name)}
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
                item={picker.item}
                name={picker.name}
                show={picker.show}
                list={picker.list}
                onConfirm={handlePickerConfirm}
            ></CustomPicker>
        )
    }, [picker])

    return (
        <View className="sale">
            <View className="sale-content">
                <View className="sale-item" onClick={toSalePhoto}>
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

                <View className="sale-item mt20" onClick={toSaleCommunity}>
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

                {
                    saleType === 'esf' &&
                    <View className="sale-item">
                        <View className="item-text"><Text className="required">*</Text>出售总价</View>
                        <View className="item-input">
                            {renderInput('price_total', 10, 'digit')}
                        </View>
                        <View className="item-icon">
                            <Text className="unit">万</Text>
                        </View>
                    </View>
                }
                {
                    saleType === 'rent' &&
                    <View className="sale-item">
                        <View className="item-text"><Text className="required">*</Text>租金</View>
                        <View className="item-input">
                            {renderInput('price', 10, 'digit')}
                        </View>
                        <View className="item-icon">
                            <Text className="unit">元/月</Text>
                        </View>
                    </View>
                }
                {saleType === 'rent' && renderPicker('payType', '付款方式')}
                {saleType === 'rent' && renderPicker('rentType', '租赁方式')}

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
                <View className="sale-item">
                    <View className="item-text"><Text className="required">*</Text>有无电梯</View>
                    <View className="item-input">
                        <RadioGroup>
                            {
                                houseAttr['elevator'] &&
                                houseAttr['elevator'].map((item: any, index: number) => {
                                    return (
                                        <Label
                                            className='input-radio-label'
                                            key={index}
                                            onClick={() => handleRadioChange(item, 'elevator')}
                                        >
                                            <Radio
                                                className='input-radio-radio'
                                                value={item.id}
                                                checked={item.id === pickerValue.elevator.id}
                                            >{item.name}</Radio>
                                        </Label>
                                    )
                                })
                            }
                        </RadioGroup>
                    </View>
                </View>
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

                {
                    saleType === 'esf' &&
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
                                        onClick={() => handleSelectChange(item.id, 'fangProjectFeature', 1)}
                                    >
                                        {item.name}
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                }

                {
                    saleType === 'rent' &&
                    <View>
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
                                            onClick={() => handleSelectChange(item.id, 'fangMatching', item.name)}
                                        >
                                            {item.name}
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                }

                <View className="mt20">
                    {renderTextarea('title', '房源标题', 30, true)}
                </View>
                {renderTextarea('description', '房源描述', 500)}
                {saleType === 'esf' && renderTextarea('selling_point', '核心卖点', 500)}
                {saleType === 'esf' && renderTextarea('attitude_point', '业主心态', 500)}
                {saleType === 'esf' && renderTextarea('service_point', '服务介绍', 500)}

                <View className="sale-item mt20">
                    <View className="item-text"><Text className="required">*</Text>联系人</View>
                    <View className="item-input">
                        {renderInput('real_name', 50)}
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

export default HouseSale