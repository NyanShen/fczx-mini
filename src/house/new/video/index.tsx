import React from 'react'
import {getCurrentInstance} from '@tarojs/taro'
import { View, Video } from '@tarojs/components'

import NavBar from '@components/navbar'
import './index.scss'

const HouseVideo = () => {
    let currentRouter: any = getCurrentInstance().router
    let params: any = currentRouter.params
    const video = JSON.parse(params.video)
    return (
        <View className="house-video">
            <NavBar title="楼盘视频" back={true}></NavBar>
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