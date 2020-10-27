import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, makePhoneCall } from '@tarojs/taro'
import { ScrollView, View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import '@styles/common/house.scss'
import '@styles/common/house-album.scss'
import '@styles/common/bottom-bar.scss'
import './index.scss'
import { PRICE_TYPE } from '@constants/house'
const INIT_ESF_DATA = {
    esfImage: [],
    tags: [],
    area: {},
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

const esfHouse = () => {
    const currentRouter: any = getCurrentInstance().router
    const params: any = currentRouter.params
    const { appHeaderHeight, contentHeight } = useNavData()
    const [open, setOpen] = useState<boolean>(false)
    const [album, setAlbum] = useState<IAlbum>(INIT_ALNUM)
    const [esfData, setEsfData] = useState<any>(INIT_ESF_DATA)

    useEffect(() => {
        params.id = '1000027'
        if (params.id) {
            app.request({
                url: app.testApiUrl(api.getEsfById),
                data: {
                    id: params.id
                }
            }).then((result: any) => {
                setEsfData(result)
            })
        }
    }, [])

    const onSwiperChange = (event) => {
        let swiperIndex = event.detail.current;
        setAlbum({
            currentIdex: swiperIndex
        })
    }

    const toPlotIndex = () => {
        Taro.navigateTo({
            url: `/house/community/index/index?Id=${esfData.fangHouse.id}`
        })
    }

    const handlePhoneCall = () => {
        makePhoneCall({
            phoneNumber: esfData.mobile
        })
    }

    return (
        <View className="esf">
            <NavBar title={esfData.title} back={true}></NavBar>
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
                    <View className="address">
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
                            <View className="subitem link" onClick={toPlotIndex}>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                    </View>

                    <View className="header">
                        <Text className="title">房源描述</Text>
                    </View>
                    <View className="esf-info-consultant">
                        <View className="user-photo">
                            <Image src=""></Image>
                        </View>
                        <View>
                            <View>苏家园</View>
                            <View className="small-desc">置业顾问</View>
                        </View>
                    </View>

                    <View className="esf-info-item">
                        <View className="sub-title">核心卖点</View>
                        <View className="item-content">
                            {esfData.selling_point}
                        </View>
                    </View>
                    <View className="esf-info-item">
                        <View className="sub-title">业主心态</View>
                        <View className="item-content">
                            {esfData.attitude_point}
                        </View>
                    </View>
                    <View className="esf-info-item">
                        <View className="sub-title">服务介绍</View>
                        <View className="item-content">
                            {esfData.service_point}
                        </View>
                    </View>
                </View>
                <View className="esf-item">
                    <View className="header">
                        <View>小区详情</View>
                        <View className="more" onClick={toPlotIndex}>
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
                        <Image src=""></Image>
                    </View>
                    <View>
                        <View>苏家园</View>
                        <View className="small-desc">置业顾问</View>
                    </View>
                </View>
                <View className="bar-item-btn">
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