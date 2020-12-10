import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, RichText } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { formatTimestamp } from '@utils/index'
import './index.scss'

const NewsDetail = () => {
    const params: any = getCurrentInstance().router?.params
    const [newsData, setNewsData] = useState<any>({ newsInfo: {} })

    useShareTimeline(() => {
        return {
            title: newsData.title,
            path: `/news/detail/index?id=${params.id}`
        }
    })

    useShareAppMessage(() => {
        return {
            title: newsData.title,
            path: `/news/detail/index?id=${params.id}`
        }
    })
    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getNewsById),
            data: {
                id: params.id
            }
        }).then((result: any) => {
            setNewsData(result)
            Taro.setNavigationBarTitle({ title: result.title })
        })
    }, [])

    return (
        <View className="news-detail">
            <View className="news-detail-content view-content">
                <View className="header">
                    <Text className="title">{newsData.title}</Text>
                </View>
                <View className="small-desc">
                    <Text>{newsData.author}</Text>
                    <Text className="ml16">{newsData.modified && formatTimestamp(newsData.modified)}</Text>
                </View>
                <View className="content">
                    {
                        newsData.newsInfo.content &&
                        <RichText nodes={newsData.newsInfo.content.replace(/img/ig, 'img style="width: 100%; height: auto;"')}></RichText>
                    }
                </View>
            </View>
        </View>
    )
}

export default NewsDetail