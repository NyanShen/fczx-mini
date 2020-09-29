import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { Textarea, View, Text, Image } from '@tarojs/components'

import NavBar from '@components/navbar'
import './index.scss'

const HouseCommentForm = () => {
    const [imagePath, setImagePath] = useState<string>('')

    const uploadImage = () => {
        Taro.chooseImage({
            count: 1,
            success: ((res: any) => {
                setImagePath(res.tempFilePaths[0]) //todo:上传图片接口
            })
        })
    }

    const deleteImage = () => {
        setImagePath('')
    }
    return (
        <View className="comment-form">
            <NavBar title="写评论" back={true}></NavBar>
            <View className="comment-wrapper">
                <View className="comment-title">
                    写下对楼盘【】的点评
                </View>
                <View className="comment-input">
                    <Textarea
                        autoHeight
                        placeholderClass="small-desc"
                        className="comment-input-text"
                        placeholder="楼盘的环境、位置、配套设置满意吗？说说你的看法"
                    />
                    <View className="comment-input-image">
                        <View className="image-show">
                            {
                                imagePath &&
                                <View>
                                    <Text className="iconfont iconclear" onClick={deleteImage}></Text>
                                    <Image src={imagePath} />
                                </View>
                            }
                        </View>
                        <View className="upload-btn" onClick={uploadImage}>
                            <Text className="text">上传图片</Text>
                        </View>
                    </View>
                </View>
                <View className="comment-action">
                    <View className="btn btn-primary">提交评论</View>
                </View>
            </View>
        </View>
    )
}

export default HouseCommentForm