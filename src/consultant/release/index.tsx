import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Textarea } from '@tarojs/components'

import app from '@services/request'
import './index.scss'
const maxCount: number = 9
const INIT_MEDIA = { type: '', show: true, list: [] }
interface ITextData {
    count?: number,
    value: string
}

const INIT_TEXT_DATA = {
    value: '',
    count: 0
}
const ReleaseDynamic = () => {
    const [media, setMedia] = useState<any>(INIT_MEDIA)
    const [textData, setTextData] = useState<ITextData>(INIT_TEXT_DATA)

    const handleInputChange = (e: any) => {
        const { cursor, value } = e.detail
        setTextData({
            value,
            count: cursor
        })
    }
    const handleMediaInput = () => {
        if (!media.type) {
            Taro.showActionSheet({
                itemList: ['从相册选择图片', '从相册选择视频', '拍摄照片', '拍摄视频'],
                success: function (res: any) {
                    switch (res.tapIndex) {
                        case 0:
                            handleChooseImage(['album'])
                            break
                        case 2:
                            handleChooseImage(['camera'])
                            break
                        case 1:
                            handleChooseVideo(['album'])
                            break
                        case 3:
                            handleChooseVideo(['camera'])
                            break
                        default:
                            handleChooseImage(['album'])
                    }
                },
                fail: function (res: any) {
                    console.log(res.errMsg)
                }
            })
            return
        }
        if (media.type === 'image') {
            handleChooseImage(['album', 'camera'])
        }
    }

    const handleChooseImage = (sourceType: any) => {
        Taro.chooseImage({
            count: maxCount - media.list.length,
            sourceType: sourceType,
            success: (res: any) => {
                app.uploadFile(res, (result: string) => {
                    media.type = 'image'
                    media.list.push(result)
                    if (media.list.length >= 8) {
                        media.show = false
                    }
                    setMedia({ ...media })
                })
            }
        })
    }

    const handleChooseVideo = (sourceType: any) => {
        Taro.chooseVideo({
            sourceType: sourceType,
            success: (res: any) => {
                app.uploadFile(res, (result: string) => {
                    media.show = false
                    media.type = 'video'
                    media.list.push(result)
                    setMedia({ ...media })
                    console.log('video', media)
                })
            }
        })
    }

    const deleteMediaItem = (index: number) => {
        media.list.splice(index, 1)
        if (media.list.length === 0) {
            media.type = ''
        }
        media.show = true
        setMedia({ ...media })
    }

    const handleRelease = () => {
        console.log(textData, media)
    }
    return (
        <View className="release">
            <View className="release-content">
                <View className="release-item release-flex">
                    <View className="item-label">
                        关联楼盘
                    </View>
                    <View className="item-input">
                        <Text className="text">楼盘信息</Text>
                    </View>
                </View>
                <View className="release-item">
                    <View className="item-label">
                        文字描述
                    </View>
                    <View className="item-input">
                        <Textarea
                            maxlength={150}
                            placeholder="请输入文字描述"
                            onInput={handleInputChange}
                        />
                    </View>
                </View>
                <View className="release-item">
                    <View className="item-label">
                        上传图片/视频
                    </View>
                    <View className="item-media">
                        {
                            media.list.map((item: string, index: number) => (
                                <View className="media-item" key={index}>
                                    <Image src={item} mode="aspectFill" />
                                    {media.type === 'video' && <Text className="iconfont iconvideo"></Text>}
                                    <Text className="iconfont iconclear" onClick={() => deleteMediaItem(index)}></Text>
                                </View>
                            ))
                        }
                        {
                            media.show &&
                            <View className="media-item" onClick={handleMediaInput}>
                                <Text className="iconfont iconaddphoto"></Text>
                            </View>
                        }
                    </View>
                </View>
                <View className="release-item" onClick={handleRelease}>
                    <View className="btn btn-primary">发布</View>
                </View>
            </View>
        </View>
    )
}

export default ReleaseDynamic