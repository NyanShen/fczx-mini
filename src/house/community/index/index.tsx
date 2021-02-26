import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import { getStaticMap } from '@utils/map'
import { toHouseNew } from '@/router/router'
import { PRICE_TYPE, SURROUND_TABS, ISurroundTab, INIT_SURROUND_TAB } from '@constants/house'

import '@styles/common/house.scss'
import '@styles/common/house-album.scss'
import '@house/new/surround/index.scss'
import './index.scss'

interface IAlbumSwiper {
    albumTabs: any[],
    albumItems: any[],
    swiperIndex: number
}

const INIT_ALBUM_SWIPER = {
    albumTabs: [],
    albumItems: [],
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
                setAlbumSwiper({
                    albumTabs: [{ name: '视频' }, { name: '图片' }],
                    albumItems: [video, { image_path: result.image_path }],
                    swiperIndex: 0
                })
            } else {
                setAlbumSwiper({
                    albumTabs: [{ name: '图片' }],
                    albumItems: [{ image_path: result.image_path }],
                    swiperIndex: 0
                })
            }
            Taro.setNavigationBarTitle({
                title: result.title
            })
        })
    }, [])

    const onSwiperChange = (event: any) => {
        const swiperIndex = event.detail.current
        setAlbumSwiper({
            ...albumSwiper,
            swiperIndex
        })
    }

    const switchAlbum = (swiperIndex: number) => {
        if (albumSwiper.swiperIndex === swiperIndex) {
            return
        }
        setAlbumSwiper({
            ...albumSwiper,
            swiperIndex
        })
    }

    const toHouseModule = (module: string) => {
        const params = {
            id: communityData.id,
            title: communityData.title
        }
        toHouseNew(module, params)
    }

    const toHouseSurround = (currentTab: ISurroundTab = INIT_SURROUND_TAB) => {
        const { id, title, latitude, longitude } = communityData
        toHouseNew('Surround', { id, title, latitude, longitude, type: currentTab.type })
    }

    const toList = (name: string) => {
        Taro.navigateTo({
            url: `/house/${name}/list/index?title=${communityData.title}`
        })
    }

    const valueFilter = (value, unit: string = '') => {
        return value ? `${value}${unit}` : '暂无'
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
                {
                    albumSwiper.albumItems.length > 0 &&
                    <View className="house-album-content">
                        <Swiper
                            style={{ height: '250px' }}
                            current={albumSwiper.swiperIndex}
                            onChange={onSwiperChange}
                        >
                            {
                                albumSwiper.albumItems.map((item: any, index: number) => (
                                    <SwiperItem key={index} onClick={() => toHouseModule('Album')}>
                                        <Image className="taro-image" src={item.image_path}></Image>
                                        {item.video_path && <Text className="icon-vedio"></Text>}
                                    </SwiperItem>
                                ))
                            }
                        </Swiper>
                        <View className="album-count" onClick={() => toHouseModule('Album')}>
                            共{communityData.imagesData.imageCount}张
                        </View>
                        <View className="album-text">
                            {
                                albumSwiper.albumTabs.map((item: any, index: number) => (
                                    <Text
                                        key={index}
                                        className={classnames('album-text-item', index == albumSwiper.swiperIndex && 'album-text-actived')}
                                        onClick={() => switchAlbum(index)}
                                    >{item.name}</Text>
                                ))
                            }
                        </View>
                    </View>
                }
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