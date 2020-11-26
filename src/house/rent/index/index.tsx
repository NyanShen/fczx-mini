import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, ScrollView, Text, Image, Swiper, SwiperItem } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'
import '@styles/common/bottom-bar.scss'
import './index.scss'
import { bMapTransQQMap, getStaticMap } from '@utils/map'
import { toUrlParam } from '@utils/urlHandler'

interface IAlbum {
    currentIdex: number
}

const INIT_ALNUM = {
    currentIdex: 0
}

const INIT_RENT_DATA = {
    area: {},
    tags: [],
    user: {},
    fangHouse: {},
    rentImage: [],
    fangPropertyType: {},
    fangDirectionType: {},
    fangRenovationStatus: {},
    fangMatching: []
}

const RENT_TYPE = {
    '1': '整租',
    '2': '合租'
}

const PAY_TYPE = {
    '1': '付一押一',
    '2': '付二押一',
    '3': '付三押一',
    '4': '半年付',
    '5': '年付',
    '6': '面议',
}

const ELEVATOR = {
    '1': '有',
    '2': '无'
}

const RentIndex = () => {
    const params: any = getCurrentInstance().router?.params
    const { appHeaderHeight, contentHeight } = useNavData()
    const [open, setOpen] = useState<boolean>(false)
    const [album, setAlbum] = useState<IAlbum>(INIT_ALNUM)
    const [rentData, setRentData] = useState<any>(INIT_RENT_DATA)

    const navbarData = {
        title: '租房',
        back: !params.share,
        home: params.share
    }

    useShareTimeline(() => {
        return {
            title: rentData.title,
            path: `/house/rent/index/index?id=${rentData.id}&share=true`
        }
    })

    useShareAppMessage(() => {
        return {
            title: rentData.title,
            imageUrl: rentData.image_path,
            path: `/house/rent/index/index?id=${rentData.id}&share=true`
        }
    })

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getRentById),
            data: {
                id: params.id
            }
        }).then((result: any) => {
            const { longitude, latitude } = result.fangHouse
            const static_map = getStaticMap(latitude, longitude)
            setRentData({ ...result, ...{ static_map: static_map } })
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
            url: `/house/community/index/index?id=${rentData.fangHouse.id}`
        })
    }

    const toLocation = () => {
        const { latitude, longitude } = rentData.fangHouse
        const location = bMapTransQQMap(latitude, longitude)
        Taro.openLocation({
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            scale: 18,
            name: rentData.title,
            address: rentData.address
        })

    }

    const toChatRoom = () => {
        const { id, title, price, image_path, room, office, toilet, building_area, rent_type } = rentData
        const paramString = toUrlParam({
            messageType: '5',
            fromUserId: rentData.user_id,
            toUser: JSON.stringify({ id: rentData.user_id, nickname: rentData.real_name }),
            content: JSON.stringify({
                id,
                title,
                price,
                image_path,
                room,
                office,
                toilet,
                rent_type,
                building_area,
                areaName: rentData.area.name
            })
        })
        Taro.navigateTo({
            url: `/chat/room/index${paramString}`
        })
    }

    const handlePhoneCall = () => {
        Taro.makePhoneCall({
            phoneNumber: rentData.mobile.replace(/[^0-9]/ig, ""),
            fail: (err: any) => {
                if (err.errMsg == 'makePhoneCall:fail') {
                    Taro.showModal({
                        title: '联系电话',
                        content: rentData.mobile,
                        showCancel: false
                    })
                }
            }
        })
    }

    return (
        <View className="rent">
            <NavBar {...navbarData}></NavBar>
            <ScrollView style={{ maxHeight: contentHeight - 55 }} scrollY>
                <View className="house-album">
                    <Swiper
                        style={{ height: '225px' }}
                        current={album.currentIdex}
                        onChange={onSwiperChange}
                    >
                        {
                            rentData.rentImage.map((item: any, index: number) => (
                                <SwiperItem key={index} itemId={item.id} onClick={() => setOpen(true)}>
                                    <Image src={item.image_path}></Image>
                                </SwiperItem>
                            ))
                        }
                    </Swiper>
                    <View className="album-count">共{rentData.rentImage.length}张</View>
                </View>
                <View className="rent-item">
                    <View className="rent-item-header">
                        <View className="title mb16">
                            {rentData.title}
                        </View>
                        <View className="address mb16">
                            <View className="name">{rentData.area.name}-{rentData.address}</View>
                            <View className="iconfont iconaddress" onClick={toLocation}>地址</View>
                        </View>
                        <View className="small-desc mb16">
                            更新时间：{rentData.modified && formatTimestamp(rentData.modified)}
                        </View>
                        <View className="tags">
                            <Text className="tags-item sale-status-2">{RENT_TYPE[rentData.rent_type]}</Text>
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="rent-item-info">
                        <View>
                            <Text className="price">{rentData.price}</Text>
                            <Text className="price-unit">元/月</Text>
                            <Text className="small-desc">({PAY_TYPE[rentData.pay_type]})</Text>
                        </View>
                        <View className="info-list">
                            <View className="info-item">
                                <Text className="label">户型</Text>
                                <Text className="value">{rentData.room}室{rentData.office}厅{rentData.toilet}卫</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">面积</Text>
                                <Text className="value">{rentData.building_area}m²</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">楼层</Text>
                                <Text className="value">第{rentData.height_self}层/共{rentData.height_total}层</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">装修</Text>
                                <Text className="value">{rentData.fangRenovationStatus.name}</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">朝向</Text>
                                <Text className="value">{rentData.fangDirectionType.name}</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">电梯</Text>
                                <Text className="value">{ELEVATOR[rentData.is_elevator]}</Text>
                            </View>
                            {
                                rentData.special_requirement &&
                                <View className="info-item">
                                    <Text className="label">要求</Text>
                                    <Text className="value">{rentData.special_requirement}</Text>
                                </View>
                            }
                        </View>
                        <View className="facility-content">
                            <View className="label">配套设施</View>
                            <View className="facility-list">
                                {
                                    rentData.fangMatching.map((item: any, index: number) => (
                                        <View key={index} className="facility-item">
                                            <Text className="iconfont iconcheck"></Text>
                                            <Text>{item.name}</Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                        <View className="rent-tip">
                            <Text>郑重提示：请您在签订合同之前，切勿支付任何形式的费用，以免上当受骗。</Text>
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="rent-item-info">
                        <View className="header">
                            <Text className="title">房源描述</Text>
                        </View>
                        <View className="rent-info-consultant">
                            <View className="user-photo">
                                <Image src={rentData.user.avatar}></Image>
                            </View>
                            <View>
                                <View>{rentData.user.nickname}</View>
                                <View className="small-desc">经纪人</View>
                            </View>
                        </View>
                        <View className="rent-desc">
                            {rentData.description ? rentData.description : '暂无描述'}
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="rent-item-info">
                        <View className="community-header" onClick={toCommunity}>
                            <View className="title">
                                <Text>小区详情：</Text>
                                <Text className="link">{rentData.fangHouse.title}</Text>
                            </View>
                            <View className="more">
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <View className="map" onClick={toLocation}>
                            <Image className="map-image" src={rentData.static_map} mode="center"></Image>
                            <View className="map-label">
                                <View className="text">{rentData.fangHouse.title}</View>
                                <View className="iconfont iconmap"></View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="small-desc">
                        免责声明：房源信息由网站用户提供，其真实性、合法性由信息提供者负责，最终以政府部门登记备案为准。本网站不声明或保证内容之正确性和可靠性，租赁该房屋时，请谨慎核查。
                    </View>
                </View>
            </ScrollView>
            <View className="bottom-bar">
                <View className="bar-item">
                    <View className="user-photo">
                        <Image src={rentData.user.avatar}></Image>
                    </View>
                    <View>
                        <View>{rentData.user.nickname}</View>
                        <View className="small-desc">经纪人</View>
                    </View>
                </View>
                <View className="bar-item-btn" onClick={toChatRoom}>
                    <Text className="btn btn-yellow btn-bar">在线咨询</Text>
                </View>
                <View className="bar-item-btn" onClick={handlePhoneCall}>
                    <Text className="btn btn-primary btn-bar">电话咨询</Text>
                </View>
            </View>
            {
                open &&
                <View className="album-swiper" style={{ top: appHeaderHeight }}>
                    <View className="album-swiper-header">
                        <View className="album-count">
                            <Text>{album.currentIdex + 1}/{rentData.rentImage.length}</Text>
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
                                rentData.rentImage.map((item: any, index: number) => (
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

export default RentIndex