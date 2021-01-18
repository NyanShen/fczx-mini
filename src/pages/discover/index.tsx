import React, { useEffect, useState } from 'react'
import { View, Image, Video, Text, ScrollView } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { INIT_PAGE, IPage, getTotalPage } from '@utils/page'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import useNavData from '@hooks/useNavData'
import './index.scss'

interface IParam {
    currentPage: number
}

const INIT_PARAM: IParam = { currentPage: 1 }

const Discover = () => {
    const PAGE_LIMIT = 10
    const { contentHeight } = useNavData()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [discover, setDiscover] = useState<any[]>([])
    const [showEmpty, setShowEmpty] = useState<boolean>(false)

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
            setPage({
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
    return (
        <View className="discover">
            {
                discover.length > 0 ?
                    <View className="discover-content">
                        <ScrollView
                            className="discover-list"
                            scrollY
                            style={{ height: contentHeight }}
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
                                                            item.media.map((imageItem: any, index: number) => (
                                                                <View className="item-image" key={index}>
                                                                    <Image src={imageItem.image_path} mode="aspectFill" />
                                                                    { index === 2 && <View className="item-count">共{index + 1}张</View>}
                                                                </View>
                                                            ))
                                                        }
                                                    </View> :
                                                    <View className="media-video">
                                                        <Video
                                                            src={item.media.video_path}
                                                            controls={true}
                                                            autoplay={false}
                                                            poster={item.media.poster_path}
                                                            id='video'
                                                            loop={false}
                                                            muted={false}
                                                        />
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
                    </View>:
                    <View className="empty-container">
                        <View>暂无动态</View>
                    </View>
            }
        </View>
    )
}

export default Discover