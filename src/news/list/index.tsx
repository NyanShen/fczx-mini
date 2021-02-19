import React, { useEffect, useState } from 'react'
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { ScrollView, View, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'
import { PROJECT_NAME } from '@constants/global'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import NavBar from '@/components/navbar'
import './index.scss'

interface IParam {
    newsCateId: string
    currentPage: number
}

const INIT_PARAM = { newsCateId: '', currentPage: 1 }

const NewsList = () => {
    const PAGE_LIMIT = 10
    const { contentHeight } = useNavData()
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [news, setNews] = useState<any[]>([])
    const [newsCate, setNewsCate] = useState<any[]>([])

    useShareTimeline(() => {
        return {
            title: `${PROJECT_NAME}-咨询`,
            path: `/news/list/index`
        }
    })

    useShareAppMessage(() => {
        return {
            title: `${PROJECT_NAME}-咨询`,
            path: `/news/list/index`
        }
    })

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getNewsCateList),
        }, { loading: false }).then((result: any) => {
            setNewsCate(result)
            setParam({
                newsCateId: result[0].id,
                currentPage: INIT_PARAM.currentPage
            })
        })
    }, [])

    useEffect(() => {
        if (param.newsCateId) {
            app.request({
                url: app.areaApiUrl(api.getNewsList),
                data: {
                    page: param.currentPage,
                    limit: PAGE_LIMIT,
                    news_cate_id: param.newsCateId
                }
            }).then((result: any) => {
                setNews(result.data)
                setPage({
                    totalCount: result.pagination.totalCount,
                    totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
                })
            })
        }
    }, [param])

    const handleNewsCateChange = (id: string) => {
        setParam({
            newsCateId: id,
            currentPage: INIT_PARAM.currentPage
        })
    }

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

    const toNewsDetail = (item: any) => {
        Taro.navigateTo({ url: `/news/detail/index?id=${item.id}` })
    }

    return (
        <View className="news">
            <NavBar title="资讯列表" />
            <View className="news-cate">
                <ScrollView scrollX>
                    {
                        newsCate.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleNewsCateChange(item.id)}
                                className={classnames('news-cate-item', param.newsCateId === item.id && 'actived')}
                            >{item.name}</View>
                        ))
                    }
                </ScrollView>
            </View>
            <View className="news-content">
                <ScrollView
                    scrollY
                    style={{ maxHeight: `${contentHeight - 42}px` }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {
                        news.map((item: any, index: number) => (
                            <View key={index} className="news-item" onClick={() => toNewsDetail(item)}>
                                <View className="item-text">
                                    <View className="title">{item.title}</View>
                                    <View className="small-desc mt20">
                                        <Text>{item.author}</Text>
                                        <Text className="date">{formatTimestamp(item.modified)}</Text>
                                    </View>
                                </View>
                                {
                                    item.image_path &&
                                    <View className="item-image">
                                        <Image className="taro-image" src={item.image_path} mode="aspectFill"></Image>
                                    </View>
                                }
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

export default NewsList