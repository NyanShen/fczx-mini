import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance, makePhoneCall, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem, Image, Text, Button } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import { toHouseNew } from '@/router/router'
import { toUrlParam } from '@utils/urlHandler'
import { formatTimestamp, formatPhoneCall } from '@utils/index'
import { getToken, hasLoginBack } from '@services/login'
import useNavData from '@hooks/useNavData'
import Popup from '@components/popup/index'
import SandCommon from '@components/sandCommon/index'
import { getStaticMap } from '@utils/map'
import { SALE_STATUS, PRICE_TYPE, SURROUND_TABS, ISurroundTab, INIT_SURROUND_TAB } from '@constants/house'
import NavBar from '@/components/navbar'

import '@styles/common/house.scss'
import '@styles/common/house-album.scss'
import '@styles/common/bottom-bar.scss'
import '@house/new/surround/index.scss'
import '@house/new/news/index.scss'
import './index.scss'

interface IAlbumSwiper {
    albumTabs: any[],
    albumItems: any[],
    swiperIndex: number
}

const INIT_ALBUM_SWIPER = {
    albumTabs: [],
    albumItems: [],
    swiperIndex: 0
}

const INIT_HOUSE_DATA = {
    id: '',
    title: '',
    tags: [],
    ask: [],
    news: [],
    fangHouseInfo: {},
    fangHouseGroup: {},
    fangHouseDiscount: {},
    _renovationStatus: [],
    fangHouseRoom: [],
    imagesData: {},
    fangHouseComment: [],
    enableFangHouseConsultant: []
}

const House = () => {
    const { contentHeight } = useNavData()
    const params: any = getCurrentInstance().router?.params
    const [albumSwiper, setAlbumSwiper] = useState<IAlbumSwiper>(INIT_ALBUM_SWIPER)
    const [houseData, setHouseData] = useState<any>(INIT_HOUSE_DATA)
    const [likeComment, setLikeComment] = useState<string[]>([])
    const [collect, setCollect] = useState<boolean>(false)

    useShareTimeline(() => {
        return {
            title: houseData.title,
            path: `/house/new/index/index?id=${params.id}&share=true`
        }
    })

    useShareAppMessage(() => {
        return {
            title: houseData.title,
            imageUrl: houseData.image_path,
            path: `/house/new/index/index?id=${params.id}&share=true`
        }
    })

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getHouseById),
            data: {
                id: params.id
            }
        }).then((result: any) => {
            const static_map = getStaticMap(result.latitude, result.longitude)
            setHouseData({ ...result, ...{ static_map: static_map } })
            const video = result.imagesData.video
            if (video) {
                setAlbumSwiper({
                    albumTabs: [{ name: '视频' }, { name: '图片' }],
                    albumItems: [video, { image_path: result.image_path }],
                    swiperIndex: 0
                })
            } else {
                setAlbumSwiper({
                    albumTabs: [{ name: '图片' }],
                    albumItems: [{ image_path: result.image_path }],
                    swiperIndex: 0
                })
            }
            Taro.setNavigationBarTitle({ title: result.title })
            if (params.c) {
                handlePhoneCall(result.phone)
            }
        })
        if (getToken()) {
            fetchCollectStatus()
        }
    }, [])

    const fetchCollectStatus = () => {
        app.request({
            url: app.areaApiUrl(api.userIsCollect),
            data: {
                type_id: params.id,
                type: '1',
                static: true
            }
        }).then((res: any) => {
            setCollect(res)
        })
    }

    const updateUserCollect = (url: string, status: boolean) => {
        hasLoginBack().then(() => {
            app.request({
                url: app.areaApiUrl(url),
                method: 'POST',
                data: {
                    type_id: params.id,
                    type: '1'
                }
            }).then(() => {
                setCollect(status)
            })
        })
    }

    const onSwiperChange = (event: any) => {
        const swiperIndex = event.detail.current
        setAlbumSwiper({
            ...albumSwiper,
            swiperIndex
        })
    }

    const switchAlbum = (swiperIndex: number) => {
        if (albumSwiper.swiperIndex === swiperIndex) {
            return
        }
        setAlbumSwiper({
            ...albumSwiper,
            swiperIndex
        })
    }

    const handlePhoneCall = (phone: string) => {
        makePhoneCall({
            phoneNumber: formatPhoneCall(phone),
            fail: (err: any) => {
                if (err.errMsg == 'makePhoneCall:fail') {
                    Taro.showModal({
                        title: '联系电话',
                        content: phone,
                        showCancel: false
                    })
                }
            }
        })
    }

    const toHouseModule = (module: string) => {
        const params = {
            id: houseData.id,
            title: houseData.title
        }
        toHouseNew(module, params)
    }

    const toHouseSurround = (currentTab: ISurroundTab = INIT_SURROUND_TAB) => {
        const { id, title, latitude, longitude } = houseData
        toHouseNew('Surround', { id, title, latitude, longitude }, currentTab)
    }

    const toHouseSand = (currentBuilding: any) => {
        const { id, title } = houseData
        toHouseNew('Sand', { id, title, buildId: currentBuilding.id })
    }

    const toHouseTypeDetail = (item: any) => {
        toHouseNew('TypeDetail', { id: item.id, houseId: houseData.id })
    }

    const toHouseVideo = (video: any) => {
        const { id, title } = houseData
        toHouseNew('Video', { id, title }, video)
    }

    const toHouseNewsDetail = (newsId: string) => {
        Taro.navigateTo({
            url: `/house/new/news/detail?id=${newsId}`
        })
    }

    const toHouseConsultant = () => {
        const { id, title, price, price_type, image_path } = houseData
        const params = { id, title, messageType: '3' }
        const data = {
            id,
            title,
            price,
            price_type,
            image_path,
            areaName: houseData.area.name
        }
        toHouseNew('Consultant', params, data)
    }

    const toConsultantModule = () => {
        hasLoginBack().then(() => {
            app.request({
                url: app.areaApiUrl(api.getHouseConsultantData),
            }).then((result: any) => {
                let toUrl: string = ''
                const consultant = encodeURIComponent(JSON.stringify(result))
                switch (result.status) {
                    case '1': // 正常
                        const navTitle: string = '修改置业顾问信息'
                        const paramString: any = toUrlParam({ consultant, navTitle })
                        toUrl = `/consultant/register/index${paramString}`
                        break;
                    case '2': // 禁用
                    case '3': // 审核中
                        toUrl = `/consultant/checkStatus/index?status=${result.status}`
                        break;
                    case '4': // 审核不通过
                        toUrl = `/consultant/checkStatus/index${toUrlParam({ consultant, status: result.status })}`
                        break;
                    default:
                        toUrl = `/consultant/register/index`
                }
                Taro.navigateTo({
                    url: toUrl
                })
            })
        })
    }

    const toHome = () => {
        Taro.switchTab({ url: '/pages/index/index' })
    }

    const toChatRoom = (consultant: any) => {
        const { id, title, price, price_type, image_path } = houseData
        const paramString = toUrlParam({
            messageType: '3',
            fromUserId: consultant.user_id,
            toUser: JSON.stringify(consultant.user),
            content: JSON.stringify({
                id,
                title,
                price,
                price_type,
                image_path,
                areaName: houseData.area.name
            })
        })
        Taro.navigateTo({
            url: `/chat/room/index${paramString}`
        })
    }

    const handleViewImage = (imagePath: string) => {
        Taro.previewImage({
            urls: [imagePath],
            current: imagePath
        })
    }

    const handleCommentZan = (item: any) => {
        if (likeComment.includes(item.id)) {
            return
        }
        app.request({
            url: app.areaApiUrl(api.likeHouseComment),
            method: 'POST',
            data: {
                id: item.id
            }
        }, { loading: false }).then(() => {
            setLikeComment([...likeComment, item.id])
        })
    }

    const renderDetail = (value: string) => {
        return value ? value : '待更新'
    }

    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <Text className="price">待定</Text>
        } else {
            return <Text className="price">{price}<Text className="price-unit">{PRICE_TYPE[price_type]}</Text></Text>
        }
    }

    const renderComment = (comment: any[]) => {
        return (
            <View className="house-item house-comment mt20">
                <View className="house-item-header">
                    <View className="title">用户评论({houseData.comment_num})</View>
                    {
                        comment.length > 0 &&
                        <View className="more" onClick={() => toHouseModule('Comment')}>
                            <Text>查看更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    }
                </View>
                <View className="house-item-content">
                    {
                        comment.length > 0 ?
                            comment.map((item: any, index: number) => (
                                <View key={index} className="comment-item">
                                    <View className="user-photo">
                                        <Image className="taro-image" src={item.user.avatar}></Image>
                                    </View>
                                    <View className="comment-text">
                                        <View className="name">{item.user.nickname}</View>
                                        <View className="text">{item.content}</View>
                                        {
                                            item.image_path &&
                                            <View className="comment-image">
                                                <Image
                                                    className="taro-image"
                                                    src={item.image_path}
                                                    mode="aspectFill"
                                                    onClick={() => handleViewImage(item.image_path)}
                                                />
                                            </View>
                                        }
                                        <View className="comment-bottom">
                                            <View className="time">{formatTimestamp(item.modified)}</View>
                                            <View className="action">
                                                <View className="action-item" onClick={() => handleCommentZan(item)}>
                                                    {
                                                        likeComment.includes(item.id) ?
                                                            <View className="actived">
                                                                <Text className="iconfont iconzan_hv"></Text>
                                                                <Text className="count">({Number(item.like_num) + 1})</Text>
                                                            </View> :
                                                            <View className="none">
                                                                <Text className="iconfont iconzan"></Text>
                                                                <Text className="count">({item.like_num})</Text>
                                                            </View>
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )) :
                            <View className="empty-container">
                                <View className="iconfont iconempty"></View>
                                <View>暂无评论</View>
                            </View>
                    }
                    <View className="btn btn-blue" onClick={() => toHouseModule('CommentForm')}>
                        <Text className="btn-name">我要评论</Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderAsk = (ask: any[]) => {
        return (
            <View className="house-item house-question">
                <View className="house-item-header">
                    <View className="title">大家都在问</View>
                    {
                        ask.length > 0 &&
                        <View className="more" onClick={() => toHouseModule('Ask')}>
                            <Text>查看更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    }
                </View>
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
                    <View className="btn btn-blue" onClick={() => toHouseModule('AskForm')}>
                        <Text className="btn-name">我要提问</Text>
                    </View>
                </View>
            </View>
        )
    }

    const renderConsultant = () => {
        const { enableFangHouseConsultant } = houseData
        return (
            <View className="house-item house-consultant mt20">
                <View className="house-item-header">
                    <View className="title">置业顾问({enableFangHouseConsultant.length})</View>
                    {
                        enableFangHouseConsultant.length > 0 &&
                        <View className="more" onClick={toHouseConsultant}>
                            <Text>更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    }
                </View>
                <View className="house-consultant-content">
                    <View className="consultant-desc view-content">为你提供以下服务：政策解读 楼盘导览 户型解析</View>
                    {
                        enableFangHouseConsultant.length > 0 ?
                            <ScrollView className="consultant-scroll" scrollX>
                                {
                                    enableFangHouseConsultant.map((item: any, index: number) => (
                                        <View key={index} className="consultant-item">
                                            <View className="consultant-context">
                                                <View className="item-image">
                                                    <Image className="taro-image" src={item.user.avatar}></Image>
                                                </View>
                                                <View className="item-name">{item.user.nickname}</View>
                                                <View className="item-btn">
                                                    <Button className="ovalbtn ovalbtn-brown" onClick={() => toChatRoom(item)}>
                                                        <Text className="iconfont iconmessage"></Text>
                                                        <Text>咨询</Text>
                                                    </Button>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                }
                            </ScrollView> :
                            <View className="house-item-content">
                                <View className="empty-container">
                                    <View className="iconfont iconempty"></View>
                                    <View>暂无置业顾问信息</View>
                                </View>
                                <View className="btn btn-blue" onClick={toConsultantModule}>
                                    <Text className="btn-name">立即入驻</Text>
                                </View>
                            </View>
                    }
                </View>
            </View>
        )
    }

    const getSandCommonComponent = useMemo(() => (
        <SandCommon
            houseId={houseData.id}
            outerHeight={220}
            buildId={''}
            setCurrentBuilding={toHouseSand}
            updateSandBuilding={() => { }}
        />
    ), [houseData.id])

    return (
        <View className="house">
            <NavBar title={houseData.title} primary={true} />
            <ScrollView style={{ maxHeight: `${contentHeight - 55}px`, backgroundColor: '#f7f7f7' }} scrollY>
                {
                    albumSwiper.albumItems.length > 0 &&
                    <View className="house-album">
                        <Swiper
                            style={{ height: '250px' }}
                            current={albumSwiper.swiperIndex}
                            onChange={onSwiperChange}
                        >
                            {
                                albumSwiper.albumItems.map((item: any, index: number) => {
                                    return item.video_path ?
                                        <SwiperItem key={index} onClick={() => toHouseVideo(item)}>
                                            <Image className="taro-image" src={item.image_path}></Image>
                                            <Text className="icon-vedio"></Text>
                                        </SwiperItem> :
                                        <SwiperItem key={index} onClick={() => toHouseModule('Album')}>
                                            <Image className="taro-image" src={item.image_path}></Image>
                                        </SwiperItem>
                                })
                            }
                        </Swiper>
                        <View className="album-count" onClick={() => toHouseModule('Album')}>
                            共{houseData.imagesData.imageCount}张
                        </View>
                        <View className="album-text">
                            {
                                albumSwiper.albumTabs.map((item: any, index: number) => (
                                    <Text
                                        key={index}
                                        className={classnames('album-text-item', index == albumSwiper.swiperIndex && 'album-text-actived')}
                                        onClick={() => switchAlbum(index)}
                                    >{item.name}</Text>
                                ))
                            }
                        </View>
                    </View>
                }

                <View className="house-header">
                    <View className="header-left">
                        <View className="title">
                            <Text className="name">{houseData.title}</Text>
                            <Text className={classnames('status', `sale-status-${houseData.sale_status}`)}>
                                {SALE_STATUS[houseData.sale_status]}
                            </Text>
                        </View>
                        <View className="address">
                            <Text className="text">{houseData.address}</Text>
                            <Text className="iconfont iconaddress" onClick={() => toHouseSurround()}>地图</Text>
                        </View>
                    </View>
                    <View className="header-right">
                        {
                            collect ?
                                <Button className="header-btn" onClick={() => updateUserCollect(api.userCollectDelete, false)}>
                                    <View className="iconfont iconstarfill"></View>
                                    <View className="text">已收藏</View>
                                </Button> :
                                <Button className="header-btn" onClick={() => updateUserCollect(api.userCollectAdd, true)}>
                                    <View className="iconfont iconstar"></View>
                                    <View className="text">收藏</View>
                                </Button>
                        }
                        <Button className="header-btn" openType="share">
                            <View className="iconfont iconshare"></View>
                            <View className="text">分享</View>
                        </Button>
                    </View>
                </View>
                <View className="house-item mt20">
                    <View className="house-item-header">
                        <View className="title">基本信息</View>
                        <View className="more" onClick={() => toHouseModule('Detail')}>
                            <Text>更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                </View>
                <View className="info view-content">
                    <View className="info-item">
                        <Text className="label">参考售价</Text>
                        {renderPrice(houseData.price, houseData.price_type)}
                    </View>
                    <View className="info-item">
                        <Text className="label">销售状态</Text>
                        <Text className="text">{SALE_STATUS[houseData.sale_status]}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">开盘时间</Text>
                        <Text className="text">
                            {
                                !houseData.open_time || houseData.open_time === '0' ? '待更新' : formatTimestamp(houseData.open_time, 'yy-MM-dd')
                            }
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">装修状况</Text>
                        <Text className="text">{houseData._renovationStatus && houseData._renovationStatus.join(',')}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">楼层状况</Text>
                        <Text className="text">{renderDetail(houseData.fangHouseInfo.storey_height)}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">售楼地址</Text>
                        <Text className="text">{renderDetail(houseData.fangHouseInfo.sale_address)}</Text>
                    </View>
                    <View className="btn btn-blue mt20" onClick={() => toHouseModule('Detail')}>
                        <Text className="btn-name">查看更多楼盘详情</Text>
                    </View>
                </View>
                <View className="house-custom">
                    <View className="subscrib">
                        <View className="subscrib-item">
                            <Popup
                                type="1"
                                houseId={houseData.id}
                                btnText="变价提醒"
                                iconClass="icondata-view"
                                description="此楼盘有价格变化，我们会及时通知您"
                            ></Popup>
                        </View>
                        <View className="subscrib-item">
                            <Popup
                                type="2"
                                houseId={houseData.id}
                                btnText="开盘通知"
                                iconClass="iconnotice"
                                description="此楼盘有开盘活动，我们会及时通知您"
                            ></Popup>
                        </View>
                    </View>
                </View>
                <View className="house-contact view-content">
                    <View className="contact-content" onClick={() => handlePhoneCall(houseData.phone)}>
                        <View className="contact-phone">
                            <View className="phone-call">{houseData.phone}</View>
                            <View className="phone-desc">致电售楼处了解项目更多信息</View>
                        </View>
                        <View className="contact-icon">
                            <Text className="iconfont iconcall"></Text>
                        </View>
                    </View>
                </View>
                {
                    (houseData.is_discount == '1' || houseData.is_group == '1') &&
                    <View className="house-item house-activity mt20">
                        <View className="house-item-header">
                            <View className="title">优惠</View>
                        </View>
                        {
                            houseData.is_discount == '1' &&
                            <View className="activity-item">
                                <View className="item-text">
                                    <View>获取优惠</View>
                                    <View className="desc">{houseData.fangHouseDiscount.title}</View>
                                </View>
                                <View className="item-action">
                                    <View className="ovalbtn ovalbtn-pink">
                                        <Popup
                                            houseId={houseData.id}
                                            btnText="预约优惠"
                                            title={houseData.fangHouseDiscount.title}
                                        ></Popup>
                                    </View>
                                </View>
                            </View>
                        }
                        {
                            houseData.is_group == '1' &&
                            <View className="activity-item activity-item-primary">
                                <View className="item-text">
                                    <View>看房团</View>
                                    <View className="desc">{houseData.fangHouseGroup.title}</View>
                                </View>
                                <View className="item-action">
                                    <View className="ovalbtn ovalbtn-primary">
                                        <Popup
                                            houseId={houseData.id}
                                            btnText="立即参与"
                                            title={houseData.fangHouseGroup.title}
                                            description="√免费大巴接送 √来回接送 √全程免费"
                                        ></Popup>
                                    </View>
                                </View>
                            </View>
                        }
                    </View>
                }

                {
                    houseData.fangHouseRoom.length > 0 &&
                    <View className="house-item house-type mt20">
                        <View className="house-item-header">
                            <View className="title">主力户型({houseData.fangHouseRoom.length})</View>
                            <View className="more" onClick={() => toHouseModule('Type')}>
                                <Text>更多</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <ScrollView className="house-type-content" scrollX>
                            {
                                houseData.fangHouseRoom.map((item: any, index: any) => (
                                    <View key={index} className="swiper-item" onClick={() => toHouseTypeDetail(item)}>
                                        <View className="item-image">
                                            <Image className="taro-image" src={item.image_path} mode="aspectFill"></Image>
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
                                ))
                            }
                        </ScrollView>
                    </View>
                }

                {
                    houseData.news.length > 0 &&
                    <View className="house-item house-news mt20">
                        <View className="house-item-header">
                            <View className="title">楼盘动态</View>
                            <View className="more" onClick={() => toHouseModule('News')}>
                                <Text>更多</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <View className="house-item-content">
                            {
                                houseData.news.map((item: any, index: number) => (
                                    <View key={index} className="news-item" onClick={() => toHouseNewsDetail(item.id)}>
                                        <View className="header">
                                            <Text className="tag">{item.newsCate.name}</Text>
                                            <Text className="publish small-desc">{formatTimestamp(item.modified)}</Text>
                                        </View>
                                        <View className="title">{item.title}</View>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                }
                {
                    houseData.fang_sand_pic &&
                    <View className="house-item house-sand mt20">
                        <View className="house-item-header">
                            <View className="title">沙盘图</View>
                            <View className="more" onClick={() => toHouseModule('Sand')}>
                                <Text>查看</Text>
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        {houseData.id && getSandCommonComponent}
                    </View>
                }

                <View className="house-item house-surround mt20">
                    <View className="house-item-header">
                        <View className="title">周边配套</View>
                        <View className="more" onClick={() => toHouseSurround()}>
                            <Text>地图</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="house-item-content surround">
                        <View className="surround-wrapper">
                            <View className="map">
                                <Image className="taro-image" src={houseData.static_map} mode="center"></Image>
                                <View className="map-label">
                                    <View className="text">{houseData.title}</View>
                                    <View className="iconfont iconmap"></View>
                                </View>
                            </View>
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
                {renderConsultant()}

                <View className="house-item house-statement mt20">
                    <View className="house-item-header">
                        <View className="title">免责声明</View>
                    </View>
                    <View className="house-item">
                        <View className="house-item-content">
                            楼盘信息来源政府网站、开发商、第三方公众平台,最终以政府部门登记备案为主,请谨慎核查。
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View className="bottom-bar">
                <View className="bar-item" onClick={toHome}>
                    <Text className="iconfont iconhome"></Text>
                    <Text>首页</Text>
                </View>

                <View className="line-split"></View>
                {
                    houseData.is_group == '1' &&
                    <View className="bar-item">
                        <Popup
                            type="4"
                            houseId={houseData.id}
                            btnText="团购"
                            iconClass="icongroup"
                            title={houseData.fangHouseGroup.title}
                            description="√免费大巴接送 √来回接送 √全程免费"
                        ></Popup>
                    </View>
                }

                {
                    houseData.enableFangHouseConsultant.length > 0 &&
                    <View className="bar-item-btn" onClick={() => toChatRoom(houseData.enableFangHouseConsultant[0])}>
                        <View className="btn btn-yellow btn-bar">
                            <View>在线咨询</View>
                            <View className="btn-subtext">快速在线咨询</View>
                        </View>
                    </View>
                }

                <View className="bar-item-btn" onClick={() => handlePhoneCall(houseData.phone)}>
                    <View className="btn btn-primary btn-bar">
                        <View>电话咨询</View>
                        <View className="btn-subtext">致电了解更多</View>
                    </View>
                </View>
            </View>
        </View>
    )
}
export default House