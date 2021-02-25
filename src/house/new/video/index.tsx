import React from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Video } from '@tarojs/components'

import './index.scss'

const HouseVideo = () => {
    let currentRouter: any = getCurrentInstance().router
    let params: any = currentRouter.params
    const video = JSON.parse(params.video)
    useReady(() => {
        Taro.setNavigationBarTitle({ title: '视频' })
    })
    return (
        <View className="house-video">
            <View className="video-wrapper">
                <View className="video-content">
                    <Video
                        id='video'
                        style={{ width: '100%' }}
                        src={video.video_path}
                        poster={video.image_path}
                        controls={true}
                        autoplay={true}
                        loop={false}
                        muted={false}
                    />
                </View>
            </View>
        </View>
    )
}

export default HouseVideo