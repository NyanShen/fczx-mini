import React, { useEffect, useState } from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import { View, Image, Text, ScrollView, Swiper, SwiperItem } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import '@house/new/album/index.scss'
import './detail.scss'

const HouseTypeDetail = () => {
    const bottomHeight = 55
    const currentRouter: any = getCurrentInstance().router
    const params: any = currentRouter.params
    const { appHeaderHeight, contentHeight } = useNavData()
    const [open, setOpen] = useState<boolean>(false)
    const [style, setStlye] = useState<any>({})
    const [houseType, setHouseType] = useState<any>({ tags: [], fangHouse: {} })

    useEffect(() => {
        app.request({
            url: app.testApiUrl(api.getHouseTypeDetail),
            data: {
                id: params.id
            }
        }).then((result: any) => {
            setHouseType(result)
        })
    }, [])

    const handleLoaded = (e) => {
        const maxWidth = Taro.getSystemInfoSync().windowWidth
        const maxHeight = 280
        const ratio = maxWidth / maxHeight
        const realWidth = e.detail.width
        const realHeight = e.detail.height
        const imgRatio = realWidth / realHeight

        if (ratio > imgRatio) {
            setStlye({
                width: realWidth * (maxHeight / realHeight),
                height: maxHeight
            })
        } else {
            setStlye({
                width: maxWidth,
                height: realHeight * (maxWidth / realWidth)
            })
        }
    }
    
    const handlePhoneCall = () => {
        Taro.makePhoneCall({
            phoneNumber: houseType.fangHouse.phone
        })
    }

    const toNewHouse = () => {
            Taro.navigateTo({
                url: `/house/new/index/index?id=${params.houseId}`
            })
    }
    return (
        <View className="house-type-detail">
            <NavBar title="户型图" back={true}></NavBar>
            <View className="detail-wrapper">
                <ScrollView
                    scrollY
                    style={{ maxHeight: contentHeight - bottomHeight }}
                >
                    <View className="detail-image" onClick={() => setOpen(true)}>
                        <Image
                            src={houseType.image_path}
                            onLoad={handleLoaded}
                            style={style}
                        ></Image>
                    </View>
                    <View className="detail-header">
                        <View className="title">{houseType.name}</View>
                        <View className="tags">
                            <Text className={classnames('tags-item', `sale-status-${houseType.sale_status}`)}>
                                {SALE_STATUS[houseType.sale_status]}
                            </Text>
                            {
                                houseType.tags.map((item: string, index: number) => (
                                    <Text key={index} className="tags-item">{item}</Text>
                                ))
                            }
                        </View>
                    </View>
                    <View className="detail-content">
                        <View className="detail-info">
                            <View className="detail-info-item">
                                <View className="label">户型</View>
                                <View className="value">{houseType.room}室{houseType.office}厅{houseType.toilet}卫</View>
                            </View>
                            <View className="detail-info-item">
                                <View className="label">价格</View>
                                <View className="value price">
                                    {
                                        houseType.price == '0' ? '待定' :
                                            <Text>
                                                {houseType.price}
                                                <Text className="price-unit">{PRICE_TYPE[houseType.price_type]}</Text>
                                            </Text>
                                    }
                                </View>
                            </View>
                            <View className="detail-info-item">
                                <View className="label">建筑面积</View>
                                <View className="value">{houseType.building_area}m²</View>
                            </View>
                            <View className="detail-info-item">
                                <View className="label">所在楼栋</View>
                                <View className="value">{houseType.fangHouseBuildingRoom}</View>
                            </View>
                            <View className="detail-info-item">
                                <View className="label">所属楼盘</View>
                                <View className="value">{houseType.fangHouse.title}</View>
                                <View className="small-desc" onClick={toNewHouse}>
                                    <Text>查看详情</Text>
                                    <Text className="iconfont iconarrow-right-bold"></Text>
                                </View>
                            </View>
                        </View>
                        <View className="small-desc">实际价格以售楼处为主，户型图为开发商提供，具体以实际交房标准为主.</View>
                        <View className="detail-contact" onClick={handlePhoneCall}>
                            <View>
                                <View className="phone-call">{houseType.fangHouse.phone}</View>
                                <View className="phone-desc">致电售楼处了解项目更多信息</View>
                            </View>
                            <View className="phone-icon">
                                <Text className="iconfont iconcall"></Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View className="bottom-bar">
                <View className="bar-item-btn">
                    <View className="btn btn-yellow btn-bar ml30">
                        <View>联系置业顾问</View>
                    </View>
                </View>
                <View className="bar-item-btn">
                    <View className="btn btn-primary btn-bar" onClick={handlePhoneCall}>
                        <View>免费电话咨询</View>
                    </View>
                </View>
            </View>
            {
                open &&
                <View className="album-swiper" style={{ top: appHeaderHeight }}>
                    <View className="album-swiper-header">
                        <View className="album-count">
                            <Text>1/1</Text>
                        </View>
                        <View className="iconfont iconclose" onClick={() => setOpen(false)}></View>
                    </View>
                    <View className="album-swiper-content">
                        <Swiper style={{ height: contentHeight - 80 }}>
                            <SwiperItem >
                                <Image className="swiper-image" src={houseType.image_path} mode='widthFix'></Image>
                                <View className="swiper-text">
                                </View>
                            </SwiperItem>
                        </Swiper>
                    </View>
                </View>
            }
        </View>
    )
}

export default HouseTypeDetail