import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import { toUrlParam } from '@utils/urlHandler'
import { fetchUserData } from '@services/login'
import { PRICE_TYPE, SURROUND_TABS, ISurroundTab, INIT_SURROUND_TAB } from '@constants/house'

import '@styles/common/house.scss'
import '@styles/common/house-album.scss'
import '@house/new/surround/index.scss'
import './index.scss'
import { getStaticMap } from '@utils/map'

interface IAlbumSwiper {
    albumId: string,
    swiperIndex: number
}

const INIT_ALBUM_SWIPER = {
    albumId: '',
    swiperIndex: 0
}

const INIT_HOUSE_DATA = {
    id: '',
    title: '',
    tags: [],
    marker: [],
    area: {},
    imagesData: {},
    fangHouseInfo: {},
}
const imageId = "image_1"

const CommunityIndex = () => {

    let params: any = getCurrentInstance().router?.params
    const [communityData, setCommunityData] = useState<any>(INIT_HOUSE_DATA)
    const [albumSwiper, setAlbumSwiper] = useState<IAlbumSwiper>(INIT_ALBUM_SWIPER)

    useShareTimeline(() => {
        return {
            title: communityData.title,
            path: `/house/community/index/index?id=${communityData.id}&share=true`
        }
    })

    useShareAppMessage(() => {
        return {
            title: communityData.title,
            imageUrl: communityData.image_path,
            path: `/house/community/index/index?id=${communityData.id}&share=true`
        }
    })
    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getCommunityById),
            data: {
                id: params.id
            }
        }).then((result: any) => {
            const static_map = getStaticMap(result.latitude, result.longitude)
            setCommunityData({ ...result, static_map: static_map })
            const video = result.imagesData.video
            if (video) {
                setAlbumSwiper({ albumId: video.id, swiperIndex: 0 })
            } else {
                setAlbumSwiper({ albumId: imageId, swiperIndex: 0 })
            }
            Taro.setNavigationBarTitle({
                title: result.title
            })
        })
    }, [])

    const onSwiperChange = (event) => {
        let swiperIndex = event.detail.current;
        let currentItem = event.detail.currentItemId.split(',');
        let albumId = currentItem[0];
        setAlbumSwiper({
            albumId,
            swiperIndex
        })
    }

    const switchAlbum = (albumId: string, swiperIndex: number) => {
        setAlbumSwiper({
            albumId,
            swiperIndex
        })
    }

    const toHouseModule = (module: string, checkLogin: boolean = false) => {
        const paramString = toUrlParam({
            id: communityData.id,
            title: communityData.title
        })
        const targetUrl = `/house/new/${module}/index${paramString}`
        if (checkLogin) {
            fetchUserData(targetUrl)
                .then(() => {
                    Taro.navigateTo({ url: targetUrl })
                })
            return
        }
        Taro.navigateTo({ url: targetUrl })
    }

    const toHouseVideo = (video: any) => {
        const paramString = toUrlParam({
            id: communityData.id,
            title: communityData.title,
            video: JSON.stringify(video)
        })
        Taro.navigateTo({
            url: `/house/new/video/index${paramString}`
        })
    }

    const toHouseSurround = (currentTab: ISurroundTab = INIT_SURROUND_TAB) => {
        const { id, title, latitude, longitude } = communityData
        const paramString = toUrlParam({
            id,
            title: title,
            latitude,
            longitude,
            tab: JSON.stringify(currentTab),
        })
        Taro.navigateTo({
            url: `/house/new/surround/index${paramString}`
        })
    }

    const toList = (name: string) => {
        Taro.navigateTo({
            url: `/house/${name}/list/index?title=${communityData.title}`
        })
    }

    const valueFilter = (value, unit: string = '') => {
        return value ? `${value}${unit}` : '暂无'
    }

    const renderVideo = (video: any) => {
        return (
            <SwiperItem
                itemId={video.id}
                onClick={() => toHouseVideo(video)}
            >
                <Image className="taro-image" src={video.image_path}></Image>
                <Text className="icon-vedio"></Text>
            </SwiperItem>
        )
    }

    const renderVideoTab = (video: any) => {
        return (
            <Text
                className={classnames('album-text-item', video.id == albumSwiper.albumId && 'album-text-actived')}
                onClick={() => switchAlbum(video.id, 0)}
            >视频</Text>
        )
    }

    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <Text className="price">待定</Text>
        } else {
            return <Text>参考均价<Text className="price">{price}</Text>{PRICE_TYPE[price_type]}</Text>
        }
    }

    return (
        <View className="community">
            <View className="house-album">
                <Swiper
                    style={{ height: '225px' }}
                    current={albumSwiper.swiperIndex}
                    onChange={onSwiperChange}
                >
                    {communityData.imagesData.video && renderVideo(communityData.imagesData.video)}
                    <SwiperItem itemId={imageId} onClick={() => toHouseModule('album')}>
                        <Image className="taro-image" src={communityData.image_path}></Image>
                    </SwiperItem>
                </Swiper>
                <View className="album-count">共{communityData.imagesData.imageCount}张</View>
                <View className="album-text">
                    {communityData.imagesData.video && renderVideoTab(communityData.imagesData.video)}
                    <Text
                        className={classnames('album-text-item', imageId == albumSwiper.albumId && 'album-text-actived')}
                        onClick={() => switchAlbum(imageId, 1)}
                    >图片</Text>
                </View>
            </View>
            <View className="community-content view-content">
                <View className="community-item">
                    <View className="title">{communityData.title}</View>
                    <View className="address" onClick={() => toHouseSurround(INIT_SURROUND_TAB)}>
                        <View className="name">{communityData.area.name}-{communityData.address}</View>
                        <View className="iconfont iconaddress">地址</View>
                    </View>
                    <View className="community-price mt20">
                        <View className="price-reffer">
                            {renderPrice(communityData.price, communityData.price_type)}
                        </View>
                        {/* <View className="price-ratio">
                                环比上月<Text className="tip-color">0.12%</Text>
                            </View> */}
                    </View>
                    <View className="community-house mt20">
                        <View className="community-house-item" onClick={() => toList('esf')}>
                            <View className="count">
                                <Text>{communityData.house_num}</Text>
                                <Text className="unit">套</Text>
                            </View>
                            <View className="link">
                                <Text>二手房源</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <View className="split-line"></View>
                        <View className="community-house-item" onClick={() => toList('rent')}>
                            <View className="count">
                                <Text>{communityData.rent_num}</Text>
                                <Text className="unit">套</Text>
                            </View>
                            <View className="link">
                                <Text>在租房源</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="community-item">
                    <View className="header">
                        <Text>小区概括</Text>
                    </View>
                    <View className="community-info">
                        <View className="community-info-item">
                            <Text className="label">建筑年代</Text>
                            <Text className="value">{valueFilter(communityData.build_year)}</Text>
                        </View>
                        <View className="community-info-item">
                            <Text className="label">产权年限</Text>
                            <Text className="value">{valueFilter(communityData.fangHouseInfo.property_rights)}</Text>
                        </View>
                        <View className="community-info-item">
                            <Text className="label">物业费</Text>
                            <Text className="value">{valueFilter(communityData.fangHouseInfo.property_fee, '元/㎡/月')}</Text>
                        </View>
                        <View className="community-info-item">
                            <Text className="label">房屋总数</Text>
                            <Text className="value">{valueFilter(communityData.fangHouseInfo.plan_households, '户')}</Text>
                        </View>
                        <View className="community-info-item">
                            <Text className="label">楼栋总数</Text>
                            <Text className="value">{valueFilter(communityData.fangHouseInfo.building_number, '栋')}</Text>
                        </View>
                        <View className="community-info-item">
                            <Text className="label">停车位</Text>
                            <Text className="value">{valueFilter(communityData.fangHouseInfo.parking_number)}</Text>
                        </View>
                    </View>
                </View>
                <View className="community-item">
                    <View className="header">
                        <Text>小区位置及周边</Text>
                    </View>
                    <View className="surround-wrapper">
                        <View className="map">
                            <Image className="taro-image" src={communityData.static_map} mode="center"></Image>
                            <View className="map-label">
                                <View className="text">{communityData.title}</View>
                                <View className="iconfont iconmap"></View>
                            </View>
                        </View>
                        <View className="surround-tabs">
                            {
                                SURROUND_TABS.map((item: any, index: number) => (
                                    <View
                                        key={index}
                                        className={classnames('tabs-item')}
                                        onClick={() => toHouseSurround(item)}
                                    >
                                        <Text className={classnames('iconfont', item.icon)}></Text>
                                        <Text className="text">{item.name}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                </View>
                <View className="community-item">
                    <Text className="small-desc">
                        免责声明：本网站不保证所有小区信息完全真实可靠，最终以政府部门登记备案为准，请谨慎核查。
                        </Text>
                </View>
            </View>
        </View>
    )
}

export default CommunityIndex