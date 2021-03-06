import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, previewImage, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { toChatRoom } from '@/router/router'
import { formatPhoneCall } from '@utils/index'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import '@house/new/album/index.scss'
import './detail.scss'

const HouseTypeDetail = () => {
    const bottomHeight = 55
    const params: any = getCurrentInstance().router?.params
    const { contentHeight } = useNavData()
    const [houseType, setHouseType] = useState<any>({
        tags: [],
        fangHouse: {},
        fangHouseConsultant: []
    })

    useShareTimeline(() => {
        return {
            title: `${houseType.fangHouse.title} ${houseType.name}`,
            path: `/house/new/type/detail?id=${params.id}&houseId=${params.houseId}&share=true`
        }
    })

    useShareAppMessage(() => {
        return {
            title: `${houseType.fangHouse.title} ${houseType.name}`,
            imageUrl: houseType.image_path,
            path: `/house/new/type/detail?id=${params.id}&houseId=${params.houseId}&share=true`
        }
    })

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getHouseTypeDetail),
            data: {
                id: params.id
            }
        }).then((result: any) => {
            setHouseType(result)
        })
    }, [])

    const handlePhoneCall = () => {
        Taro.makePhoneCall({
            phoneNumber: formatPhoneCall(houseType.fangHouse.phone),
            fail: (err: any) => {
                if (err.errMsg == 'makePhoneCall:fail') {
                    Taro.showModal({
                        title: '联系电话',
                        content: houseType.fangHouse.phone,
                        showCancel: false
                    })
                }
            }
        })
    }

    const handlePreviewImage = (image_path: string) => {
        previewImage({
            current: image_path,
            urls: [image_path]
        })
    }

    const handleToChatRoom = (consultant: any) => {
        const { id, name, price, price_type, image_path, room, office, toilet } = houseType
        const params: any = {
            messageType: '6',
            fromUserId: consultant.user_id,
            toUser: JSON.stringify(consultant.user),
            content: JSON.stringify({
                id,
                name,
                room,
                office,
                toilet,
                price,
                price_type,
                image_path,
                title: houseType.fangHouse.title
            })
        }
        toChatRoom(params)
    }

    const toNewHouse = () => {
        Taro.navigateTo({
            url: `/house/new/index/index?id=${params.houseId}`
        })
    }

    const toHome = () => {
        Taro.switchTab({ url: '/pages/index/index' })
    }

    return (
        <View className="house-type-detail">
            <View className="detail-wrapper">
                <ScrollView
                    scrollY
                    style={{ maxHeight: `${contentHeight - bottomHeight}px` }}
                >
                    <View className="detail-image" onClick={() => handlePreviewImage(houseType.image_path)}>
                        <Image className="taro-image" src={houseType.image_path} mode="aspectFit"></Image>
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
                <View className="bar-item" onClick={toHome}>
                    <Text className="iconfont iconhome"></Text>
                    <Text>首页</Text>
                </View>
                {
                    houseType.fangHouseConsultant.length > 0 &&
                    <View className="bar-item-btn" onClick={() => handleToChatRoom(houseType.fangHouseConsultant[0])}>
                        <View className="btn btn-yellow btn-bar ml30">
                            <View>联系置业顾问</View>
                        </View>
                    </View>
                }
                <View className="bar-item-btn">
                    <View className="btn btn-primary btn-bar" onClick={handlePhoneCall}>
                        <View>免费电话咨询</View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HouseTypeDetail