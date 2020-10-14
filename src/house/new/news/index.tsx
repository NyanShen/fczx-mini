import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'
import './index.scss'

const HouseNewsList = () => {
    const { contentHeight } = useNavData()
    const [news] = useState<any[]>([])

    const toHouseNewsDetail = (newsId: string) => {
        Taro.navigateTo({
            url: `/house/new/news/detail?id=${newsId}`
        })
    }
    return (
        <View className="house-news">
            <NavBar title="楼盘动态" back={true}></NavBar>
            <View className="news-content view-content">
                <ScrollView scrollY style={{ maxHeight: contentHeight }}>
                    {
                        news.map((item: any, index: number) => (
                            <View key={index} className="news-item" onClick={() => toHouseNewsDetail(item.id)}>
                                <View className="header">
                                    <Text className="tag">{item.newsCate.name}</Text>
                                    <Text className="title">{item.title}</Text>
                                </View>
                                <View className="sub-title">{item.sub_title}</View>
                                <View className="publish small-desc">
                                    <View>{item.author}</View>
                                    <View className="date">{formatTimestamp(item.modified)}</View>
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default HouseNewsList