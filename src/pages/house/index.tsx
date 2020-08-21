import React, { useState } from 'react'
import Taro, { getCurrentInstance, useReady, switchTab } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '../../services/api'
import app from '../../services/request'
import NavBar from '../../components/navbar/index'
import useNavData from '../../hooks/useNavData'
import './index.scss'

const House = () => {
    const { contentHeight } = useNavData()
    const [albumCurrIndex, setAlbumCurrIndex] = useState<number>(0)
    const [houseData, setHouseData] = useState<any>({})

    useReady(() => {
        let currentRouter: any = getCurrentInstance().router
        let params: any = currentRouter.params
        if (params.id) {
            app.request({ url: api.getHouseById, data: { id: params.id } }, { isMock: true })
                .then((result: any) => {
                    setHouseData(result)
                })
        }
    })

    const onSwiperChange = (event) => {
        console.log(event)
    }

    const switchAlbum = (index: number) => {
        setAlbumCurrIndex(index)
    }

    return (
        <View className="house">
            <NavBar title={houseData.house_name || '楼盘'} back={true} />
            <ScrollView style={{ height: `${contentHeight}px` }} scrollY>
                <View className="house-album">
                    <Swiper style={{ height: '225px' }} current={albumCurrIndex} onChange={onSwiperChange}>
                        {
                            houseData.house_album && houseData.house_album.map((albumItem: any) => {
                                return albumItem.images.map((imageItem: any, imageIndex: number) => {
                                    return (
                                        <SwiperItem key={imageIndex}>
                                            <Image style="width: 100%; height: 240px" src={imageItem.image_path} mode='widthFix'></Image>
                                            {albumItem.type == 'video' && <Text className="auto-center icon-vedio"></Text>}
                                        </SwiperItem>
                                    )
                                })
                            })
                        }
                    </Swiper>
                    <View className="album-count">共30张</View>
                    <View className="album-text">
                        {
                            houseData.house_album && houseData.house_album.map((albumItem: any, albumIndex: number) => {
                                return <Text 
                                className={classnames('album-text-item', albumIndex == albumCurrIndex && 'album-text-actived')} 
                                key={albumIndex}
                                onClick={() => switchAlbum(albumIndex)}
                                >{albumItem.name}</Text>
                            })
                        }
                    </View>
                </View>
                <View className="view-content">123</View>
            </ScrollView>
        </View>
    )
}
export default House