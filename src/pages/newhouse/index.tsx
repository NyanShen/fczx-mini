import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'

import NavBar from '@components/navbar/index'
import './index.scss'
import '../../styles/common/search-tab.scss'
import useNavData from '@hooks/useNavData'

const NewHouse = () => {
    const { appHeaderHeight } = useNavData()
    return (
        <View className="newhouse">
            <NavBar title="新房" back={true} />
            <View className="fixed-top" style={{ top: appHeaderHeight }}>
                <View className="newhouse-header view-content">
                    <View className="newhouse-search">
                        <Text className="iconfont iconsearch"></Text>
                        <Text className="newhouse-search-text placeholder">请输入楼盘名称或地址</Text>
                    </View>
                    <View className="newhouse-nav-right">
                        <Text className="iconfont iconmap"></Text>
                        <Text className="text">地图找房</Text>
                    </View>
                </View>
                <View className="search-tab">
                    <View className="search-tab-item">
                        <Text className="text">区域</Text>
                        <Text className="iconfont iconarrow-down-bold"></Text>
                    </View>
                    <View className="search-tab-item">
                        <Text className="text">区域</Text>
                        <Text className="iconfont iconarrow-down-bold"></Text>
                    </View>
                </View>
                <View className="search-content">
                    <ScrollView className="search-content-item">
                        <View className="search-region">
                            <View className="region-type flex-item">
                                <View className="region-item actived">区域</View>
                            </View>
                            <ScrollView className="region-list flex-item">
                                <View className="region-item actived">不限</View>
                                <View className="region-item">樊城</View>
                            </ScrollView>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <View className="mask show"></View>
        </View>
    )
}
export default NewHouse