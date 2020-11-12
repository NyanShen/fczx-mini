import React, { useEffect, useMemo, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image, Text, Input, Textarea } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import CustomPicker, { IPicker, INIT_PICKER } from '@components/picker'
import './index.scss'

const INIT_PICKER_VALUE = {
    areaList: {},
    propertyType: {},
    renovationStatus: {},
    fangDirectionType: {}
}
const EsfSale = () => {
    const [houseAttr, setHouseAttr] = useState<any[]>([])
    const [picker, setPicker] = useState<IPicker>(INIT_PICKER)
    const [pickerValue, setPickerValue] = useState<any>(INIT_PICKER_VALUE)

    useDidShow(() => {

    })

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setHouseAttr(result)
        })
    }, [])

    const toSaleModule = (module: string) => {
        Taro.navigateTo({
            url: `/house/sale/${module}/index`
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

    const renderPickerValue = (value: string) => {
        return value ?
            <Text className="input-text">{value}</Text> :
            <Text className="input-placeholder">请选择</Text>
    }

    const renderPicker = (name: string, text: string) => (
        <View className="sale-item mt20" onClick={() => selectPicker(name)}>
            <View className="item-text">{text}</View>
            <View className="item-input">
                {renderPickerValue(pickerValue[name].name)}
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
                <View className="sale-item">
                    <View className="item-image">
                        <View className="image-icon">
                            <Image src=""></Image>
                        </View>
                        <View className="btn btn-plain image-btn">上传照片</View>
                        <View className="image-desc">上传房屋照片，最多可以上传10张图片，每张图片最大10M</View>
                    </View>
                </View>
                {renderPicker('propertyType', '业务类型')}
                <View className="sale-item mt20" onClick={() => toSaleModule('community')}>
                    <View className="item-text">小区名称</View>
                    <View className="item-input">
                        <Text className="input-placeholder">请选择小区</Text>
                    </View>
                    <View className="item-icon">
                        <Text className="iconfont iconarrow-right-bold"></Text>
                    </View>
                </View>
                {renderPicker('areaList', '区域')}
                <View className="sale-item sale-item-auto">
                    <View className="item-text">详细地址</View>
                    <View className="item-input">
                        <Textarea className="input-whole" adjustPosition={false} autoHeight placeholder="请输入" />
                    </View>
                </View>
                <View className="sale-item mt20">
                    <View className="item-text">户型</View>
                    <View className="item-input">
                        <View className="input-apart">
                            <Input placeholder="请输入" />
                            <Text className="unit">室</Text>
                        </View>
                        <View className="input-apart">
                            <Input placeholder="请输入" />
                            <Text className="unit">厅</Text>
                        </View>
                        <View className="input-apart">
                            <Input placeholder="请输入" />
                            <Text className="unit">卫</Text>
                        </View>
                    </View>
                </View>
                <View className="sale-item">
                    <View className="item-text">建筑面积</View>
                    <View className="item-input">
                        <Input className="input-whole" placeholder="请输入" type="digit" />
                    </View>
                    <View className="item-icon">
                        <Text className="unit">㎡</Text>
                    </View>
                </View>
                <View className="sale-item">
                    <View className="item-text">出售总价</View>
                    <View className="item-input">
                        <Input className="input-whole" placeholder="请输入" type="digit" />
                    </View>
                    <View className="item-icon">
                        <Text className="unit">万</Text>
                    </View>
                </View>
                <View className="sale-item">
                    <View className="item-text">楼栋号</View>
                    <View className="item-input">
                        <View className="input-apart">
                            <Input placeholder="请输入" />
                            <Text className="unit">栋</Text>
                        </View>
                        <View className="input-apart">
                            <Input placeholder="请输入" />
                            <Text className="unit">单元</Text>
                        </View>
                        <View className="input-apart">
                            <Input placeholder="请输入" />
                            <Text className="unit">室</Text>
                        </View>
                    </View>
                </View>
                <View className="sale-item">
                    <View className="item-text">楼层</View>
                    <View className="item-input">
                        <View className="input-apart">
                            <Text className="unit">第</Text>
                            <Input placeholder="请输入" />
                            <Text className="unit">层</Text>
                        </View>
                        <View className="input-apart">
                            <Text className="unit">共</Text>
                            <Input placeholder="请输入" />
                            <Text className="unit">层</Text>
                        </View>
                    </View>
                </View>
                {renderPicker('fangDirectionType', '朝向')}
                {renderPicker('renovationStatus', '装修程度')}
                <View className="sale-item sale-item-auto">
                    <View className="item-text">项目特色</View>
                    <View className="item-input item-input-option">
                        {
                            houseAttr['projectFeature'] &&
                            houseAttr['projectFeature'].map((item: any, index: number) => (
                                <View key={index} className="input-option">{item.name}</View>
                            ))
                        }
                    </View>
                </View>
                <View className="sale-item sale-item-auto mt20">
                    <View className="item-text">房源标题</View>
                    <View className="item-input">
                        <Textarea className="input-whole" adjustPosition={false} autoHeight placeholder="请输入" />
                    </View>
                </View>
                <View className="sale-item sale-item-auto">
                    <View className="item-text">房源描述</View>
                    <View className="item-input">
                        <Textarea className="input-whole" adjustPosition={false} autoHeight placeholder="请输入" />
                    </View>
                </View>
                <View className="sale-item sale-item-auto">
                    <View className="item-text">核心卖点</View>
                    <View className="item-input">
                        <Textarea className="input-whole" adjustPosition={false} autoHeight placeholder="请输入" />
                    </View>
                </View>
                <View className="sale-item sale-item-auto">
                    <View className="item-text">业主心态</View>
                    <View className="item-input">
                        <Textarea className="input-whole" adjustPosition={false} autoHeight placeholder="请输入" />
                    </View>
                </View>
                <View className="sale-item sale-item-auto">
                    <View className="item-text">服务介绍</View>
                    <View className="item-input">
                        <Textarea className="input-whole" adjustPosition={false} autoHeight placeholder="请输入" />
                    </View>
                </View>
                <View className="sale-submit">
                    <View className="btn btn-primary">确认发布</View>
                </View>
            </View>
            {customPicker()}
        </View>
    )
}

export default EsfSale