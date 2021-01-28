import React, { useEffect, useState } from 'react'
import Taro, { getCurrentPages, useDidShow } from '@tarojs/taro'
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

    useDidShow(() => {
        const pages: any = getCurrentPages()
        const currPageData: any = pages[pages.length - 1].data
        const isUpdate = currPageData.isUpdate
        if (isUpdate) {
            fetchDynamic()
        }
    })

    useEffect(() => {
        fetchDynamic(param.currentPage)
    }, [param.currentPage])

    const fetchDynamic = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getUserDynamic),
            data: {
                page: currentPage,
                limit: PAGE_LIMIT
            }
        }).then((result: any) => {
            if (currentPage === INIT_PARAM.currentPage) {
                setDynamic(result.data)
            } else {
                setDynamic([...dynamic, ...result.data])
            }
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
        const pages: any = getCurrentPages()
        const prevPage: any = pages[pages.length - 1]
        prevPage.setData({ isUpdate: false })
    }
    const toHouseVideo = (face_path: string, video_path: string) => {
        const videoParam = {
            image_path: face_path,
            video_path
        }
        const paramString = toUrlParam({
            video: JSON.stringify(videoParam)
        })
        Taro.navigateTo({
            url: `/house/new/video/index${paramString}`
        })
    }

    const handleDynamicDelete = (itemId: string) => {
        app.request({
            url: app.areaApiUrl(api.deleteUserDynamic),
            method: 'POST',
            data: {
                id: itemId
            }
        }).then(() => {
            Taro.showToast({
                title: '删除成功'
            })
            if (param.currentPage === INIT_PARAM.currentPage) {
                fetchDynamic()
            } else {
                setParam({
                    currentPage: param.currentPage + 1
                })
            }
        })
    }

    const toHouseModule = (fang_house_id: string) => {
        Taro.navigateTo({
            url: `/house/new/index/index?id=${fang_house_id}`
        })
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
                                <View className="dynamic-flex" onClick={() => toHouseModule(item.fangHouse.id)}>
                                    <View className="dynamic-title">{item.fangHouse.title}</View>
                                    <View className="more">
                                        <Text>更多</Text>
                                        <Text className="iconfont iconarrow-right-bold"></Text>
                                    </View>
                                </View>
                                <View className="dynamic-text">{item.content}</View>
                                <View className="dynamic-media">
                                    {
                                        item.video_path ?
                                            <View className="media-video" onClick={() => toHouseVideo(item.face_path, item.video_path)}>
                                                <Image src={item.face_path} mode="aspectFill" />
                                                <Text className="iconfont iconvideo"></Text>
                                            </View> :
                                            <View className="media-image">
                                                {
                                                    item.fangHouseCircleImage.map((imageItem: any, index: number) => (
                                                        <View className="item-image" key={index}>
                                                            <Image
                                                                src={imageItem.image_path}
                                                                mode="aspectFill"
                                                                onClick={() => handleImagePreview(item.fangHouseCircleImage, imageItem.image_path)}
                                                            />
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                    }
                                </View>
                                {/* <View className="dynamic-action clearfix">
                                </View> */}
                                <View className="dynamic-flex dynamic-check">
                                    <View className="check-time">2021-01-18 16:06:21</View>
                                    {/* <View className="check-status">等待审核</View> */}
                                    <View className="action-item" onClick={() => handleDynamicDelete(item.id)}>
                                        <View className="btn btn-plain">删除</View>
                                    </View>
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