import React from 'react'
import { ScrollView, View, Image, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'

import '@styles/common/bottom-bar.scss'
import './index.scss'

const HouseType = () => {
    const fixedHeight = 105
    const { contentHeight } = useNavData()
    return (
        <View className="house-type">
            <NavBar title="全部户型" back={true}></NavBar>
            <View className="fixed">
                <ScrollView className="type-tabs" scrollX>
                    <View className="tab-item">
                        全部(16)
                    </View>
                    <View className="tab-item">
                        一室(6)
                    </View>
                    <View className="tab-item">
                        三室(16)
                    </View>
                    <View className="tab-item">
                        二室(34)
                    </View>
                    <View className="tab-item">
                        四室(34)
                    </View>
                    <View className="tab-item">
                        五室(34)
                    </View>
                    <View className="tab-item">
                        六室(34)
                    </View>
                </ScrollView>
            </View>
            <View className="type-content">
                <ScrollView
                    scrollY
                    className="type-list"
                    style={{ maxHeight: contentHeight - fixedHeight }}
                >
                    <View className="type-item">
                        <View className="type-image">
                            <Image src=""></Image>
                        </View>
                        <View className="type-info">
                            <View className="title">3室2厅2卫  约127.11m²</View>
                            <View className="price">138万元/套</View>
                            <View className="type">G138㎡高层</View>
                            <View className="tags">
                                <Text className="tags-item sale-status-1">在售</Text>
                            </View>
                        </View>
                    </View>
                    <View className="type-item">
                        <View className="type-image">
                            <Image src=""></Image>
                        </View>
                        <View className="type-info">
                            <View className="title">3室2厅2卫  约127.11m²</View>
                            <View className="price">138万元/套</View>
                            <View className="type">G138㎡高层</View>
                            <View className="tags">
                                <Text className="tags-item sale-status-1">在售</Text>
                            </View>
                        </View>
                    </View>
                    <View className="type-item">
                        <View className="type-image">
                            <Image src=""></Image>
                        </View>
                        <View className="type-info">
                            <View className="title">3室2厅2卫  约127.11m²</View>
                            <View className="price">138万元/套</View>
                            <View className="type">G138㎡高层</View>
                            <View className="tags">
                                <Text className="tags-item sale-status-1">在售</Text>
                            </View>
                        </View>
                    </View>
                    <View className="type-item">
                        <View className="type-image">
                            <Image src=""></Image>
                        </View>
                        <View className="type-info">
                            <View className="title">3室2厅2卫  约127.11m²</View>
                            <View className="price">138万元/套</View>
                            <View className="type">G138㎡高层</View>
                            <View className="tags">
                                <Text className="tags-item sale-status-1">在售</Text>
                            </View>
                        </View>
                    </View>
                    <View className="type-item">
                        <View className="type-image">
                            <Image src=""></Image>
                        </View>
                        <View className="type-info">
                            <View className="title">3室2厅2卫  约127.11m²</View>
                            <View className="price">138万元/套</View>
                            <View className="type">G138㎡高层</View>
                            <View className="tags">
                                <Text className="tags-item sale-status-1">在售</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View className="bottom-bar">
                <View className="bar-item-btn">
                    <View className="btn btn-yellow btn-bar ml30">
                        <View>微聊</View>
                        <View className="btn-subtext">快速在线咨询</View>
                    </View>

                </View>
                <View className="bar-item-btn">
                    <View className="btn btn-primary btn-bar">
                        <View>致电售楼处</View>
                        <View className="btn-subtext">保护你的真实号码</View>
                    </View>

                </View>
            </View>
        </View>
    )
}

export default HouseType