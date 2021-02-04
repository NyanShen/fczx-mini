import React, { useState } from 'react'
import { Image, ScrollView, Text, View } from '@tarojs/components'

import useNavData from '@hooks/useNavData'
import './index.scss'

const no_bus = 'https://static.fczx.com/www/assets/mini/data_no_bus.png'


const HouseGroup = () => {
    const { contentHeight } = useNavData()
    const [showEmpty] = useState<boolean>(false)
    return (
        <View className="kft">
            <View className="kft-content">
                <ScrollView
                    className="kft-list"
                    style={{ maxHeight: contentHeight }}
                    scrollY>
                    <View className="kft-item">
                        <View className="kft-title">襄阳房产网双12东津专线看房团</View>
                        <View className="route-line">
                            <View className="line-site line-node">
                                <View className="start-label">集合信息</View>
                                <View className="start-time">2021-02-16 08:30</View>
                                <View className="start-location">樊城区樊西新区牛首镇物流二路以北、产业大道以西</View>
                            </View>
                            <View className="line-site">
                                <View className="site-content">
                                    <View className="house-image">
                                        <Image src="" />
                                    </View>
                                    <View className="house-context">
                                        <View className="name">中交·泷湾云城</View>
                                        <View className="context">
                                            <Text className="label">价格：</Text>
                                            <Text className="required">24000元/㎡</Text>
                                        </View>
                                        <View className="context">
                                            <Text className="label">优惠：</Text>
                                            <Text className="required">尊享9.8折优惠</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="site-address">
                                    地址：南海区桂城街道林
                                </View>
                            </View>
                            <View className="line-site">
                                <View className="site-content">
                                    <View className="house-image">
                                        <Image src="" />
                                    </View>
                                    <View className="house-context">
                                        <View className="name">中交·泷湾云城</View>
                                        <View className="context">
                                            <Text className="label">价格：</Text>
                                            <Text className="required">24000元/㎡</Text>
                                        </View>
                                        <View className="context">
                                            <Text className="label">优惠：</Text>
                                            <Text className="required">尊享9.8折优惠</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="site-address">
                                    地址：南海区桂城街道林
                                </View>
                            </View>
                            <View className="line-site line-node">
                                行程结束
                            </View>
                        </View>
                        <View className="kft-statement">
                            <View className="label">承诺服务:</View>
                            <View className="value">全程免费</View>
                            <View className="value">免费大巴接送</View>
                            <View className="value">提供免费午餐</View>
                        </View>
                        <View className="kft-countdown">
                            距离结束还有
                            <Text className="time">2</Text>天
                            <Text className="time">14</Text>时
                            <Text className="time">31</Text>分
                        </View>
                        <View className="kft-action">
                            <View className="btn btn-primary">免费报名</View>
                        </View>
                    </View>
                    <View className="kft-item">
                        <View className="kft-title">襄阳房产网双12东津专线看房团</View>
                        <View className="route-line">
                            <View className="line-site line-node">
                                <View className="start-time">2021-02-16 08:30</View>
                                <View className="start-location">樊城区樊西新区牛首镇物流二路以北、产业大道以西</View>
                            </View>
                            <View className="line-site">
                                <View className="site-content">
                                    <View className="house-image">
                                        <Image src="" />
                                    </View>
                                    <View className="house-context">
                                        <View className="name">中交·泷湾云城</View>
                                        <View className="context">
                                            <Text className="label">价格：</Text>
                                            <Text className="required">24000元/㎡</Text>
                                        </View>
                                        <View className="context">
                                            <Text className="label">优惠：</Text>
                                            <Text className="required">优惠8折优惠8折优惠</Text>
                                        </View>
                                    </View>
                                </View>
                                <View className="site-address">
                                    地址：南海区桂城街道林
                                </View>
                            </View>
                            <View className="line-site line-node">
                                行程结束
                            </View>
                        </View>
                        <View className="kft-action">
                            <View className="btn btn-disabled">活动已结束</View>
                        </View>
                    </View>
                </ScrollView>
                {
                    showEmpty &&
                    <View className="empty-container empty-container-center">
                        <View className="empty-image">
                            <Image src={no_bus} mode="aspectFill" />
                        </View>
                        <View className="empty-text">暂无数据，近期看房团正在策划中~</View>
                    </View>
                }
            </View>
        </View>
    )
}

export default HouseGroup