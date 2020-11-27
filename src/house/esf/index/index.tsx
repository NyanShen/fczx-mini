import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, makePhoneCall, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { ScrollView, View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE } from '@constants/house'
import { bMapTransQQMap, getStaticMap } from '@utils/map'
import '@styles/common/house.scss'
import '@styles/common/house-album.scss'
import '@styles/common/bottom-bar.scss'
import './index.scss'
import { toUrlParam } from '@utils/urlHandler'
const INIT_ESF_DATA = {
    esfImage: [],
    tags: [],
    area: {},
    user: {},
    fangHouse: {},
    fangRenovationStatus: {},
    fangDirectionType: {},
    fangPropertyType: {}
}

interface IAlbum {
    currentIdex: number
}

const INIT_ALNUM = {
    currentIdex: 0
}

const SOURCE_TYPE = {
    '1': '个人',
    '2': '经纪人'
}

const esfHouse = () => {
    const params: any = getCurrentInstance().router?.params
    const { contentHeight } = useNavData()
    const [open, setOpen] = useState<boolean>(false)
    const [album, setAlbum] = useState<IAlbum>(INIT_ALNUM)
    const [esfData, setEsfData] = useState<any>(INIT_ESF_DATA)

    useShareTimeline(() => {
        return {
            title: esfData.title,
            path: `/house/esf/index/index?id=${params.id}&share=true`
        }
    })

    useShareAppMessage(() => {
        return {
            title: esfData.title,
            imageUrl: esfData.image_path,
            path: `/house/esf/index/index?id=${params.id}&share=true`
        }
    })

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getEsfById),
            data: {
                id: params.id
            }
        }).then((result: any) => {
            const { latitude, longitude } = result.fangHouse
            const static_map = getStaticMap(latitude, longitude)
            setEsfData({ ...result, ...{ static_map: static_map } })
            Taro.setNavigationBarTitle({ title: result.title})
        })
    }, [])

    const onSwiperChange = (event) => {
        let swiperIndex = event.detail.current;
        setAlbum({
            currentIdex: swiperIndex
        })
    }

    const toCommunity = () => {
        Taro.navigateTo({
            url: `/house/community/index/index?id=${esfData.fangHouse.id}`
        })
    }

    const toChatRoom = () => {
        const { title, price, price_type } = esfData.fangHouse
        const { id, image_path, room, office, toilet, building_area } = esfData
        const paramString = toUrlParam({
            messageType: '4',
            fromUserId: esfData.user_id,
            toUser: JSON.stringify(esfData.user),
            content: JSON.stringify({
                id,
                title,
                price,
                price_type,
                image_path,
                room,
                office,
                toilet,
                building_area,
                areaName: esfData.area.name
            })
        })
        Taro.navigateTo({
            url: `/chat/room/index${paramString}`
        })
    }

    const handlePhoneCall = () => {
        makePhoneCall({
            phoneNumber: esfData.mobile.replace(/[^0-9]/ig, ""),
            fail: (err: any) => {
                if (err.errMsg == 'makePhoneCall:fail') {
                    Taro.showModal({
                        title: '联系电话',
                        content: esfData.mobile,
                        showCancel: false
                    })
                }
            }
        })
    }

    const toLocation = () => {
        const { latitude, longitude } = esfData.fangHouse
        const location = bMapTransQQMap(latitude, longitude)
        Taro.openLocation({
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            scale: 18,
            name: esfData.title,
            address: esfData.address
        })

    }

    const renderHouseDesc = (value: string) => {
        return value ? value : '暂无信息'
    }

    return (
        <View className="esf">
            <ScrollView style={{ maxHeight: contentHeight - 55 }} scrollY>
                <View className="house-album">
                    <Swiper
                        style={{ height: '225px' }}
                        current={album.currentIdex}
                        onChange={onSwiperChange}
                    >
                        {
                            esfData.esfImage.map((item: any, index: number) => (
                                <SwiperItem key={index} itemId={item.id} onClick={() => setOpen(true)}>
                                    <Image src={item.image_path}></Image>
                                </SwiperItem>
                            ))
                        }
                    </Swiper>
                    <View className="album-count">共{esfData.esfImage.length}张</View>
                </View>
                <View className="esf-item">
                    <View className="header">
                        <Text>{esfData.title}</Text>
                    </View>
                    <View className="address" onClick={toLocation}>
                        <View className="name">{esfData.area.name}-{esfData.address}</View>
                        <View className="iconfont iconaddress">地址</View>
                    </View>
                    <View className="esf-main-info">
                        <View className="main-item">
                            <Text className="value">{esfData.price_total}</Text>
                            <Text className="unit">万</Text>
                        </View>
                        <View className="main-item">
                            <Text className="value">{esfData.room}</Text>
                            <Text className="unit">室</Text>
                            <Text className="value">{esfData.office}</Text>
                            <Text className="unit">厅</Text>
                            <Text className="value">{esfData.toilet}</Text>
                            <Text className="unit">卫</Text>
                        </View>
                        <View className="main-item">
                            <Text className="value">{esfData.building_area}</Text>
                            <Text className="unit">㎡</Text>
                        </View>
                    </View>
                    <View className="tags">
                        {
                            esfData.tags.map((item: string, index: number) => (
                                <Text key={index} className="tags-item">{item}</Text>
                            ))
                        }
                    </View>
                </View>
                <View className="esf-item">
                    <View className="header">
                        <Text className="title">房源信息</Text>
                    </View>
                    <View className="esf-info-other">
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">单价</Text>
                                <Text className="value">{esfData.price_unit}元/㎡</Text>
                            </View>
                        </View>
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">楼层</Text>
                                <Text className="value">第{esfData.height_self}层/共{esfData.height_total}层</Text>
                            </View>
                            <View className="subitem">
                                <Text className="label">装修</Text>
                                <Text className="value">{esfData.fangRenovationStatus.name}</Text>
                            </View>
                        </View>
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">朝向</Text>
                                <Text className="value">{esfData.fangDirectionType.name}</Text>
                            </View>
                            <View className="subitem">
                                <Text className="label">年代</Text>
                                <Text className="value">{esfData.build_year}年</Text>
                            </View>
                        </View>
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">小区</Text>
                                <Text className="value">{esfData.fangHouse.title}</Text>
                            </View>
                            <View className="subitem link" onClick={toCommunity}>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                    </View>

                    <View className="header">
                        <Text className="title">房源描述</Text>
                    </View>
                    <View className="esf-info-item">
                        <View className="item-content">
                            {renderHouseDesc(esfData.description)}
                        </View>
                    </View>
                    <View className="esf-info-item">
                        <View className="sub-title">核心卖点</View>
                        <View className="item-content">
                            {renderHouseDesc(esfData.selling_point)}
                        </View>
                    </View>
                    <View className="esf-info-item">
                        <View className="sub-title">业主心态</View>
                        <View className="item-content">
                            {renderHouseDesc(esfData.attitude_point)}
                        </View>
                    </View>
                    <View className="esf-info-item">
                        <View className="sub-title">服务介绍</View>
                        <View className="item-content">
                            {renderHouseDesc(esfData.service_point)}
                        </View>
                    </View>
                </View>
                <View className="esf-item">
                    <View className="header">
                        <View>小区详情</View>
                        <View className="more" onClick={toCommunity}>
                            <Text>查看</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="community-content">
                        <View className="community-name">{esfData.fangHouse.title}</View>
                        <View className="community-info">
                            <View className="community-item">
                                <View className="label">参考均价</View>
                                <View className="value price-unit">
                                    {esfData.fangHouse.price}{PRICE_TYPE[esfData.fangHouse.price_type]}
                                </View>
                            </View>
                            <View className="community-item">
                                <View className="label">小区地址</View>
                                <View className="value">{esfData.fangHouse.address}</View>
                            </View>
                        </View>
                        <View className="map" onClick={toLocation}>
                            <Image className="map-image" src={esfData.static_map} mode="center"></Image>
                            <View className="map-label">
                                <View className="text">{esfData.fangHouse.title}</View>
                                <View className="iconfont iconmap"></View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="esf-item">
                    <Text className="small-desc">
                        免责声明：房源信息由网站用户提供，其真实性、合法性由信息提供者负责，最终以政府部门登记备案为准。本网站不声明或保证内容之正确性和可靠性，购买房屋时，请谨慎核查。请您在签订合同之前，切勿支付任何形式的费用，以免上当受骗。
                    </Text>
                </View>
            </ScrollView>
            <View className="bottom-bar">
                <View className="bar-item">
                    <View className="user-photo">
                        <Image src={esfData.user.avatar}></Image>
                    </View>
                    <View>
                        <View>{esfData.user.nickname}</View>
                        <View className="small-desc">{SOURCE_TYPE[esfData.source_type]}</View>
                    </View>
                </View>
                {
                    esfData.source_type == '2' &&
                    <View className="bar-item-btn" onClick={toChatRoom}>
                        <Text className="btn btn-yellow btn-bar">在线咨询</Text>
                    </View>
                }
                <View className="bar-item-btn" onClick={handlePhoneCall}>
                    <Text className="btn btn-primary btn-bar">电话咨询</Text>
                </View>
            </View>
            {
                open &&
                <View className="album-swiper" style={{ top: 0 }}>
                    <View className="album-swiper-header">
                        <View className="album-count">
                            <Text>{album.currentIdex + 1}/{esfData.esfImage.length}</Text>
                        </View>
                        <View className="iconfont iconclose" onClick={() => setOpen(false)}></View>
                    </View>
                    <View className="album-swiper-content">
                        <Swiper
                            style={{ height: contentHeight - 80 }}
                            current={album.currentIdex}
                            onChange={onSwiperChange}
                        >
                            {
                                esfData.esfImage.map((item: any, index: number) => (
                                    <SwiperItem key={index}>
                                        <Image className="swiper-image" src={item.image_path} mode='widthFix'></Image>
                                        <View className="swiper-text"></View>
                                    </SwiperItem>
                                ))
                            }
                        </Swiper>
                    </View>
                </View>
            }
        </View>
    )
}

export default esfHouse