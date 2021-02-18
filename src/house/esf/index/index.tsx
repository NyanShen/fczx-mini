import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, makePhoneCall, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { ScrollView, View, Text, Image, Button, Swiper, SwiperItem } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE } from '@constants/house'
import { toUrlParam } from '@utils/urlHandler'
import { formatPhoneCall } from '@utils/index'
import { bMapTransQQMap, getStaticMap } from '@utils/map'
import '@styles/common/house.scss'
import '@styles/common/house-album.scss'
import '@styles/common/bottom-bar.scss'
import './index.scss'
import { getToken, hasLoginBack } from '@services/login'
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
    const [collect, setCollect] = useState<boolean>(false)

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
            Taro.setNavigationBarTitle({ title: result.title })
            if (params.c) {
                handlePhoneCall(result.mobile)
            }
        })
        if (getToken()) {
            fetchCollectStatus()
        }
    }, [])

    const fetchCollectStatus = () => {
        app.request({
            url: app.areaApiUrl(api.userIsCollect),
            data: {
                type_id: params.id,
                type: '2',
                static: true
            }
        }).then((res: any) => {
            setCollect(res)
        })
    }

    const updateUserCollect = (url: string, status: boolean) => {
        hasLoginBack().then(() => {
            app.request({
                url: app.areaApiUrl(url),
                method: 'POST',
                data: {
                    type_id: params.id,
                    type: '2'
                }
            }).then(() => {
                setCollect(status)
            })
        })
    }

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

    const handlePhoneCall = (phone: string) => {
        makePhoneCall({
            phoneNumber: formatPhoneCall(phone),
            fail: (err: any) => {
                if (err.errMsg == 'makePhoneCall:fail') {
                    Taro.showModal({
                        title: '联系电话',
                        content: phone,
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

    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return '待定'
        } else {
            return price + PRICE_TYPE[price_type]
        }
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
                                    <Image className="taro-image" src={item.image_path}></Image>
                                </SwiperItem>
                            ))
                        }
                    </Swiper>
                    <View className="album-count">共{esfData.esfImage.length}张</View>
                </View>
                <View className="esf-item">
                    <View className="header">
                        <View className="header-left">{esfData.title}</View>
                        <View className="header-right">
                            {
                                collect ?
                                    <Button className="header-btn" onClick={() => updateUserCollect(api.userCollectDelete, false)}>
                                        <View className="iconfont iconstarfill"></View>
                                        <View className="text">已收藏</View>
                                    </Button> :
                                    <Button className="header-btn" onClick={() => updateUserCollect(api.userCollectAdd, true)}>
                                        <View className="iconfont iconstar"></View>
                                        <View className="text">收藏</View>
                                    </Button>
                            }
                            <Button className="header-btn" openType="share">
                                <View className="iconfont iconshare"></View>
                                <View className="text">分享</View>
                            </Button>
                        </View>
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
                                    {renderPrice(esfData.fangHouse.price, esfData.fangHouse.price_type)}
                                </View>
                            </View>
                            <View className="community-item">
                                <View className="label">小区地址</View>
                                <View className="value">{esfData.fangHouse.address}</View>
                            </View>
                        </View>
                        <View className="map" onClick={toLocation}>
                            <Image className="taro-image" className="map-image" src={esfData.static_map} mode="center"></Image>
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
                    <View className="item-photo">
                        <Image className="taro-image" src={esfData.user.avatar}></Image>
                    </View>
                    <View className="item-text">
                        <View className="text">{esfData.user.nickname}</View>
                        <View className="small-desc">{SOURCE_TYPE[esfData.source_type]}</View>
                    </View>
                </View>
                {
                    esfData.source_type == '2' &&
                    <View className="bar-item-btn" onClick={toChatRoom}>
                        <Text className="btn btn-yellow btn-bar">在线咨询</Text>
                    </View>
                }
                <View className="bar-item-btn" onClick={() => handlePhoneCall(esfData.mobile)}>
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
                                        <Image className="taro-image" className="swiper-image" src={item.image_path} mode='widthFix'></Image>
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