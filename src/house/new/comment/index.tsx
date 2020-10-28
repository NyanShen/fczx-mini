import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { fetchUserData } from '@services/login'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'
import { toUrlParam } from '@utils/urlHandler'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'

import './index.scss'

interface IParam {
    currentPage: number
}

const INIT_PARAM = { currentPage: 1 }

const HouseComment = () => {
    const PAGE_LIMIT = 10
    const router = getCurrentInstance().router
    const houseId = router?.params.id
    const houseTitle = router?.params.title
    const { contentHeight } = useNavData()
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [commentList, setCommentList] = useState<any[]>([])

    useEffect(() => {
        fetchHouseComment()
    }, [param.currentPage])


    const fetchHouseComment = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseComment),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                fang_house_id: houseId,
            }
        }).then((result: any) => {
            setCommentList([...commentList, ...result.data])
            setPage({
                ...page,
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
        })
    }

    const handleScrollToLower = () => {
        if (page.totalPage > param.currentPage) {
            setParam({
                currentPage: param.currentPage + 1
            })
        } else {
            setShowEmpty(true)
        }
    }
    const toHouseModule = (module: string) => {
        const paramString = toUrlParam({
            id: houseId,
            title: houseTitle
        })
        const targetUrl = `/house/new/${module}/index${paramString}`
        fetchUserData(targetUrl)
            .then(() => {
                Taro.navigateTo({ url: targetUrl })
            })
    }
    return (
        <View className="comment">
            <NavBar title={`${houseTitle}-全部评论`} back={true}></NavBar>
            <View className="comment-header">
                <View className="title view-content">全部评论({page.totalCount})</View>
            </View>
            <View className="comment-content">
                <ScrollView
                    className="comment-list"
                    scrollY
                    style={{ height: contentHeight - 80 }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {
                        commentList.map((item: any, index: number) => (
                            <View key={index} className="comment-item">
                                <View className="user-photo">
                                    <Image src={item.user.avatar} />
                                </View>
                                <View className="context">
                                    <View className="context-name">{item.user.nickname}</View>
                                    <View className="context-content">{item.content}</View>
                                    {
                                        item.image_path &&
                                        <View className="context-image">
                                            <Image src={item.image_path} mode="aspectFill" />
                                        </View>
                                    }
                                    <View className="context-footer">
                                        <View className="date">{formatTimestamp(item.modified, 'yy-MM-dd')}</View>
                                    </View>
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
            <View className="fixed comment-footer" onClick={() => toHouseModule('commentForm')}>
                <View className="btn btn-primary">我也要点评</View>
            </View>
        </View>
    )
}

export default HouseComment