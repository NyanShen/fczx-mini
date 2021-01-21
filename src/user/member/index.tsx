import React from 'react'
import { View, Image, Text } from '@tarojs/components'

import './index.scss'

const Member = () => {
    return (
        <View className="member">
            <View className="member-content">
                <View className="member-header">
                    <View className="member-user">
                        <View className="user-photo">
                            <Image src="" />
                        </View>
                        <View className="user-text">
                            <View className="name">Nyan Shen</View>
                        </View>
                    </View>
                    <View className="member-tabs">
                        <View className="tabs-item actived">经纪人会员认证</View>
                        <View className="tabs-item">经纪人VIP会员</View>
                    </View>
                </View>
                <View className="member-form">
                    <View className="member-equity">
                        <Text className="equity-label">经纪人认证会员权益：</Text>
                        <Text className="equity-text">
                            每天可发布<Text className="value">6</Text>条;
                        每天可刷新<Text className="value">20</Text>条;
                        总共可发布<Text className="value">40</Text>条;
                        可设置精选信息条数<Text className="value">1</Text>条;
                        </Text>
                    </View>
                    <View className="form-item">
                        <View className="item-label">选择续费时长</View>
                        <View className="item-flex">
                            <View className="vip-item actived">
                                <View className="title">一个月</View>
                                <View className="unit">16.76元/天</View>
                                <View className="total">¥500</View>
                            </View>
                            <View className="vip-item">
                                <View className="title">一个月</View>
                                <View className="unit">16.76元/天</View>
                                <View className="total">¥500</View>
                            </View>
                            <View className="vip-item">
                                <View className="title">一个月</View>
                                <View className="unit">16.76元/天</View>
                                <View className="total">¥500</View>
                            </View>
                            <View className="vip-item">
                                <View className="title">一个月</View>
                                <View className="unit">16.76元/天</View>
                                <View className="total">¥500</View>
                            </View>
                        </View>
                    </View>

                    <View className="form-item">
                        <View className="item-title">赠送套餐</View>
                        <View className="vip-gave">
                            <View className="gave-item">赠送积分：3000</View>
                        </View>
                    </View>
                    <View className="form-flex-right">
                        <View className="pay-total">需支付：¥500</View>
                    </View>
                    <View className="form-item">
                        <View className="btn vip-btn">去支付</View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Member