import React from 'react'
import { View, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import './index.scss'

const NewsDetail = () => {
    return (
        <View className="news-detail">
            <NavBar title="君瑞城十月工程进度|抓住黄金施工期 加速度前进！" back={true}></NavBar>
            <View className="news-detail-content view-content">
                <View className="header">
                    <Text className="title">君瑞城十月工程进度|抓住黄金施工期 加速度前进！</Text>
                </View>
                <View className="small-desc">
                    <Text>房产在线</Text>
                    <Text className="ml16">2020-10-13 17:50:55</Text>
                </View>
                <View className="content">
                    内容
                </View>
            </View>
        </View>
    )
}

export default NewsDetail