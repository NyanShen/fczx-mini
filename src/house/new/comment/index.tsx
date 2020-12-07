import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { fetchUserData } from '@services/login'
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
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [commentList, setCommentList] = useState<any[]>([])
    const [likeComment, setLikeComment] = useState<string[]>([])

    useReady(() => {
        Taro.setNavigationBarTitle({ title: `${houseTitle}-全部评论` })
    })

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

    const handleViewImage = (imagePath: string) => {
        Taro.previewImage({
            urls: [imagePath],
            current: imagePath
        })
    }

    const handleCommentZan = (item: any) => {
        if (likeComment.includes(item.id)) {
            return
        }
        app.request({
            url: app.areaApiUrl(api.likeHouseComment),
            method: 'POST',
            data: {
                id: item.id
            }
        }, { loading: false }).then(() => {
            setLikeComment([...likeComment, item.id])
        })
    }

    return (
        <View className="comment">
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
                                    <Image src={item.user.avatar}></Image>
                                </View>
                                <View className="comment-text">
                                    <View className="name">{item.user.nickname}</View>
                                    <View className="text">{item.content}</View>
                                    {
                                        item.image_path &&
                                        <View className="comment-image">
                                            <Image
                                                src={item.image_path}
                                                mode="aspectFill"
                                                onClick={() => handleViewImage(item.image_path)}
                                            />
                                        </View>
                                    }
                                    <View className="comment-bottom">
                                        <View className="time">{formatTimestamp(item.modified)}</View>
                                        <View className="action">
                                            <View className="action-item" onClick={() => handleCommentZan(item)}>
                                                {
                                                    likeComment.includes(item.id) ?
                                                        <View className="actived">
                                                            <Text className="iconfont iconzan_hv"></Text>
                                                            <Text className="count">({Number(item.like_num) + 1})</Text>
                                                        </View> :
                                                        <View className="none">
                                                            <Text className="iconfont iconzan"></Text>
                                                            <Text className="count">({item.like_num})</Text>
                                                        </View>
                                                }
                                            </View>
                                        </View>
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