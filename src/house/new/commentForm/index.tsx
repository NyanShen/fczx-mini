import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Textarea, View, Text, Image } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import './index.scss'

interface ITextData {
    count?: number,
    value: string
}

const INIT_TEXT_DATA = {
    value: '',
    count: 0
}

const HouseCommentForm = () => {
    const textCount = 150
    const router = getCurrentInstance().router
    const houseId = router?.params.id
    const houseTitle = router?.params.title
    const [textData, setTextData] = useState<ITextData>(INIT_TEXT_DATA)
    const [imagePath, setImagePath] = useState<string>('')

    const handleInputChange = (e: any) => {
        const { cursor, value } = e.detail
        setTextData({
            value,
            count: cursor
        })
    }

    const handleUploadImage = () => {
        Taro.chooseImage({
            count: 1,
            success: ((res: any) => {
                app.uploadFile(res, (result: string) => {
                    setImagePath(result)
                })
            })
        })
    }

    const submitComment = () => {
        app.request({
            url: app.areaApiUrl(api.postHouseComment),
            method: 'POST',
            data: {
                fang_house_id: houseId,
                content: textData.value,
                image_path: imagePath
            }
        }).then(() => {
            Taro.redirectTo({ url: `/house/new/comment/index?id=${houseId}&title=${houseTitle}` })
        })
    }

    return (
        <View className="comment-form">
            <NavBar title="点评" back={true}></NavBar>
            <View className="comment-wrapper">
                <View className="comment-title">
                    写下对楼盘【{houseTitle}】的点评
                </View>
                <View className="comment-input">
                    <Textarea
                        autoFocus
                        autoHeight
                        maxlength={textCount}
                        placeholderClass="small-desc"
                        className="comment-input-text"
                        placeholder="楼盘的环境、位置、配套设置满意吗？说说你的看法"
                        onInput={handleInputChange}
                    />
                    <View className="comment-input-image">
                        <View className="image-wrapper">
                            {
                                imagePath &&
                                <View className="image-show">
                                    <Text className="iconfont iconclear" onClick={() => setImagePath('')}></Text>
                                    <Image src={imagePath} />
                                </View>
                            }
                        </View>
                        <View className="upload-btn" onClick={handleUploadImage}>
                            <Text className="text">上传图片</Text>
                        </View>
                    </View>
                    <View className="comment-input-count">{textData.count}/{textCount}</View>
                </View>
                <View className="comment-action">
                    <View className="btn btn-primary" onClick={submitComment}>提交评论</View>
                </View>
            </View>
        </View>
    )
}

export default HouseCommentForm