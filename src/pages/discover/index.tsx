import React, { useEffect, useState } from 'react'
import Taro, { makePhoneCall, useDidShow } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import map from 'lodash/map'

import api from '@services/api'
import app from '@services/request'
import ChatEvent from '@utils/event'
import storage from '@utils/storage'
import useNavData from '@hooks/useNavData'
import { formatPhoneCall } from '@utils/index'
import { toUrlParam } from '@utils/urlHandler'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import { INIT_PAGE, IPage, getTotalPage } from '@utils/page'
import './index.scss'

interface IParam {
    currentPage: number
}

const INIT_PARAM: IParam = { currentPage: 1 }

const Discover = () => {
    const PAGE_LIMIT = 10
    const { windowHeight } = useNavData()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [discover, setDiscover] = useState<any[]>([])
    const [showEmpty, setShowEmpty] = useState<boolean>(false)

    useDidShow(() => {
        const chat_unread: any[] = storage.getItem('chat_unread') || []
        ChatEvent.emitStatus('chat_unread', chat_unread)
    })

    useEffect(() => {
        fetchDiscover()
    }, [param.currentPage])

    const fetchDiscover = () => {
        app.request({
            url: app.testApiUrl(api.getDiscoverList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT
            }
        }).then((result: any) => {
            setDiscover([...discover, ...result.data])
            const totalPage = getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            if (totalPage <= INIT_PARAM.currentPage) {
                setShowEmpty(true)
            } else {
                setShowEmpty(false)
            }
            setPage({
                totalCount: result.pagination.totalCount,
                totalPage
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

    const handleImagePreview = (images: any[], image_path: string) => {
        Taro.previewImage({
            urls: map(images, 'image_path'),
            current: image_path
        })
    }
    const toHouseVideo = (video: any) => {
        const videoParam = {
            image_path: video.poster_image,
            video_path: video.video_path
        }
        const paramString = toUrlParam({
            video: JSON.stringify(videoParam)
        })
        Taro.navigateTo({
            url: `/house/new/video/index${paramString}`
        })
    }

    const toChatRoom = (discoverItem: any) => {
        const { id, title, price, price_type, image_path } = discoverItem.fangHouse
        const paramString = toUrlParam({
            messageType: '3',
            fromUserId: discoverItem.author.id,
            toUser: JSON.stringify(discoverItem.author),
            content: JSON.stringify({
                id,
                title,
                price,
                price_type,
                image_path,
                areaName: discoverItem.fangHouse.area.name
            })
        })
        Taro.navigateTo({
            url: `/chat/room/index${paramString}`
        })
    }

    const handlePhoneCall = (mobile: string) => {
        makePhoneCall({
            phoneNumber: formatPhoneCall(mobile)
        })
    }
    return (
        <View className="discover">
            {
                discover.length > 0 ?
                    <View className="discover-content">
                        <ScrollView
                            className="discover-list"
                            scrollY
                            style={{ maxHeight: windowHeight }}
                            lowerThreshold={40}
                            onScrollToLower={handleScrollToLower}
                        >
                            {
                                discover.map((item: any, index: number) => (
                                    <View className="discover-item" key={index}>
                                        <View className="discover-title">
                                            <View className="discover-profile">
                                                <Image src={item.fangHouse.image_path} mode="aspectFill" />
                                            </View>
                                            <View className="discover-header">
                                                <View className="header-item">
                                                    <View className="title">{item.fangHouse.title}</View>
                                                    <View className="tags">
                                                        <Text className="tags-item">{SALE_STATUS[item.fangHouse.sale_status]}</Text>
                                                    </View>
                                                </View>
                                                <View className="header-item">
                                                    <View className="subtitle">{item.fangHouse.price}{PRICE_TYPE[item.fangHouse.price_type]}</View>
                                                    <View className="describ">
                                                        <Text className="describ-text">{item.fangHouse.area.name}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <View className="discover-digest">{item.content}</View>
                                        <View className="discover-media">
                                            {
                                                item.type === 'image' ?
                                                    <View className="media-image">
                                                        {
                                                            item.media.map((imageItem: any, index: number) => {
                                                                if (index <= 3) {
                                                                    return (
                                                                        <View className="item-image" key={index}>
                                                                            <Image
                                                                                src={imageItem.image_path}
                                                                                mode="aspectFill"
                                                                                onClick={() => handleImagePreview(item.media, imageItem.image_path)}
                                                                            />
                                                                            {
                                                                                index == 2 && <Text className="item-count">共{item.media.length}张</Text>
                                                                            }
                                                                        </View>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </View> :
                                                    <View className="media-video" onClick={() => toHouseVideo(item.media)}>
                                                        <Image src={item.media.poster_path} mode="aspectFill" />
                                                        <Text className="iconfont iconvideo"></Text>
                                                    </View>
                                            }
                                        </View>
                                        <View className="discover-author">
                                            <View className="author-profile">
                                                <Image src={item.author.avatar} mode="aspectFill" />
                                            </View>
                                            <View className="author-name">
                                                <Text className="name">{item.author.nickname}</Text>
                                            </View>
                                            <View className="author-agent"></View>
                                            <View className="author-chat">
                                                <View className="chat-item" onClick={() => toChatRoom(item)}>
                                                    <Text className="iconfont iconmessage"></Text>
                                                </View>
                                                <View className="chat-item" onClick={() => handlePhoneCall(item.author.mobile)}>
                                                    <Text className="iconfont iconcall"></Text>
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
                    </View> :
                    <View className="empty-container">
                        <View>暂无动态</View>
                    </View>
            }
        </View>
    )
}

export default Discover