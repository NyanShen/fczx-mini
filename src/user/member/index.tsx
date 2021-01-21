import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import './index.scss'

const Member = () => {
    const params: any = getCurrentInstance().router?.params
    const [vipList, setVipList] = useState<any[]>([])
    const [currentType, setCurrentType] = useState<any>({})
    const [currentVip, setCurrentVip] = useState<any>({})

    useEffect(() => {
        fetchMemberUpgrade()
    }, [])

    const fetchMemberUpgrade = () => {
        app.request({
            url: app.testApiUrl(api.getMemberUpgrade)
        }, { loading: false }).then((result: any) => {
            setVipList(result)
            setCurrentType(result[0])
            setCurrentVip(result[0].types[0])
        })
    }

    const handleCurrentTypeClick = (item: any) => {
        setCurrentType(item)
        setCurrentVip(item.types[0])
    }

    return (
        <View className="member">
            <View className="member-content">
                <View className="member-header">
                    <View className="member-user">
                        <View className="user-photo">
                            <Image src={params.avatar} />
                        </View>
                        <View className="user-text">
                            <View className="name">{params.nickname || params.username}</View>
                        </View>
                    </View>
                    <View className="member-tabs">
                        {
                            vipList.map((item: any, index: number) => (
                                <View
                                    key={index}
                                    onClick={() => handleCurrentTypeClick(item)}
                                    className={classnames('tabs-item', item.id === currentType.id && 'actived')}
                                >{item.levelname}</View>
                            ))
                        }
                    </View>
                </View>
                <View className="member-form">
                    <View className="member-equity">
                        <Text className="equity-label">{currentType.levelname}权益：</Text>
                        <Text className="equity-text">
                            每天可发布<Text className="value">{currentType.perday_maxpost}</Text>条;
                        每天可刷新<Text className="value">{currentType.perday_maxrefresh}</Text>条;
                        总共可发布<Text className="value">{currentType.total_maxpost}</Text>条;
                        可设置精选信息条数<Text className="value">{currentType.fixed_refresh}</Text>条;
                        </Text>
                    </View>
                    <View className="form-item">
                        <View className="item-label">选择续费时长</View>
                        <View className="item-flex">
                            {
                                currentType.types &&
                                currentType.types.map((item: any, index: number) => (
                                    <View
                                        key={index}
                                        onClick={() => setCurrentVip(item)}
                                        className={classnames('vip-item', item.id === currentVip.id && 'actived')}>
                                        <View className="title">{item.name}</View>
                                        <View className="unit">{item.days}元/天</View>
                                        <View className="total">¥{item.money}</View>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                    <View className="form-item">
                        <View className="item-title">赠送套餐</View>
                        <View className="vip-gave">
                            <View className="gave-item">赠送【
                            {currentVip.is_give == 1 ? '金币' : '积分'}
                            】：{currentVip.give_num}</View>
                        </View>
                    </View>
                    <View className="form-flex-right">
                        <View className="pay-total">需支付：¥{currentVip.money}</View>
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