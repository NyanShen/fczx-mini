import React from 'react'
import Taro from '@tarojs/taro'
import { ScrollView, View, Image, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const HouseConsultant = () => {
    const { contentHeight } = useNavData()

    const handleCopyWechat = (text: string) => {
        Taro.setClipboardData({
            data: text
        })
    }
    return (
        <View className="house-consultant">
            <NavBar title="置业顾问列表" back={true}></NavBar>
            <View className="house-consultant-content">
                <ScrollView scrollY style={{ maxHeight: contentHeight }}>
                    <View className="consultant-item">
                        <View className="item-image">
                            <Image src=""></Image>
                        </View>
                        <View className="item-text">
                            <View className="name">程海燕</View>
                            <View className="wechat" onClick={() => handleCopyWechat('sym_13223234567')}>
                                <Text> 微信：sym_13223234567</Text>
                                <Text className="iconfont iconcopy"></Text>
                            </View>
                        </View>
                        <View className="item-action">
                            <Text className="iconfont iconmessage"></Text>
                        </View>
                        <View className="item-action">
                            <Text className="iconfont iconcall"></Text>
                        </View>
                    </View>
                    <View className="consultant-item">
                        <View className="item-image">
                            <Image src=""></Image>
                        </View>
                        <View className="item-text">
                            <View className="name">程海燕</View>
                            <View className="wechat">
                                <Text>微信：13223234567</Text>
                                <Text className="iconfont iconcopy"></Text>
                            </View>
                        </View>
                        <View className="item-action">
                            <Text className="iconfont iconmessage"></Text>
                        </View>
                        <View className="item-action">
                            <Text className="iconfont iconcall"></Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default HouseConsultant