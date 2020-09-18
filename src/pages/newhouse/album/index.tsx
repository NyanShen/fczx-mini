import React, { useState } from 'react'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import classnames from 'classnames'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const AlbumList = () => {
    const [currentView, setCurrentView] = useState<string>('view_01')
    const { contentHeight } = useNavData()
    const fixedHeight = 40

    const albumTabs = [
        {
            id: 'view_01',
            name: '效果图'
        },
        {
            id: 'view_02',
            name: '样板图'
        },
        {
            id: 'view_03',
            name: '实景图'
        },
        {
            id: 'view_04',
            name: '周边配套'
        }
    ]

    const handleTabClick = (item: any) => {
        setCurrentView(item.id)
    }
    
    return (
        <View className="album">
            <NavBar title="楼盘相册" back={true} />
            <View className="fixed">
                <ScrollView className="album-tabs" scrollX>
                    {
                        albumTabs.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleTabClick(item)}
                                className={classnames('tab-item', currentView === item.id && 'actived')}>
                                <Text>{item.name}</Text>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
            <View className="album-content view-content">
                <ScrollView
                    scrollY
                    scrollIntoView={currentView}
                    scrollWithAnimation={true}
                    style={{ maxHeight: contentHeight - fixedHeight }}>
                    <View className="album-item" id="view_01">
                        <View className="album-title">效果图</View>
                        <View className="album-list">
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                        </View>
                    </View>
                    <View className="album-item" id="view_02">
                        <View className="album-title">样板图</View>
                        <View className="album-list">
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                        </View>
                    </View>
                    <View className="album-item" id="view_03">
                        <View className="album-title">实景图</View>
                        <View className="album-list">
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                        </View>
                    </View>
                    <View className="album-item" id="view_04">
                        <View className="album-title">周边配套</View>
                        <View className="album-list">
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="album-list-item">
                                <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>

        </View>
    )
}

export default AlbumList