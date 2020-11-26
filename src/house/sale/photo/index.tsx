import React, { useMemo, useState } from 'react'
import Taro, { getCurrentInstance, getCurrentPages, useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import classnames from 'classnames'
import map from 'lodash/map'

import app from '@services/request'
import NavBar from '@components/navbar'
import './index.scss'

export interface IImage {
    is_face: string
    image_path: string
}
const maxCount = 10
const IS_FACE = '1'
const NOT_FACE = '2'

const SalePhoto = () => {
    const router = getCurrentInstance().router
    const baseImages = JSON.parse(router?.params.images || '')
    const [show, setShow] = useState<boolean>(false)
    const [images, setImages] = useState<IImage[]>([])

    useDidShow(() => {
        if (baseImages) {
            setImages(baseImages)
        }
    })

    const handleImageUpload = () => {
        Taro.chooseImage({
            count: maxCount - images.length,
            success: ((res: any) => {
                app.uploadFile(res, (result: string) => {
                    images.push({
                        is_face: NOT_FACE,
                        image_path: result
                    })
                    setImages([...images])
                })
            })
        })
    }

    const handlePreviewImage = (image_path: string) => {
        Taro.previewImage({
            current: image_path,
            urls: map(images, 'image_path')
        })
    }

    const handleImageDelete = (image_path: string) => {
        const result = images.filter((item: IImage) => item.image_path !== image_path)
        setImages(result)
    }

    const handleFaceImage = (index: number) => {
        for (const image of images) {
            image.is_face = NOT_FACE
        }
        images[index].is_face = IS_FACE
        setShow(false)
        setImages([...images])
    }

    const findFaceImage = () => {
        for (const image of images) {
            if (image.is_face == IS_FACE) {
                return image.image_path
            }
        }
        return ''
    }

    const handleSubmit = () => {
        if (images.length < 1) {
            Taro.showToast({
                title: '请上传房源图片',
                icon: 'none'
            })
            return
        }
        const pages: any = getCurrentPages()
        const prevPage: any = pages[pages.length - 2]
        const isFaceValue = map(images, 'is_face')
        if (!isFaceValue.includes(IS_FACE)) {
            images[0].is_face = IS_FACE
            setImages([...images])
        }
        prevPage.setData({ images: images })
        Taro.navigateBack({ delta: 1 })
    }

    const renderFaceImage = () => useMemo(() => {
        return (
            <View className="item-list">
                <View className="item-image" onClick={() => setShow(true)}>
                    {
                        findFaceImage() ?
                            <Image src={findFaceImage()} /> :
                            <Text className="iconfont iconaddphoto"></Text>
                    }
                </View>
            </View>
        )
    }, [images])
    return (
        <View className="sale-photo">
            <NavBar title="上传图片" back={true}></NavBar>
            <View className="sale-photo-content">
                <View className="photo-item">
                    <View className="item-header">
                        <View className="title">房源图片</View>
                        <View className="memo">最多上传{images.length}/10张</View>
                    </View>
                    <View className="item-list">
                        {
                            images.map((item: IImage, index: number) => (
                                <View key={index} className="item-image">
                                    <Image
                                        src={item.image_path}
                                        mode="aspectFill"
                                        onClick={() => handlePreviewImage(item.image_path)}
                                    />
                                    <View className="iconfont iconclear" onClick={() => handleImageDelete(item.image_path)}></View>
                                </View>
                            ))
                        }
                        {
                            images.length < 10 &&
                            <View className="item-image" onClick={handleImageUpload}>
                                <Text className="iconfont iconaddphoto"></Text>
                            </View>
                        }
                    </View>
                </View>
                <View className="photo-item">
                    <View className="item-header">
                        <View className="title">设置封面图</View>
                        <View className="memo">请点击选择封面图</View>
                    </View>
                    {renderFaceImage()}
                </View>
                <View className="photo-submit" onClick={handleSubmit}>
                    <View className="btn btn-primary">完成</View>
                </View>
            </View>
            <View className={classnames('sale-photo-face', show && 'show')}>
                <View className="mask show" onClick={() => setShow(false)}></View>
                <View className="face-content">
                    <View className="title">请点击选择封面图</View>
                    <View className="item-list">
                        {
                            images.map((item: IImage, index: number) => (
                                <View key={index} className="item-image">
                                    <Image
                                        src={item.image_path}
                                        mode="aspectFill"
                                        onClick={() => handleFaceImage(index)}
                                    />
                                </View>
                            ))
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

export default SalePhoto