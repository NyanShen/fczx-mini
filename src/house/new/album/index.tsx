import React, { useCallback, useEffect, useState } from 'react'
import { getCurrentInstance, previewImage } from '@tarojs/taro'
import { View, ScrollView, Text, Image } from '@tarojs/components'
import classnames from 'classnames'
import map from 'lodash/map'

import api from '@services/api'
import app from '@services/request'
import { toHouseNew } from '@/router'
import useNavData from '@hooks/useNavData'
import './index.scss'

interface IAlbumSwiper {
    albumId: string
    imageIndex: number
    swiperIndex: number
    imageLength: number
}

const INIT_ALBUM_SWIPER = {
    albumId: '',
    imageIndex: 0,
    swiperIndex: 0,
    imageLength: 0
}

const AlbumList = () => {
    const fixedHeight = 40
    const router = getCurrentInstance().router
    const houseId = router?.params.id
    const { contentHeight } = useNavData()

    const [albumData, setAlbumData] = useState<any[]>([])
    const [currentView, setCurrentView] = useState<string>('')
    const [albumSwiper, setAlbumSwiper] = useState<IAlbumSwiper>(INIT_ALBUM_SWIPER)

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getHouseAlbum),
            data: { fang_house_id: houseId }
        }).then((result: any) => {
            setCurrentView(`view_${result[0].id}`)
            setAlbumData(result)
        })
    }, [])

    const handleTabClick = (item: any, isSwiper: boolean = false) => {
        setCurrentView(`view_${item.id}`)
        if (isSwiper) {
            const swiperItem = findAlbumById(item.id)
            setAlbumSwiper({
                ...albumSwiper,
                albumId: swiperItem.id,
                imageIndex: 0,
                swiperIndex: swiperItem.indexBefore,
                imageLength: swiperItem.length
            })
        }
    }

    const handleImageClick = (albumItem: any, imageIndex: number) => {
        if (albumItem.type == '2') {
            toHouseNew('Video', {}, albumItem.fangHouseImage[imageIndex])
            return
        }
        previewImage({
            current: albumItem.fangHouseImage[imageIndex].image_path,
            urls: map(albumItem.fangHouseImage, 'image_path')
        })

        if (currentView === `view_${albumItem.id}`) {
            return
        }
        setCurrentView(`view_${albumItem.id}`)
    }

    const findAlbumById = useCallback((albumId: string) => {
        let indexBefore = 0;
        let album: any = null;
        for (const item of albumData) {
            if (item.id === albumId) {
                album = item
                break;
            }
            indexBefore = indexBefore + item.fangHouseImage.length
        }

        return {
            id: albumId,
            length: album.fangHouseImage.length,
            fangHouseImage: album.fangHouseImage,
            indexBefore
        }
    }, [albumData])

    return (
        <View className="album">
            <View className="fixed">
                <ScrollView className="album-tabs" scrollX>
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
                </ScrollView>
            </View>
            <View className="album-content view-content">
                <ScrollView
                    scrollY
                    scrollIntoView={currentView}
                    scrollWithAnimation={true}
                    style={{ maxHeight: `${contentHeight - fixedHeight}px` }}
                >
                    {
                        albumData.length > 0 &&
                        albumData.map((item: any, index: number) => (
                            <View key={index} className="album-item" id={`view_${item.id}`}>
                                <View className="album-title">{item.name}</View>
                                <View className="album-list">
                                    {
                                        item.fangHouseImage.length > 0 &&
                                        item.fangHouseImage.map((imageItem: any, imageIndex: number) => (
                                            <View
                                                key={imageIndex}
                                                className="album-list-item"
                                                onClick={() => handleImageClick(item, imageIndex)}
                                            >
                                                {item.type == '2' && <Text className="icon-vedio"></Text>}
                                                <Image className="taro-image" src={imageItem.image_path} mode="aspectFill"></Image>
                                            </View>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default AlbumList