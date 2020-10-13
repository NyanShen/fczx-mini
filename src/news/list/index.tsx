import React from 'react'
import { ScrollView, View, Image, Text } from '@tarojs/components'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const NewsList = () => {
    const { contentHeight } = useNavData()
    return (
        <View className="news">
            <NavBar title="资讯" back={true}></NavBar>
            <View className="news-content view-content">
                <ScrollView scrollY style={{ maxHeight: contentHeight }}>
                    <View className="news-item">
                        <View className="item-text">
                            <View className="title">君瑞城十月工程进度|抓住黄金施工期 加速度前进！</View>
                            <View className="small-desc mt20">
                                <Text>房产在线</Text>
                                <Text className="date">2020-10-13 16:34:32</Text>
                            </View>
                        </View>
                        <View className="item-image">
                            <Image src=""></Image>
                        </View>
                    </View>
                    <View className="news-item">
                        <View className="item-text">
                        <View className="title">君瑞城十月工程进度|抓住黄金施工期 加速度前进！</View>
                            <View className="small-desc mt20">
                                <Text>房产在线</Text>
                                <Text className="date">2020-10-13 16:34:32</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default NewsList