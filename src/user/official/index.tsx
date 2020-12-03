import React from 'react'
import { View, Image } from "@tarojs/components"

import official_img from '@assets/icons/official.jpg'
import './index.scss'

const step_1 = 'https://static.fczx.com/www/assets/mini/step_1.png'
const step_2 = 'https://static.fczx.com/www/assets/mini/step_2.png'
const step_3 = 'https://static.fczx.com/www/assets/mini/step_3.png'

const Official = () => {
    
    return (
        <View className="official">
            <View className="official-code">
                <Image src={official_img} mode="aspectFill" showMenuByLongpress={true}/>
            </View>
            <View className="official-steps">
                <View className="steps-title">
                    如何关注公众号
                </View>
                <View className="steps-item">
                    <View className="steps-text">1、长按上方二维码存图像</View>
                    <View className="steps-image">
                        <Image src={step_1} mode="aspectFill"></Image>
                    </View>
                </View>
                <View className="steps-item">
                    <View className="steps-text">2、微信右上角扫一扫至相册选取图片</View>
                    <View className="steps-image">
                        <Image src={step_2} mode="aspectFill"></Image>
                    </View>
                </View>
                <View className="steps-item">
                    <View className="steps-text">3、点击关注公众号</View>
                    <View className="steps-image">
                        <Image src={step_3} mode="aspectFill"></Image>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Official