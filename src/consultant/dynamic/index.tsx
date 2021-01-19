import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import map from 'lodash/map'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { toUrlParam } from '@utils/urlHandler'
import { INIT_PAGE, IPage, getTotalPage } from '@utils/page'
import './index.scss'

interface IParam {
    currentPage: number
}

const INIT_PARAM: IParam = { currentPage: 1 }

const HouseDynamic = () => {
    const PAGE_LIMIT = 10
    const { contentHeight } = useNavData()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [dynamic, setDynamic] = useState<any[]>([])

    useEffect(() => {
        fetchDynamic()
    }, [param.currentPage])

    const fetchDynamic = () => {
        app.request({
            url: app.testApiUrl(api.getDiscoverList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT
            }
        }).then((result: any) => {
            setDynamic([...dynamic, ...result.data])
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

    const handleDynamicDelete = (itemId: string) => {
        console.log(itemId)
    }
    const toRelease = () => {
        Taro.navigateTo({
            url: '/consultant/release/index'
          })
    }
    return (
        <View className="dynamic">
            <View className="dynamic-content">
                <ScrollView
                    className="dynamic-list"
                    scrollY
                    style={{ height: contentHeight - 60 }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {
                        dynamic.map((item: any) => (
                            <View className="dynamic-item" key={item.id}>
                                <View className="dynamic-flex">
                                    <View className="dynamic-title">{item.fangHouse.title}</View>
                                    <View className="more">
                                        <Text>更多</Text>
                                        <Text className="iconfont iconarrow-right-bold"></Text>
                                    </View>
                                </View>
                                <View className="dynamic-text">{item.content}</View>
                                <View className="dynamic-media">
                                    {
                                        item.type === 'image' ?
                                            <View className="media-image">
                                                {
                                                    item.media.map((imageItem: any, index: number) => (
                                                        <View className="item-image" key={index}>
                                                            <Image
                                                                src={imageItem.image_path}
                                                                mode="aspectFill"
                                                                onClick={() => handleImagePreview(item.media, imageItem.image_path)}
                                                            />
                                                        </View>
                                                    ))
                                                }
                                            </View> :
                                            <View className="media-video" onClick={() => toHouseVideo(item.media)}>
                                                <Image src={item.media.poster_path} mode="aspectFill" />
                                                <Text className="iconfont iconvideo"></Text>
                                            </View>
                                    }
                                </View>
                                <View className="dynamic-action clearfix">
                                    <View className="action-item" onClick={() => handleDynamicDelete(item.id)}>
                                        <View className="btn btn-plain">删除</View>
                                    </View>
                                </View>
                                <View className="dynamic-flex dynamic-check">
                                    <View className="check-time">2021-01-18 16:06:21</View>
                                    <View className="check-status">等待审核</View>
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
                <View className="dynamic-release" onClick={toRelease}>
                    <View className="btn btn-primary">发布动态</View>
                </View>
            </View>
        </View>
    )
}

export default HouseDynamic