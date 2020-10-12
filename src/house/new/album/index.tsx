import React, { useCallback, useEffect, useState } from 'react'
import { View, ScrollView, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import './index.scss'

interface IAlbumSwiper {
    open: boolean
    albumId: string
    imageIndex: number
    swiperIndex: number
    imageLength: number
}

const INIT_ALBUM_SWIPER = {
    open: false,
    albumId: '',
    imageIndex: 0,
    swiperIndex: 0,
    imageLength: 0
}

const AlbumList = () => {
    const fixedHeight = 40
    const { appHeaderHeight, contentHeight } = useNavData()

    const [albumData, setAlbumData] = useState<any[]>([])
    const [currentView, setCurrentView] = useState<string>('')
    const [albumSwiper, setAlbumSwiper] = useState<IAlbumSwiper>(INIT_ALBUM_SWIPER)

    useEffect(() => {
        app.request({
            url: app.testApiUrl(api.getHouseAlbum),
            data: { fang_house_id: '1000006' }
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
        const swiperItem = findAlbumById(albumItem.id)
        setAlbumSwiper({
            open: true,
            albumId: swiperItem.id,
            imageIndex: imageIndex,
            swiperIndex: swiperItem.indexBefore + imageIndex,
            imageLength: swiperItem.length
        })
        if (currentView === `view_${albumItem.id}`) {
            return
        }
        setCurrentView(`view_${albumItem.id}`)
    }

    const onSwiperChange = (event) => {
        let swiperIndex = event.detail.current;
        let currentItem = event.detail.currentItemId.split(',');
        let albumId = currentItem[0];
        let imageIndex = parseInt(currentItem[1]);
        let imageLength = findAlbumById(albumId).length
        setAlbumSwiper({
            ...albumSwiper,
            albumId,
            imageIndex,
            swiperIndex,
            imageLength
        })
        if (currentView === `view_${albumId}`) {
            return
        }
        setCurrentView(`view_${albumId}`)
    }

    const handleCloseAlbum = useCallback(() => {
        setAlbumSwiper({
            ...albumSwiper,
            open: false
        })
    }, [albumSwiper.open])

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
            <NavBar title="楼盘相册" back={true} />
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
                    style={{ maxHeight: contentHeight - fixedHeight }}
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

            {
                albumSwiper.open &&
                <View className="album-swiper" style={{ top: appHeaderHeight }}>
                    <View className="album-swiper-header">
                        <View className="album-count">
                            <Text>{albumSwiper.imageIndex + 1}/{albumSwiper.imageLength}</Text>
                        </View>
                        <View className="iconfont iconclose" onClick={handleCloseAlbum}></View>
                    </View>
                    <View className="album-swiper-content">
                        <Swiper
                            circular
                            style={{ height: contentHeight - 80 }}
                            current={albumSwiper.swiperIndex}
                            onChange={onSwiperChange}
                        >
                            {
                                albumData.length > 0 &&
                                albumData.map((albumItem: any) => {
                                    return albumItem.fangHouseImage.map((imageItem: any, imageIndex: number) => {
                                        return (
                                            <SwiperItem key={imageIndex} itemId={`${albumItem.id},${imageIndex}`}>
                                                <Image className="swiper-image" src={imageItem.image_path} mode='widthFix'></Image>
                                                <View className="swiper-text">
                                                    <Text>{albumItem.name}</Text>
                                                </View>
                                            </SwiperItem>
                                        )
                                    })
                                })
                            }
                        </Swiper>
                    </View>
                    <View className="album-swiper-footer">
                        <ScrollView className="album-tabs" scrollX>
                            {
                                albumData.length > 0 &&
                                albumData.map((item: any, index: number) => (
                                    <View
                                        key={index}
                                        onClick={() => handleTabClick(item, true)}
                                        className={classnames('tab-item', currentView === `view_${item.id}` && 'actived')}>
                                        <Text>{item.name}</Text>
                                    </View>
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            }

        </View>
    )
}

export default AlbumList