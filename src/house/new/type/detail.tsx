import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import './detail.scss'

const HouseTypeDetail = () => {
    const [style, setStlye] = useState<any>({})

    const handleLoaded = (e) => {
        const maxWidth = Taro.getSystemInfoSync().windowWidth
        const maxHeight = 280
        const ratio = maxWidth / maxHeight
        const realWidth = e.detail.width
        const realHeight = e.detail.height
        const imgRatio = realWidth / realHeight

        if (ratio > imgRatio) {
            setStlye({
                width: realWidth * (maxHeight / realHeight),
                height: maxHeight
            })
        } else {
            setStlye({
                width: maxWidth,
                height: realHeight * (maxWidth / realWidth)
            })
        }
    }
    return (
        <View className="house-type-detail">
            <NavBar title="户型图" back={true}></NavBar>
            <View className="detail-wrapper">
                <View className="detail-image">
                    <Image
                        src="http://192.168.2.248/assets/images/house_type.jpg"
                        onLoad={handleLoaded}
                        style={style}
                    ></Image>
                </View>
                <View className="detail-header">
                    <View className="title">户型名称</View>
                    <View className="tags">
                        <Text className="tags-item sale-status-1">在售</Text>
                    </View>
                </View>
                <View className="detail-content view-content">
                    <View className="detail-info">
                        <View className="info-item">
                            <View className="value">3室2厅1卫</View>
                            <View className="label">户型</View>
                        </View>
                        <View className="info-item">
                            <View className="value price">1233</View>
                            <View className="label">价格</View>
                        </View>
                        <View className="info-item">
                            <View className="value">123</View>
                            <View className="label">建筑面积</View>
                        </View>
                    </View>
                    <View className="small-desc">实际价格以售楼处为主，户型图为开发商提供，具体以实际交房标准为主.</View>
                </View>
            </View>
        </View>
    )
}

export default HouseTypeDetail