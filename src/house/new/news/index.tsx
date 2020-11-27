import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { ScrollView, View, Text } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import './index.scss'
interface IParam {
    currentPage: number
}
const INIT_PARAM = { currentPage: 1 }
const HouseNewsList = () => {
    const PAGE_LIMIT = 10
    const { contentHeight } = useNavData()
    const router = getCurrentInstance().router
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [news, setNews] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getNewsList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                fang_house_id: router?.params.id
            }
        }).then((result: any) => {
            setNews(result.data)
            setPage({
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
        })
    }, [param])

    const handleScrollToLower = () => {
        if (page.totalPage > param.currentPage) {
            setParam({
                ...param,
                currentPage: param.currentPage + 1
            })
        } else {
            setShowEmpty(true)
        }
    }

    const toHouseNewsDetail = (newsId: string) => {
        Taro.navigateTo({
            url: `/house/new/news/detail?id=${newsId}`
        })
    }
    return (
        <View className="house-news">
            <View className="news-content">
                <ScrollView
                    scrollY
                    style={{ maxHeight: contentHeight }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
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
                    {
                        showEmpty &&
                        <View className="empty-container">
                            <Text>没有更多数据了</Text>
                        </View>
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default HouseNewsList