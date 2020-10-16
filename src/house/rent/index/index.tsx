import React from 'react'
import { View, ScrollView, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import '@styles/common/bottom-bar.scss'
import './index.scss'
const RentIndex = () => {

    const { contentHeight } = useNavData()
    return (
        <View className="rent">
            <NavBar title="租房" back={true}></NavBar>
            <ScrollView style={{ maxHeight: `${contentHeight - 55}px` }} scrollY>
                <View className="house-album">

                </View>
                <View className="rent-content">
                    <View className="rent-content-header">
                        <View className="title mb16">
                            全市低3千1平中豪旁边天然气入户层高全市低3千1平中豪旁边天然气
                        </View>
                        <View className="address mb16">樊城区-天润颐景园小区</View>
                        <View className="small-desc mb16">
                            更新时间：2020-10-16 17:14:21
                        </View>
                        <View className="tags">
                            <Text className="tags-item sale-status-2">整租</Text>
                        </View>
                    </View>
                    <View className="rent-content-info">
                        <View>
                            <Text className="price">2200</Text>
                            <Text className="price-unit">元/月</Text>
                            <Text className="small-desc">(押一付三)</Text>
                        </View>
                        <View className="info-list">
                            <View className="info-item">
                                <Text className="label">户型</Text>
                                <Text className="value">2室2厅1卫</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">面积</Text>
                                <Text className="value">60m²</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">楼层</Text>
                                <Text className="value">中层/20层</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">装修</Text>
                                <Text className="value">豪华装修</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">朝向</Text>
                                <Text className="value">南</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">电梯</Text>
                                <Text className="value">有</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className="bottom-bar">
                <View className="bar-item">
                    <Text className="iconfont iconhome"></Text>
                    <Text>首页</Text>
                </View>
                <View className="bar-item-btn">
                    <Text className="btn btn-yellow btn-bar">在线咨询</Text>
                </View>
                <View className="bar-item-btn">
                    <Text className="btn btn-primary btn-bar">电话咨询</Text>
                </View>
            </View>
        </View>
    )
}

export default RentIndex