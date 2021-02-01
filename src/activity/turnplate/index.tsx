import React, { useState } from 'react'
import { Canvas, View } from '@tarojs/components'
import classnames from 'classnames'

import './index.scss'

const Turnplate = () => {
    const [btnDisable] = useState<string>('')
    const [awardsList] = useState<any>([])
    const [animationData] = useState<any>({})
    return (
        <View className="turnplate">
            <View className="turnplate-content">
                <View className="turnplate-main">
                    <View className="turnplate-canvas">
                        <View className="canvas-content" animation={animationData}>
                            <Canvas style={{ width: 300, height: 300 }} className="canvas-element" id="turnplateCanvas"></Canvas>
                            <View className="canvas-line">
                                {
                                    awardsList.map((item: any, index: number) => (
                                        <View
                                            key={index}
                                            className="canvas-liitem"
                                            style={{ transform: `rotate(${item.lineTurn})` }}
                                        >
                                        </View>
                                    ))
                                }
                            </View>
                            <View className="canvas-list">
                                {
                                    awardsList.map((item: any, index: number) => (
                                        <View key={index} className="canvas-item">
                                            <View className="canvas-item-text" style={{ transform: `rotate(${item.turn})` }}>
                                                {item.award}
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                        <View className={classnames('turnplate-btn', btnDisable)}>抽奖</View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Turnplate