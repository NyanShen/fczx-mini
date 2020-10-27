import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View, ScrollView, Text, Map } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'
import { PRICE_TYPE } from '@constants/house'

const INIT_HOUSE_DATA = {
    id: '',
    title: '',
    tags: [],
    marker: [],
    area: {},
    fangHouseInfo: {},
}
const CommunityIndex = () => {

    const { contentHeight } = useNavData()
    let currentRouter: any = getCurrentInstance().router
    let params: any = currentRouter.params
    const [communityData, setCommunityData] = useState<any>(INIT_HOUSE_DATA)

    useEffect(() => {
        params.id = '1000006'
        if (params.id) {
            app.request({
                url: app.testApiUrl(api.getCommunityById),
                data: {
                    id: params.id
                }
            }).then((result: any) => {
                const initMarker = [
                    {
                        latitude: result.latitude,
                        longitude: result.longitude,
                        width: 30,
                        height: 30,
                        iconPath: 'http://192.168.2.248/assets/mini/location.png',
                        callout: {
                            content: result.title,
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
                setCommunityData({ ...result, marker: initMarker })

            })
        }
    }, [])

    const valueFilter = (value, unit: string = '') => {
        return value ? `${value}${unit}` : '暂无'
    }

    return (
        <View className="community">
            <NavBar title={communityData.title} back={true}></NavBar>
            <ScrollView style={{ maxHeight: contentHeight }} scrollY>
                <View className="house-album">

                </View>
                <View className="community-content view-content">
                    <View className="community-item">
                        <View className="title">{communityData.title}</View>
                        <View className="address">
                            <View className="name">{communityData.area.name}-{communityData.address}</View>
                            <View className="iconfont iconaddress">地址</View>
                        </View>
                        <View className="community-price mt20">
                            <View className="price-reffer">
                                参考均价<Text className="price">{communityData.price}</Text>{PRICE_TYPE[communityData.price_type]}
                            </View>
                            {/* <View className="price-ratio">
                                环比上月<Text className="tip-color">0.12%</Text>
                            </View> */}
                        </View>
                        <View className="community-house mt20">
                            <View className="community-house-item">
                                <View className="count">
                                    <Text>{communityData.house_num}</Text>
                                    <Text className="unit">套</Text>
                                </View>
                                <View className="link">
                                    <Text>二手房源</Text>
                                    <Text className="iconfont iconarrow-right-bold"></Text>
                                </View>
                            </View>
                            <View className="split-line"></View>
                            <View className="community-house-item">
                                <View className="count">
                                    <Text>{communityData.rent_num}</Text>
                                    <Text className="unit">套</Text>
                                </View>
                                <View className="link">
                                    <Text>在租房源</Text>
                                    <Text className="iconfont iconarrow-right-bold"></Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View className="community-item">
                        <View className="header">
                            <Text>小区概括</Text>
                        </View>
                        <View className="community-info">
                            <View className="community-info-item">
                                <Text className="label">建筑年代</Text>
                                <Text className="value">{valueFilter(communityData.build_year)}</Text>
                            </View>
                            <View className="community-info-item">
                                <Text className="label">建筑类型</Text>
                                <Text className="value">板楼</Text>
                            </View>
                            <View className="community-info-item">
                                <Text className="label">物业费</Text>
                                <Text className="value">{valueFilter(communityData.fangHouseInfo.property_fee, '元/㎡/月')}</Text>
                            </View>
                            <View className="community-info-item">
                                <Text className="label">房屋总数</Text>
                                <Text className="value">{valueFilter(communityData.fangHouseInfo.plan_households, '户')}</Text>
                            </View>
                            <View className="community-info-item">
                                <Text className="label">楼栋总数</Text>
                                <Text className="value">{valueFilter(communityData.fangHouseInfo.building_number, '栋')}</Text>
                            </View>
                            <View className="community-info-item">
                                <Text className="label">停车位</Text>
                                <Text className="value">{valueFilter(communityData.fangHouseInfo.parking_number)}</Text>
                            </View>
                        </View>
                    </View>
                    <View className="community-item">
                        <View className="header">
                            <Text>小区位置及周边</Text>
                        </View>
                        <View className="community-map">
                            <Map
                                id="communityMap"
                                className="map"
                                latitude={communityData.latitude}
                                longitude={communityData.longitude}
                                enableZoom={false}
                                markers={communityData.marker}
                            >
                            </Map>
                        </View>
                    </View>
                    <View className="community-item">
                        <Text className="small-desc">
                            免责声明：本网站不保证所有小区信息完全真实可靠，最终以政府部门登记备案为准，请谨慎核查。
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default CommunityIndex