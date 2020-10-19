import React, { useState } from 'react'
import { View, ScrollView, Text, Map } from '@tarojs/components'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const PlotIndex = () => {
    const initMarker = [
        {
            latitude: 32.068105,
            longitude: 112.139804,
            width: 30,
            height: 30,
            iconPath: 'http://192.168.2.248/assets/mini/location.png',
            callout: {
                content: '小区名称',
                color: '#fff',
                fontSize: 14,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: '#11a43c',
                bgColor: '#11a43c',
                padding: 5,
                display: 'ALWAYS',
                textAlign: 'center'
            }
        }
    ]
    const { contentHeight } = useNavData()
    const [plotData] = useState<any>({ marker: initMarker })
    return (
        <View className="plot">
            <NavBar title="小区详情" back={true}></NavBar>
            <ScrollView style={{ maxHeight: contentHeight }} scrollY>
                <View className="house-album">

                </View>
                <View className="plot-content view-content">
                    <View className="plot-item">
                        <View className="title">万里花光小区</View>
                        <View className="address">
                            <View className="name">樊城区-万达广场</View>
                            <View className="iconfont iconaddress">地址</View>
                        </View>
                        <View className="plot-price mt20">
                            <View className="price-reffer">
                                参考均价<Text className="price">120033</Text>元/㎡
                            </View>
                            <View className="price-ratio">
                                环比上月<Text className="tip-color">0.12%</Text>
                            </View>
                        </View>
                        <View className="plot-house mt20">
                            <View className="plot-house-item">
                                <View className="count">
                                    <Text>210</Text>
                                    <Text className="unit">套</Text>
                                </View>
                                <View className="link">
                                    <Text>二手房源</Text>
                                    <Text className="iconfont iconarrow-right-bold"></Text>
                                </View>
                            </View>
                            <View className="split-line"></View>
                            <View className="plot-house-item">
                                <View className="count">
                                    <Text>30</Text>
                                    <Text className="unit">套</Text>
                                </View>
                                <View className="link">
                                    <Text>在租房源</Text>
                                    <Text className="iconfont iconarrow-right-bold"></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="plot-item">
                        <View className="header">
                            <Text>小区概括</Text>
                        </View>
                        <View className="plot-info">
                            <View className="plot-info-item">
                                <Text className="label">建筑年代</Text>
                                <Text className="value">2010</Text>
                            </View>
                            <View className="plot-info-item">
                                <Text className="label">建筑类型</Text>
                                <Text className="value">板楼</Text>
                            </View>
                            <View className="plot-info-item">
                                <Text className="label">物业费</Text>
                                <Text className="value">1.4元/㎡/月</Text>
                            </View>
                            <View className="plot-info-item">
                                <Text className="label">房屋总数</Text>
                                <Text className="value">1884户</Text>
                            </View>
                            <View className="plot-info-item">
                                <Text className="label">楼栋总数</Text>
                                <Text className="value">37栋</Text>
                            </View>
                            <View className="plot-info-item">
                                <Text className="label">停车位</Text>
                                <Text className="value">1122</Text>
                            </View>
                        </View>
                    </View>
                    <View className="plot-item">
                        <View className="header">
                            <Text>小区位置及周边</Text>
                        </View>
                        <View className="plot-map">
                            <Map
                                id="plotMap"
                                className="map"
                                latitude={32.068105}
                                longitude={112.139804}
                                enableZoom={false}
                                markers={plotData.marker}
                            >
                            </Map>
                        </View>
                    </View>
                    <View className="plot-item">
                        <Text className="small-desc">
                            免责声明：本网站不保证所有小区信息完全真实可靠，最终以政府部门登记备案为准，请谨慎核查。
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default PlotIndex