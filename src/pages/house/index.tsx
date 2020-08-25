import React, { useState } from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import classnames from 'classnames'
import { parseInt } from 'lodash'

import api from '../../services/api'
import app from '../../services/request'
import NavBar from '../../components/navbar/index'
import useNavData from '../../hooks/useNavData'
import './index.scss'

interface IAlbumSwiper {
    albumId: string
    imageIndex: number
    swiperIndex: number,
    itemLength: number
}

const INIT_ALBUM_SWIPER = { albumId: '', imageIndex: 0, swiperIndex: 0, itemLength: 0 }

const House = () => {
    const { contentHeight } = useNavData()
    const [albumSwiper, setAlbumSwiper] = useState<IAlbumSwiper>(INIT_ALBUM_SWIPER)
    const [houseData, setHouseData] = useState<any>({})

    useReady(() => {
        let currentRouter: any = getCurrentInstance().router
        let params: any = currentRouter.params
        if (params.id) {
            app.request({ url: api.getHouseById, data: { id: params.id } }, { isMock: true })
                .then((result: any) => {
                    setHouseData(result)
                    setAlbumSwiper({
                        ...albumSwiper,
                        itemLength: result.house_album[0].images.length,
                        albumId: result.house_album[0].id,
                    })
                })
        }
    })

    const onSwiperChange = (event) => {
        let swiperIndex = event.detail.current;
        let currentItem = event.detail.currentItemId.split(',');
        let albumId = currentItem[0];
        let imageIndex = parseInt(currentItem[1]);
        let itemLength = findAlbumById(albumId).length
        setAlbumSwiper({
            albumId,
            imageIndex,
            swiperIndex,
            itemLength
        })
    }

    const switchAlbum = (albumId: string) => {
        const currenAlbum = findAlbumById(albumId)
        setAlbumSwiper({
            albumId,
            imageIndex: 0,
            swiperIndex: currenAlbum.indexBefore,
            itemLength: currenAlbum.length
        })
    }

    const findAlbumById = (albumId: string) => {
        let indexBefore = 0;
        let album: any = null;
        for (const item of houseData.house_album) {
            if (item.id === albumId) {
                album = item
                break;
            }
            indexBefore = indexBefore + item.images.length
        }

        return {
            id: albumId,
            length: album.images.length,
            images: album.images,
            indexBefore
        }
    }

    const navigateTo = (url: string, params: any = {}) => {
        Taro.navigateTo({ url })
    }

    return (
        <View className="house">
            <NavBar title={houseData.house_name || '楼盘'} back={true} />
            <ScrollView style={{ height: `${contentHeight}px` }} scrollY>
                <View className="house-album">
                    <Swiper style={{ height: '225px' }} current={albumSwiper.swiperIndex} onChange={onSwiperChange}>
                        {
                            houseData.house_album && houseData.house_album.map((albumItem: any) => {
                                return albumItem.images.map((imageItem: any, imageIndex: number) => {
                                    return (
                                        <SwiperItem key={imageIndex} itemId={`${albumItem.id},${imageIndex}`}>
                                            <Image style="width: 100%; height: 240px" src={imageItem.image_path} mode='widthFix'></Image>
                                            {albumItem.type == 'video' && <Text className="auto-center icon-vedio"></Text>}
                                        </SwiperItem>
                                    )
                                })
                            })
                        }
                    </Swiper>
                    <View className="album-count">{albumSwiper.imageIndex + 1}/{albumSwiper.itemLength}</View>
                    <View className="album-text">
                        {
                            houseData.house_album && houseData.house_album.map((albumItem: any, albumIndex: number) => {
                                return <Text
                                    className={classnames('album-text-item', albumItem.id == albumSwiper.albumId && 'album-text-actived')}
                                    key={albumIndex}
                                    onClick={() => switchAlbum(albumItem.id)}
                                >{albumItem.name}</Text>
                            })
                        }
                    </View>
                </View>
                <View className="house-header">
                    <View className="name">{houseData.house_name}</View>
                    <View className="tags">
                        <Text className="tags-item sale-status">在售</Text>
                        <Text className="tags-item">毛坯</Text>
                        <Text className="tags-item">中高层</Text>
                    </View>
                </View>
                <View className="view-content info">
                    <View className="info-item">
                        <Text className="label">售价</Text>
                        <Text className="price">20012</Text>
                        <Text className="text">元/m²</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">开盘</Text>
                        <Text className="text">已于2019年6月23号开盘</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">地址</Text>
                        <Text className="text address">东津新区东西轴线与南山路交汇处东津新区东西轴线与南山路交汇处</Text>
                        <Text className="iconfont iconaddress"></Text>
                    </View>
                    <View className="btn" onClick={() => navigateTo('/pages/house/detail')}>
                        <Text className="btn-name">查看更多楼盘详情</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
export default House