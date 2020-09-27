import React, { useState } from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem, Image, Text, Button, Map } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import { toUrlParam } from '@utils/urlHandler'
import { formatTimestamp } from '@utils/index'
import useNavData from '@hooks/useNavData'
import NavBar from '@components/navbar/index'
import Popup from '@house/components/popup/index'
import { SURROUND_TABS, ISurroundTab, SALE_STATUS, PRICE_TYPE } from '@house/constants/house'
import '@styles/common/house.scss'
import '@house/styles/bottom-bar.scss'
import '@house/pages/new/surround/index.scss'
import './index.scss'

interface IAlbumSwiper {
    albumId: string,
    swiperIndex: number
}

const INIT_ALBUM_SWIPER = {
    albumId: '',
    swiperIndex: 0
}

const INIT_SURROUND_TAB = {
    name: '交通',
    type: 'traffic',
    icon: 'icontraffic'
}

const INIT_HOUSE_DATA = {
    id: '',
    title: '',
    tags: [],
    _renovationStatus: [],
    fangHouseRoom: [],
    imagesData: {},
    fangHouseComment: [],
    ask: [],
    enableFangHouseConsultant: []
}

const imageId = "image_1"

const House = () => {
    const { contentHeight } = useNavData()
    const [albumSwiper, setAlbumSwiper] = useState<IAlbumSwiper>(INIT_ALBUM_SWIPER)
    const [houseData, setHouseData] = useState<any>(INIT_HOUSE_DATA)
    const [popup, setPopup] = useState<boolean>(false)

    useReady(() => {
        let currentRouter: any = getCurrentInstance().router
        let params: any = currentRouter.params
        params.id = '1001'
        if (params.id) {
            app.request({
                url: app.testApiUrl(api.getHouseById),
                data: {
                    id: params.id
                }
            }).then((result: any) => {
                setHouseData({ ...result, houseMarker: initHouseMarker(result) })
                const video = result.imagesData.video
                if (video) {
                    setAlbumSwiper({ albumId: video.id, swiperIndex: 0 })
                } else {
                    setAlbumSwiper({ albumId: imageId, swiperIndex: 1 })
                }
            })
        }
    })

    const initHouseMarker = (houseData) => {
        return {
            latitude: houseData.latitude,
            longitude: houseData.longitude,
            width: 30,
            height: 30,
            iconPath: 'http://192.168.2.248/assets/mini/location.png',
            callout: {
                content: houseData.title,
                color: '#fff',
                fontSize: 14,
                borderWidth: 2,
                borderRadius: 5,
                borderColor: '#11a43c',
                bgColor: '#11a43c',
                padding: 5,
                display: 'ALWAYS',
                textAlign: 'center'
            }
        }
    }

    const onSwiperChange = (event) => {
        let swiperIndex = event.detail.current;
        let currentItem = event.detail.currentItemId.split(',');
        let albumId = currentItem[0];
        setAlbumSwiper({
            albumId,
            swiperIndex
        })
    }

    const switchAlbum = (albumId: string, swiperIndex: number) => {
        setAlbumSwiper({
            albumId,
            swiperIndex
        })
    }

    const navigateTo = (url: string) => {
        Taro.navigateTo({ url })
    }

    const handlePopupConfirm = (popupData) => {
        console.log(popupData)
        setPopup(false)
    }

    const toHouseSurround = (currentTab: ISurroundTab = INIT_SURROUND_TAB) => {
        const { id, title, houseMarker } = houseData
        const paramString = toUrlParam({
            id,
            name: title,
            tab: JSON.stringify(currentTab),
            houseMarker: JSON.stringify(houseMarker),
        })
        Taro.navigateTo({
            url: `/house/pages/new/surround/index${paramString}`
        })
    }

    const toAlbum = () => {
        Taro.navigateTo({
            url: '/house/pages/new/album/index'
        })
    }

    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <Text className="price">待定</Text>
        } else {
            return <Text className="price">{price}<Text className="price-unit">{PRICE_TYPE[price_type]}</Text></Text>
        }
    }

    const renderVideo = (video: any) => {
        return (
            <SwiperItem
                itemId={video.id}
                onClick={toAlbum}
            >
                <Image src={video.image_path} mode='widthFix'></Image>
                <Text className="auto-center icon-vedio"></Text>
            </SwiperItem>
        )
    }

    const renderVideoTab = (video: any) => {
        return (
            <Text
                className={classnames('album-text-item', video.id == albumSwiper.albumId && 'album-text-actived')}
                onClick={() => switchAlbum(video.id, 0)}
            >视频</Text>
        )
    }

    const renderTags = (tags: string[]) => {
        return tags.length > 0 && tags.map((item: any, index: number) => (
            <Text key={index} className="tags-item">{item}</Text>
        ))
    }

    const renderComment = (comment: any[]) => {
        return (
            <View className="house-comment mt20">
                <View className="house-item-header view-content">
                    <View className="title">用户评论({houseData.comment_num})</View>
                    {
                        comment.length > 0 &&
                        <View className="more">
                            <Text>查看更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    }
                </View>
                <View className="house-item">
                    <View className="house-item-content">
                        {
                            comment.length > 0 ?
                                comment.map((item: any, index: number) => (
                                    <View key={index} className="comment-item">
                                        <View className="user-photo">
                                            <Image src={item.user.avatar}></Image>
                                        </View>
                                        <View className="comment-text">
                                            <View className="name">{item.user.nickname}</View>
                                            <View className="text">{item.content}</View>
                                            <View className="small-desc">{formatTimestamp(item.modified)}</View>
                                        </View>
                                    </View>
                                )) :
                                <View className="empty-container">
                                    <View className="iconfont iconempty"></View>
                                    <View>暂无评论</View>
                                </View>
                        }
                        <View className="btn btn-blue">
                            <Text className="btn-name">我要评论</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const renderAsk = (ask: any[]) => {
        return (
            <View className="house-question">
                <View className="house-item-header view-content">
                    <View className="title">大家都在问</View>
                    {
                        ask.length > 0 &&
                        <View className="more">
                            <Text>查看更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    }
                </View>
                <View className="house-item">
                    <View className="house-item-content">
                        {
                            ask.length > 0 ?
                                ask.map((item: any, index: number) => (
                                    <View key={index} className="question-item">
                                        <View className="question">
                                            <Text className="iconfont iconwen"></Text>
                                            <Text className="text">{item.title}</Text>
                                        </View>
                                        <View className="question">
                                            <Text className="iconfont iconda"></Text>
                                            <Text className="text da">{item.reply_content ? item.reply_content : '暂无回答'}</Text>
                                        </View>
                                    </View>
                                )) :
                                <View className="empty-container">
                                    <View className="iconfont iconempty"></View>
                                    <View>对此楼盘有疑问？赶快去提问吧</View>
                                </View>
                        }
                        <View className="btn btn-blue">
                            <Text className="btn-name">我要提问</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View className="house">
            <NavBar title={houseData.title} back={true} />
            <ScrollView style={{ height: `${contentHeight - 55}px`, backgroundColor: '#f7f7f7' }} scrollY>
                <View className="house-album">
                    <Swiper
                        style={{ height: '225px' }}
                        current={albumSwiper.swiperIndex}
                        onChange={onSwiperChange}
                    >
                        {houseData.imagesData.video && renderVideo(houseData.imagesData.video)}
                        <SwiperItem itemId={imageId} onClick={toAlbum}>
                            <Image src={houseData.image_path} mode='widthFix'></Image>
                        </SwiperItem>
                    </Swiper>
                    <View className="album-count">共{houseData.imagesData.imageCount}张</View>
                    <View className="album-text">
                        {houseData.imagesData.video && renderVideoTab(houseData.imagesData.video)}
                        <Text
                            className={classnames('album-text-item', imageId == albumSwiper.albumId && 'album-text-actived')}
                            onClick={() => switchAlbum(imageId, 1)}
                        >图片</Text>
                    </View>
                </View>
                <View className="house-header">
                    <View className="name">{houseData.title}</View>
                    <View className="tags">
                        <Text className={classnames('tags-item', `sale-status-${houseData.sale_status}`)}>{SALE_STATUS[houseData.sale_status]}</Text>
                        {renderTags(houseData._renovationStatus)}
                        {renderTags(houseData.tags)}
                    </View>
                </View>
                <View className="info view-content">
                    <View className="info-item">
                        <Text className="label">售价</Text>
                        {renderPrice(houseData.price, houseData.price_type)}
                    </View>
                    <View className="info-item">
                        <Text className="label">开盘</Text>
                        <Text className="text">{houseData.open_time && formatTimestamp(houseData.open_time, 'yy-MM-dd')}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">地址</Text>
                        <Text className="text address">{houseData.address}</Text>
                        <Text className="iconfont iconaddress" onClick={() => toHouseSurround()}>地图</Text>
                    </View>
                    <View className="btn btn-blue mt20" onClick={() => navigateTo('/house/pages/new/detail/index')}>
                        <Text className="btn-name">查看更多楼盘详情</Text>
                    </View>
                    <View className="subscrib">
                        <View className="subscrib-item">
                            <Text className="iconfont icondata-view"></Text>
                            <Text onClick={() => setPopup(true)}>变价通知</Text>
                        </View>
                        <View className="subscrib-item">
                            <Text className="iconfont iconnotice"></Text>
                            <Text onClick={() => setPopup(true)}>开盘通知</Text>
                        </View>
                    </View>
                </View>
                <View className="house-contact view-content mt20">
                    <View className="iconfont icontelephone-out"></View>
                    <View>
                        <View className="phone-call">{houseData.phone}</View>
                        <View className="phone-desc">致电售楼处了解项目更多信息</View>
                    </View>
                </View>
                {
                    houseData.enableFangHouseDiscount &&
                    <View className="house-item house-activity mt20">
                        <View className="house-item-header view-content">
                            <View className="title">优惠</View>
                            <View className="more">
                                <Text>更多</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <View className="activity-item">
                            <View className="item-text">
                                <View>获取优惠</View>
                                <View className="desc">{houseData.enableFangHouseDiscount.title}</View>
                            </View>
                            <View className="item-action">
                                <Button className="ovalbtn ovalbtn-pink">预约优惠</Button>
                            </View>
                        </View>
                    </View>
                }

                <View className="house-item house-type mt20">
                    <View className="house-item-header view-content">
                        <View className="title">主力户型({houseData.fangHouseRoom.length + 1})</View>
                        <View className="more">
                            <Text>更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="house-type-content">
                        <Swiper displayMultipleItems={2.5}>
                            {
                                houseData.fangHouseRoom.map((item: any, index: any) => (
                                    <SwiperItem key={index}>
                                        <View className="swiper-item">
                                            <View className="item-image">
                                                <Image src={item.image_path}></Image>
                                            </View>
                                            <View className="item-text tags">
                                                <Text>{item.room}室{item.office}厅{item.toilet}卫</Text>
                                                <Text className={classnames('tags-item', `sale-status-${item.sale_status}`)}>{SALE_STATUS[item.sale_status]}</Text>
                                            </View>
                                            <View className="item-text">
                                                <Text>{item.building_area}m²</Text>
                                                {renderPrice(item.price, item.price_type)}
                                            </View>
                                        </View>
                                    </SwiperItem>
                                ))
                            }
                        </Swiper>
                    </View>
                </View>
                <View className="house-surround mt20">
                    <View className="house-item-header view-content">
                        <View className="title">周边配套</View>
                        <View className="more" onClick={() => toHouseSurround()}>
                            <Text>地图</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="house-item surround view-content">
                        <View className="surround-wrapper" style={{ height: 225 }}>
                            <Map
                                id="surroundMap"
                                className="surround-map"
                                latitude={houseData.latitude}
                                longitude={houseData.longitude}
                                markers={[houseData.houseMarker]}
                                enableZoom={false}
                            >
                            </Map>
                            <View className="surround-tabs">
                                {
                                    SURROUND_TABS.map((item: any, index: number) => (
                                        <View
                                            key={index}
                                            className={classnames('tabs-item')}
                                            onClick={() => toHouseSurround(item)}
                                        >
                                            <Text className={classnames('iconfont', item.icon)}></Text>
                                            <Text className="text">{item.name}</Text>
                                        </View>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                </View>
                {renderComment(houseData.fangHouseComment)}
                {renderAsk(houseData.ask)}
                <View className="house-consultant mt20">
                    <View className="house-item-header view-content">
                        <View className="title">置业顾问</View>
                    </View>
                    <View className="house-consultant-content clearfix">
                        {
                            houseData.enableFangHouseConsultant.map((item: any, index: number) => {
                                if (index < 4) {
                                    return (
                                        <View key={index} className="consultant-item">
                                            <View className="item-image">
                                                <Image src={item.avatar}></Image>
                                            </View>
                                            <View className="item-name">{item.nickname}</View>
                                            <View className="item-btn">
                                                <Button className="ovalbtn ovalbtn-brown">
                                                    <Text className="iconfont"></Text>
                                                    <Text>咨询</Text>
                                                </Button>
                                            </View>
                                        </View>
                                    )
                                }
                            })
                        }
                    </View>
                </View>
                <View className="house-statement mt20">
                    <View className="house-item-header view-content">
                        <View className="title">免责声明</View>
                    </View>
                    <View className="house-item">
                        <View className="house-item-content">
                            楼盘信息来源政府网站、开发商、第三方公众平台,最终以政府部门登记备案为主,请谨慎核查。如楼盘信息有误或者其他疑议，请拨打客服电话0632-00000000
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className="bottom-bar">
                <View className="bar-item">
                    <Text className="iconfont iconhome"></Text>
                    <Text>首页</Text>
                </View>
                <View className="line-split"></View>
                <View className="bar-item">
                    <Text className="iconfont icongroup"></Text>
                    <Text>团购</Text>
                </View>
                <View className="bar-item-btn">
                    <Text className="btn btn-yellow btn-bar">置业顾问</Text>
                </View>
                <View className="bar-item-btn">
                    <Text className="btn btn-primary btn-bar">电话咨询</Text>
                </View>
            </View>
            {
                popup &&
                <Popup
                    title="楼盘"
                    subTitle="订阅消息"
                    onConfirm={handlePopupConfirm}
                    onCancel={() => setPopup(false)}
                ></Popup>
            }

        </View>
    )
}
export default House