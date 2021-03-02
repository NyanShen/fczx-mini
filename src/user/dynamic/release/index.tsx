import React, { useState } from 'react'
import Taro, { getCurrentPages } from '@tarojs/taro'
import { View, Text, Image, Textarea } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import './index.scss'
const maxCount: number = 9
interface ITextData {
    count: number,
    value: string
}

const INIT_TEXT_DATA = {
    value: '',
    count: 0
}
const ReleaseDynamic = () => {
    const INIT_MEDIA = { type: '', show: true, list: [] }
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
                    let is_face = '1'
                    media.type = 'image'
                    if (media.list.length === 0) {
                        is_face = '0'
                    }
                    if (media.list.length >= 8) {
                        media.show = false
                    }
                    media.list.push({
                        is_face,
                        image_path: result
                    })
                    setMedia({ ...media })
                })
            }
        })
    }

    const handleChooseVideo = (sourceType: any) => {
        let face_path: string = ''
        let video_path: string = ''
        let fileCount: number = 0

        Taro.chooseMedia({
            count: 1,
            mediaType: ['video'],
            sourceType: sourceType,
            success: (res: any) => {
                app.uploadFile(res, (result: string) => {
                    fileCount = fileCount + 1
                    const flieArr = result.split('.');
                    const suffix = flieArr[flieArr.length - 1];
                    const imagelist = ['png', 'jpg', 'jpeg', 'bmp', 'gif'];
                    const videolist = ['mp4', 'm2v', 'mkv', 'rmvb', 'wmv', 'avi', 'flv', 'mov', 'm4v'];
                    if (imagelist.includes(suffix)) {
                        face_path = result
                    }
                    if (videolist.includes(suffix)) {
                        video_path = result
                    }
                    if (fileCount === 2) {
                        media.show = false
                        media.type = 'video'
                        media.list.push({
                            face_path,
                            video_path
                        })
                        setMedia({ ...media })
                    }
                })
            }
        })
    }

    const handleImageClick = (index: number) => {
        for (const item of media.list) {
            item.is_face = '1'
        }
        media.list[index].is_face = '0'
        setMedia({ ...media })
    }

    const deleteMediaItem = (index: number) => {
        if (media.list[index].is_face === '0' && media.list.length !== 1) {
            media.list.splice(index, 1)
            media.list[0].is_face = '0'
        } else {
            media.list.splice(index, 1)
        }
        if (media.list.length === 0) {
            media.type = ''
        }
        media.show = true
        setMedia({ ...media })
    }

    const handleRelease = () => {
        if (!textData.value && textData.count < 10) {
            Taro.showToast({
                title: '文字描述少于10字',
                icon: 'none'
            })
            return
        }
        if (media.list.length <= 0) {
            Taro.showToast({
                title: '请上传图片或是视频',
                icon: 'none'
            })
            return
        }
        let postData = { content: textData.value }

        if (media.type === 'video') {
            postData = {
                ...postData, ...{
                    face_path: media.list[0].face_path,
                    video_path: media.list[0].video_path
                }
            }
        } else {
            postData = {
                ...postData, ...{ fangHouseCircleImage: media.list }
            }

        }
        app.request({
            url: app.areaApiUrl(api.postUserDynamic),
            method: 'POST',
            data: postData
        }).then(() => {
            const pages: any = getCurrentPages()
            const prevPage: any = pages[pages.length - 2]
            prevPage.setData({ isUpdate: true })
            Taro.showToast({
                title: '发布成功'
            })
            setTimeout(() => {
                Taro.navigateBack({ delta: 1 })
            }, 500);
        })
    }
    return (
        <View className="release">
            <View className="release-content">
                {/* <View className="release-item release-flex">
                    <View className="item-label">
                        关联楼盘
                    </View>
                    <View className="item-input">
                        <Text className="text">楼盘信息</Text>
                    </View>
                </View> */}
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
                            media.type === 'image' &&
                            media.list.map((item: any, index: number) => (
                                <View className="media-item" key={index} onClick={() => handleImageClick(index)}>
                                    <Image className="taro-image" src={item.image_path} mode="aspectFill" />
                                    {item.is_face === '0' &&
                                        <View className="media-statement">
                                            <View className="media-mask"></View>
                                            <View className="media-text">封面图</View>
                                        </View>
                                    }
                                    <Text className="iconfont iconclear" onClick={() => deleteMediaItem(index)}></Text>
                                </View>
                            ))
                        }
                        {
                            media.type === 'video' &&
                            <View className="media-item">
                                <Image className="taro-image" src={media.list[0].face_path} mode="aspectFill" />
                                <Text className="iconfont iconvideo"></Text>
                                <Text className="iconfont iconclear" onClick={() => deleteMediaItem(0)}></Text>
                            </View>
                        }

                        {
                            media.show &&
                            <View className="media-item" onClick={handleMediaInput}>
                                <Text className="iconfont iconaddphoto"></Text>
                            </View>
                        }
                    </View>
                    {
                        media.type === 'image' &&
                        <View className="item-tip">(最多上传9张图片，点击图片设置封面图)</View>
                    }
                </View>
                <View className="release-item" onClick={handleRelease}>
                    <View className="btn btn-primary">发布</View>
                </View>
            </View>
        </View>
    )
}

export default ReleaseDynamic