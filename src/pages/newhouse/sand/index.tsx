import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, MovableArea, MovableView, Image, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import './index.scss'


const HouseSand = () => {
    const [movableView, setMovableView] = useState<any>({})

    const winData = Taro.getSystemInfoSync()

    const handleSandImageLoad = (e: any) => {
        setMovableView({
            width: e.detail.width,
            height: e.detail.height
        })
    }
    return (
        <View className="sand">
            <NavBar title="沙盘图"></NavBar>
            <View className="sand-wrapper">
                <View className="sand-card">
                    <MovableArea className="sand-area">
                        <MovableView
                            x={(winData.safeArea.width - movableView.width) / 2}
                            y={(300 - movableView.height) / 2}
                            style={movableView}
                            className="sand-view"
                            direction="all"
                            animation={false}
                        >
                            <Image className="sand-image" src="http://192.168.2.248/assets/images/sand_900x600c.jpg" onLoad={handleSandImageLoad}></Image>
                            <View className="sand-item sale-status-1" style={{ top: 120, left: 328 }}>
                                <Text>#1</Text>
                                <Text className="triangle-down"></Text>
                            </View>
                            <View className="sand-item sale-status-3" style={{ top: 120, left: 464 }}>
                                <Text>#2</Text>
                                <Text className="triangle-down"></Text>
                            </View>
                            <View className="sand-item sale-status-2" style={{ top: 90, left: 594 }}>
                                <Text>#3</Text>
                                <Text className="triangle-down"></Text>
                            </View>
                            <View className="sand-item sale-status-1" style={{ top: 240, left: 614 }}>
                                <Text>#4</Text>
                                <Text className="triangle-down"></Text>
                            </View>
                            <View className="sand-item sale-status-1" style={{ top: 184, left: 516 }}>
                                <Text>#5</Text>
                                <Text className="triangle-down"></Text>
                            </View>
                            <View className="sand-item sale-status-1" style={{ top: 200, left: 414 }}>
                                <Text>#6</Text>
                                <Text className="triangle-down"></Text>
                            </View>
                            <View className="sand-item sale-status-2" style={{ top: 272, left: 304 }}>
                                <Text>#7</Text>
                                <Text className="triangle-down"></Text>
                            </View>
                        </MovableView>
                    </MovableArea>
                    <View className="sand-state">
                        <View className="sand-state-box"></View>
                        <View className="sand-state-btn">收起</View>
                    </View>
                </View>
                <View className="sand-content"></View>
            </View>
        </View>
    )
}

export default HouseSand