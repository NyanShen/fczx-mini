import React, { useEffect, useState } from 'react'
import { View, ScrollView, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

const AlbumList = () => {
    const [currentView, setCurrentView] = useState<string>('')
    const { appHeaderHeight, contentHeight } = useNavData()
    const fixedHeight = 40
    const [albumData, setAlbumData] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: api.getHouseAlbum,
            data: { fang_house_id: '1000006' }
        }, { isMock: true })
            .then((result: any) => {
                setCurrentView(`view_${result[0].id}`)
                setAlbumData(result)
            })
    }, [])

    const handleTabClick = (item: any) => {
        setCurrentView(`view_${item.id}`)
    }

    return (
        <View className="album">
            <NavBar title="楼盘相册" back={true} />
            <View className="fixed">
                <View className="album-tabs">
                    {
                        albumData.length > 0 && albumData.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleTabClick(item)}
                                className={classnames('tab-item', currentView === `view_${item.id}` && 'actived')}>
                                <Text>{item.name}</Text>
                            </View>
                        ))
                    }
                </View>
            </View>
            <View className="album-content view-content">
                <ScrollView
                    scrollY
                    scrollIntoView={currentView}
                    scrollWithAnimation={true}
                    style={{ maxHeight: contentHeight - fixedHeight }}
                >
                    {
                        albumData.length > 0 &&
                        albumData.map((item: any, index: number) => (
                            <View className="album-item" id={`view_${item.id}`} key={index}>
                                <View className="album-title">{item.name}</View>
                                <View className="album-list">
                                    {
                                        item.fangHouseImage.length > 0 &&
                                        item.fangHouseImage.map((imageItem: any, imageIndex: number) => (
                                            <View className="album-list-item" key={imageIndex}>
                                                <Image src={imageItem.image_path}></Image>
                                            </View>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
            <View className="album-swiper" style={{ top: appHeaderHeight }}>
                <View className="album-swiper-header">
                    <View className="album-count">1/1</View>
                    <View className="iconfont iconclose"></View>
                </View>
                <View className="album-swiper-content">
                    <Swiper style={{ height: contentHeight - 85 }}>
                        {
                            albumData.length > 0 &&
                            albumData.map((albumItem: any) => {
                                return albumItem.fangHouseImage.map((imageItem: any, imageIndex: number) => {
                                    return (
                                        <SwiperItem key={imageIndex} itemId={`${albumItem.id},${imageIndex}`}>
                                            <Image className="swiper-image" src={imageItem.image_path} mode='widthFix'></Image>
                                        </SwiperItem>
                                    )
                                })
                            })
                        }
                    </Swiper>
                </View>
                <View className="album-swiper-bar album-tabs">
                    {
                        albumData.length > 0 &&
                        albumData.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleTabClick(item)}
                                className={classnames('tab-item', currentView === `view_${item.id}` && 'actived')}>
                                <Text>{item.name}</Text>
                            </View>
                        ))
                    }
                </View>
            </View>
        </View>
    )
}

export default AlbumList