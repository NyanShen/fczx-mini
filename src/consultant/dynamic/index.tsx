import React from 'react'
import { View, Text, Image } from '@tarojs/components'

import './index.scss'

const HouseDynamic = () => {
    return (
        <View className="dynamic">
            <View className="dynamic-content">
                <View className="dynamic-list">
                    <View className="dynamic-item">
                        <View className="dynamic-flex">
                            <View className="dynamic-title">襄阳国投测试</View>
                            <View className="more">
                                <Text>更多</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <View className="dynamic-text">襄阳国投测试襄阳国投测试襄阳国投测试襄阳国投测试襄阳国投测试襄阳国投测试襄阳国投测试襄阳国投测试襄阳国投测试襄阳国投测试</View>
                        <View className="dynamic-media">
                            <View className="media-image">
                                <View className="item-image">
                                    <Image src="" mode="aspectFill" />
                                </View>
                            </View>
                        </View>
                        <View className="dynamic-action clearfix">
                            <View className="action-item">
                                <View className="btn btn-plain">删除</View>
                            </View>
                        </View>
                        <View className="dynamic-flex dynamic-check">
                            <View className="check-time">2021-01-18 16:06:21</View>
                            <View className="check-status">等待审核</View>
                        </View>
                    </View>

                    <View className="dynamic-item">
                        <View className="dynamic-flex">
                            <View className="dynamic-title">襄阳国投测试</View>
                            <View className="more">
                                <Text>更多</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <View className="dynamic-text">襄阳吾悦广场</View>
                        <View className="dynamic-media">
                            <View className="media-video">
                                <Image src="" mode="aspectFill" />
                                <Text className="iconfont iconVideo"></Text>
                            </View>
                        </View>
                        <View className="dynamic-action clearfix">
                            <View className="action-item">
                                <View className="btn btn-plain">删除</View>
                            </View>
                        </View>
                        <View className="dynamic-flex dynamic-check">
                            <View className="check-time">2021-01-18 16:06:21</View>
                            <View className="check-status">等待审核</View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HouseDynamic