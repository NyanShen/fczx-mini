import React from 'react'
import Taro, { useReady } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import CustomProgress from '@components/progress'
import './index.scss'

const Activity = () => {
    const titleColor = '#48a764'
    const mainColor = '#a7daad'
    const dataList = [
        {
            name: '精美笔记本',
            needCount: 10,
        },
        {
            name: '豪华笔记本',
            needCount: 20,
        }
    ]
    useReady(() => {
        Taro.setNavigationBarTitle({ title: '优惠活动' })
    })
    return (
        <View className="activity" style={{ backgroundColor: mainColor }}>
            <View className="activity-photo">
                <Image src="" mode="aspectFill" />
            </View>
            <View className="activity-content">
                <View className="activity-item activity-main">
                    <View className="main-header">
                        <Image src="" mode="aspectFill" />
                        <View className="main-text">
                            <Text className="title" style={{ color: titleColor }}>您正在参加助力赢好礼活动</Text>
                            <Text className="subtitle">参加楼盘的助力活动</Text>
                        </View>
                    </View>
                    <View className="main-progress">
                        <CustomProgress dataList={dataList} meetCount={10}/>
                    </View>
                    <View className="main-action mt20">
                        <View className="btn btn-primary" style={{ backgroundColor: mainColor, borderColor: mainColor }}>邀请好友助力</View>
                    </View>
                    <View className="main-subaction mt20">
                        <Text className="subaction-btn" style={{ color: titleColor }}>已助力好友</Text>
                    </View>
                </View>
                <View className="activity-item activity-news">
                    <View className="activity-header">
                        <View className="title">助力动态</View>
                        <View className="line-split"></View>
                    </View>
                    <View className="news-content">
                        <View className="news-scroll">
                            <View className="news-item">
                                <View className="item-1">Nyan</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan1</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan2</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan3</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan4</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan5</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan6</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan7</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan8</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                            <View className="news-item">
                                <View className="item-1">Nyan9</View>
                                <View className="item-2">2020/12/17 13:50</View>
                                <View className="item-3">获得精美笔记本</View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="activity-item activity-statement">
                    <View className="activity-header">
                        <View className="title">活动说明</View>
                        <View className="line-split"></View>
                    </View>
                    <View className="statment-content">
                        <View className="statement-item">
                            <View className="statement-title">
                                <Text className="order" style={{ backgroundColor: mainColor }}>1</Text>
                                <Text className="name">活动奖品</Text>
                            </View>
                            <View className="statement-context">
                                <View className="content-item">奖品一：精美笔记本</View>
                                <View className="content-item">奖品二：豪华笔记本</View>
                                <View className="content-item">奖品三：特制笔记本</View>
                            </View>
                        </View>
                        <View className="statement-item">
                            <View className="statement-title">
                                <Text className="order" style={{ backgroundColor: mainColor }}>2</Text>
                                <Text className="name">活动时间</Text>
                            </View>
                            <View className="statement-context">
                                2020年12月03日-2020年01月04日
                            </View>
                        </View>
                        <View className="statement-item">
                            <View className="statement-title">
                                <Text className="order" style={{ backgroundColor: mainColor }}>3</Text>
                                <Text className="name">活动主办单位</Text>
                            </View>
                            <View className="statement-context">
                                项目官方团队
                            </View>
                        </View>
                        <View className="statement-item">
                            <View className="statement-title">
                                <Text className="order" style={{ backgroundColor: mainColor }}>4</Text>
                                <Text className="name">活动明细</Text>
                            </View>
                            <View className="statement-context">
                                1.才能打马赛克女
                                2.吧乘风少年美女皮所迫
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
export default Activity