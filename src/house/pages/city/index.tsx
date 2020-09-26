import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const INIT_VIEW = 'hot'
const INIT_CITY_DATA = { city: {}, hotCity: [] }

const City = () => {
    const { appHeaderHeight, contentHeight } = useNavData()
    const [viewInto, setViewInto] = useState<string>(INIT_VIEW)
    const [cityData, setCityData] = useState<any>(INIT_CITY_DATA)

    useEffect(() => {
        app.request({
            url: app.testApiUrl(api.getCityList)
        }).then((result: any) => {
            setCityData(result || [])
        })
    }, [])

    const handleCityClick = (city: any) => {
        storage.setItem('city', city)
        Taro.navigateBack({
            delta: 1
        })
    }

    const renderCityList = (cityList: any) => {
        return (
            <View className="city-item-list">
                {
                    cityList.length > 0 &&
                    cityList.map((item: any, index: number) => (
                        <View
                            key={index}
                            className="city-name"
                            onClick={() => handleCityClick(item)}
                        >{item.short_name}
                        </View>
                    ))
                }
            </View>
        )
    }

    return (
        <View className="city">
            <NavBar title="切换城市" back={true}></NavBar>
            {/* <View className="fixd city-search">
                <View className="search-content">
                    <Text className="iconfont iconsearch"></Text>
                    <Input placeholder="请输入城市名" />
                </View>
            </View> */}
            <ScrollView
                scrollY
                className="city-content"
                style={{ height: contentHeight }}
                scrollIntoView={viewInto}
            >
                <View className="city-list">
                    <View className="city-item">
                        <View className="city-item-order" id={INIT_VIEW}>热门城市</View>
                        {renderCityList(cityData.hotCity)}
                    </View>
                    {
                        Object.keys(cityData.city).map((key: string, index: number) => (
                            <View className="city-item" key={index}>
                                <View className="city-item-order" id={key}>{key}</View>
                                {renderCityList(cityData.city[key])}
                            </View>
                        ))
                    }
                </View>
            </ScrollView>
            <View className="city-order" style={{ top: appHeaderHeight, height: contentHeight }}>
                <View className="city-order-list">
                    <View
                        className="order-item"
                        onClick={() => setViewInto(INIT_VIEW)}
                    >热门
                    </View>
                    {
                        Object.keys(cityData.city).map((key: string, index: number) => (
                            <View
                                key={index}
                                className="order-item"
                                onClick={() => setViewInto(key)}
                            >{key}
                            </View>
                        ))
                    }
                </View>
            </View>
        </View>
    )
}

export default City