import React from 'react'
import Taro, { useReady } from '@tarojs/taro'
import { View, Video } from '@tarojs/components'
import { useRouter } from 'tarojs-router'

import './index.scss'

const HouseVideo = () => {
    const { data } = useRouter()
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
                        src={data.video_path}
                        poster={data.image_path}
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