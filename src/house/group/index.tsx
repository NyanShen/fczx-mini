import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, View } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import Popup from '@components/popup'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE } from '@constants/house'
import { formatTimestamp } from '@utils/index'
import './index.scss'
import NavBar from '@/components/navbar'

const no_bus = 'https://static.fczx.com/www/assets/mini/data_no_bus.png'


const HouseGroup = () => {
    const { contentHeight } = useNavData()
    const [groupData, setGroupData] = useState<any[]>([])

    useEffect(() => {
        fetchGroupData()
    }, [])

    const fetchGroupData = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseGroup),
        }).then((result: any) => {
            setGroupData(result)
        })
    }

    const timeCountDown = (intDiff: number) => {
        let day: number = 0;
        let hour: number = 0;
        let minute: number = 0;
        let second: number = 0;
        if (intDiff > 0) {
            day = Math.floor(intDiff / (60 * 60 * 24));
            hour = Math.floor(intDiff / (60 * 60)) - (day * 24);
            minute = Math.floor(intDiff / 60) - (day * 24 * 60) - (hour * 60);
            second = Math.floor(intDiff) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
        }
        if (minute <= 9) minute = 0 + minute;
        if (second <= 9) second = 0 + second;
        return { day, hour, minute, second }
    }

    const renderTimeEnd = (timeEnd: number) => {
        const { day, hour, minute } = timeCountDown(timeEnd)
        return (
            <View className="kft-countdown">
                距离结束还有
                <Text className="time">{day}</Text>天
                <Text className="time">{hour}</Text>时
                <Text className="time">{minute}</Text>分
            </View>
        )
    }

    const renderPrice = (price: string | number, price_type: string) => {
        if (price == '0') {
            return '待定'
        } else {
            return `${price}${PRICE_TYPE[price_type]}`
        }
    }
    return (
        <View className="kft">
            <NavBar title="看房团"/>
            <View className="kft-content">
                {
                    groupData.length > 0 ?
                        <ScrollView
                            className="kft-list"
                            style={{ maxHeight: `${contentHeight}px` }}
                            scrollY>
                            {
                                groupData.map((item: any, index: number) => {
                                    let groupItem = item.fangHouseGroup
                                    let diffTime = groupItem.time_end - new Date().getTime() / 1000
                                    return (
                                        <View className="kft-item" key={index}>
                                            <View className="kft-title">{groupItem.title}</View>
                                            <View className="route-line">
                                                <View className="line-site line-node">
                                                    <View className="start-label">集合信息</View>
                                                    <View className="start-time">{formatTimestamp(groupItem.aggregate_time)}</View>
                                                    <View className="start-location">{groupItem.aggregate_place}</View>
                                                </View>
                                                <View className="line-site">
                                                    <View className="site-content">
                                                        <View className="house-image">
                                                            <Image className="taro-image" src={item.image_path} mode="aspectFill" />
                                                        </View>
                                                        <View className="house-context">
                                                            <View className="name">{item.title}</View>
                                                            <View className="context">
                                                                <Text className="label">价格：</Text>
                                                                <Text className="required">{renderPrice(item.price, item.price_type)}</Text>
                                                            </View>
                                                            <View className="context">
                                                                <Text className="label">优惠：</Text>
                                                                <Text className="required">{groupItem.discount || '现场优惠'}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View className="site-address">
                                                        地址：{item.address}
                                                    </View>
                                                </View>
                                                <View className="line-site line-node">
                                                    行程结束
                                        </View>
                                            </View>
                                            {
                                                diffTime > 0 ?
                                                    <View>
                                                        <View className="kft-statement">
                                                            <View className="label">承诺服务:</View>
                                                            <View className="value">全程免费</View>
                                                            <View className="value">免费大巴接送</View>
                                                        </View>
                                                        {renderTimeEnd(diffTime)}
                                                        <View className="kft-action">
                                                            <View className="btn btn-primary">
                                                                <Popup
                                                                    type="4"
                                                                    houseId={item.id}
                                                                    btnText="免费报名"
                                                                    iconClass=""
                                                                    title={item.fangHouseGroup.title}
                                                                    description="√免费大巴接送 √来回接送 √全程免费"
                                                                ></Popup>
                                                            </View>
                                                        </View>
                                                    </View> :
                                                    <View className="kft-action">
                                                        <View className="btn btn-disabled">已结束(已有{groupItem.apply_number}人报名)</View>
                                                    </View>
                                            }
                                        </View>
                                    )
                                })
                            }
                        </ScrollView> :
                        <View className="empty-container empty-container-center">
                            <View className="empty-image">
                                <Image className="taro-image" src={no_bus} mode="aspectFill" />
                            </View>
                            <View className="empty-text">暂无数据，近期看房团正在策划中~</View>
                        </View>
                }
            </View>
        </View>
    )
}

export default HouseGroup