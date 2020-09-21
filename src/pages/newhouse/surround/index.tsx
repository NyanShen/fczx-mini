import React from 'react'
import { View, Text, Map, CoverView } from "@tarojs/components"

import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'

import './index.scss'

const houseSurround = () => {
    const { contentHeight } = useNavData()

    const markers: any = [
        {
            id: '1',
            latitude: '32.093051',
            longitude: '112.133937',
            width: 50,
            height: 50,
            iconPath: 'http://192.168.2.248/assets/mini/location.png'
        }
    ]

    return (
        <View className="surround">
            <NavBar title="楼盘周边" back={true} />
            <View className="surround-wrapper" style={{height: contentHeight}}>
                <Map
                    className="surround-map"
                    latitude={32.093051}
                    longitude={112.133937}
                    markers={markers}
                    enableZoom={false}
                >
                    <CoverView>
                        <CoverView marker-id="1"></CoverView>
                        <CoverView marker-id="2"></CoverView>
                    </CoverView>
                </Map>
                <View className="surround-tabs">
                    <View className="tabs-item">
                        <Text className="iconfont icontraffic"></Text>
                        <Text className="text">交通</Text>
                    </View>
                    <View className="tabs-item">
                        <Text className="iconfont iconeducation"></Text>
                        <Text className="text">学校</Text>
                    </View>
                    <View className="tabs-item">
                        <Text className="iconfont iconbank"></Text>
                        <Text className="text">银行</Text>
                    </View>
                    <View className="tabs-item">
                        <Text className="iconfont iconyiyuan"></Text>
                        <Text className="text">医院</Text>
                    </View>
                    <View className="tabs-item">
                        <Text className="iconfont iconShopping"></Text>
                        <Text className="text">购物</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default houseSurround