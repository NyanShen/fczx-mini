import React, { useState } from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, ScrollView, Swiper, SwiperItem, Image, Text, Button, Map } from '@tarojs/components'
import classnames from 'classnames'
import { parseInt } from 'lodash'

import api from '@services/api'
import app from '@services/request'
import { toUrlParam } from '@utils/urlHandler'
import useNavData from '@hooks/useNavData'
import NavBar from '@components/navbar/index'
import Popup from '@components/popup/index'
import { SURROUND_TABS, ISurroundTab } from '@constants/house'
import '@styles/common/bottom-bar.scss'
import './index.scss'
import '../surround/index.scss'

interface IAlbumSwiper {
    albumId: string
    imageIndex: number
    swiperIndex: number
    itemLength: number
}

const INIT_ALBUM_SWIPER = {
    albumId: '',
    imageIndex: 0,
    swiperIndex: 0,
    itemLength: 0
}

const INIT_SURROUND_TAB = {
    name: '交通',
    type: 'traffic',
    icon: 'icontraffic'
}
const House = () => {
    const { contentHeight } = useNavData()
    const [albumSwiper, setAlbumSwiper] = useState<IAlbumSwiper>(INIT_ALBUM_SWIPER)
    const [houseData, setHouseData] = useState<any>({})
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
                setAlbumSwiper({
                    ...albumSwiper,
                    itemLength: result.house_album[0].images.length,
                    albumId: result.house_album[0].id,
                })
            })
        }
    })

    const initHouseMarker = (houseData) => {
        return {
            latitude: houseData.lat,
            longitude: houseData.lng,
            width: 30,
            height: 30,
            iconPath: 'http://192.168.2.248/assets/mini/location.png',
            callout: {
                content: houseData.house_name,
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
        let imageIndex = parseInt(currentItem[1]);
        let itemLength = findAlbumById(albumId).length
        setAlbumSwiper({
            albumId,
            imageIndex,
            swiperIndex,
            itemLength
        })
    }

    const switchAlbum = (albumId: string) => {
        const currenAlbum = findAlbumById(albumId)
        setAlbumSwiper({
            albumId,
            imageIndex: 0,
            swiperIndex: currenAlbum.indexBefore,
            itemLength: currenAlbum.length
        })
    }

    const findAlbumById = (albumId: string) => {
        let indexBefore = 0;
        let album: any = null;
        for (const item of houseData.house_album) {
            if (item.id === albumId) {
                album = item
                break;
            }
            indexBefore = indexBefore + item.images.length
        }

        return {
            id: albumId,
            length: album.images.length,
            images: album.images,
            indexBefore
        }
    }

    const navigateTo = (url: string) => {
        Taro.navigateTo({ url })
    }

    const handlePopupConfirm = (popupData) => {
        console.log(popupData)
        setPopup(false)
    }

    const toHouseSurround = (currentTab: ISurroundTab = INIT_SURROUND_TAB) => {
        const { id, house_name, houseMarker } = houseData
        const paramString = toUrlParam({
            id,
            name: house_name,
            tab: JSON.stringify(currentTab),
            houseMarker: JSON.stringify(houseMarker),
        })
        Taro.navigateTo({
            url: `/pages/newhouse/surround/index${paramString}`
        })
    }

    const toAlbum = () => {
        Taro.navigateTo({
            url: '/pages/newhouse/album/index'
        })
    }

    return (
        <View className="house">
            <NavBar title={houseData.house_name || '楼盘'} back={true} />
            <ScrollView style={{ height: `${contentHeight - 55}px`, backgroundColor: '#f7f7f7' }} scrollY>
                <View className="house-album">
                    <Swiper
                        style={{ height: '225px' }}
                        current={albumSwiper.swiperIndex}
                        onChange={onSwiperChange}
                    >
                        {
                            houseData.house_album && houseData.house_album.map((albumItem: any) => {
                                return albumItem.images.map((imageItem: any, imageIndex: number) => {
                                    return (
                                        <SwiperItem
                                            key={imageIndex}
                                            itemId={`${albumItem.id},${imageIndex}`}
                                            onClick={toAlbum}
                                        >
                                            <Image style="width: 100%; height: 240px" src={imageItem.image_path} mode='widthFix'></Image>
                                            {albumItem.type == 'video' && <Text className="auto-center icon-vedio"></Text>}
                                        </SwiperItem>
                                    )
                                })
                            })
                        }
                    </Swiper>
                    <View className="album-count">{albumSwiper.imageIndex + 1}/{albumSwiper.itemLength}</View>
                    <View className="album-text">
                        {
                            houseData.house_album && houseData.house_album.map((albumItem: any, albumIndex: number) => {
                                return <Text
                                    className={classnames('album-text-item', albumItem.id == albumSwiper.albumId && 'album-text-actived')}
                                    key={albumIndex}
                                    onClick={() => switchAlbum(albumItem.id)}
                                >{albumItem.name}</Text>
                            })
                        }
                    </View>
                </View>
                <View className="house-header">
                    <View className="name">{houseData.house_name || '楼盘名称'}</View>
                    <View className="tags">
                        <Text className="tags-item sale-status-1">在售</Text>
                        <Text className="tags-item">毛坯</Text>
                        <Text className="tags-item">中高层</Text>
                    </View>
                </View>
                <View className="info view-content">
                    <View className="info-item">
                        <Text className="label">售价</Text>
                        <Text className="price">20012</Text>
                        <Text className="text">元/m²</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">开盘</Text>
                        <Text className="text">已于2019年6月23号开盘</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">地址</Text>
                        <Text className="text address">东津新区东西轴线与南山路交汇处东津新区东西轴线与南山路交汇处</Text>
                        <Text className="iconfont iconaddress" onClick={() => toHouseSurround()}>地图</Text>
                    </View>
                    <View className="btn btn-blue mt20" onClick={() => navigateTo('/pages/newhouse/detail/index')}>
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
                        <View className="phone-call">400-018-0632 转 6199</View>
                        <View className="phone-desc">致电售楼处了解项目更多信息</View>
                    </View>
                </View>
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
                            <View className="desc">优惠活动描述</View>
                        </View>
                        <View className="item-action">
                            <Button className="ovalbtn ovalbtn-pink">预约优惠</Button>
                        </View>
                    </View>
                </View>
                <View className="house-item house-type mt20">
                    <View className="house-item-header view-content">
                        <View className="title">主力户型(5)</View>
                        <View className="more">
                            <Text>更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="house-type-content">
                        <Swiper displayMultipleItems={2.5}>
                            <SwiperItem>
                                <View className="swiper-item">
                                    <View className="item-image">
                                        <Image src="http://192.168.2.248/assets/images/1400x933_4.png"></Image>
                                    </View>
                                    <View className="item-title">
                                        <Text>4室2厅2卫</Text>
                                        <Text>169.32m²</Text>
                                    </View>
                                    <View className="item-price">120万</View>
                                </View>
                            </SwiperItem>
                            <SwiperItem>
                                <View className="swiper-item">
                                    <View className="item-image">
                                        <Image src=""></Image>
                                    </View>
                                    <View className="item-title">
                                        <Text>3室2厅2卫</Text>
                                        <Text>124.22m²</Text>
                                    </View>
                                    <View className="item-price">87万</View>
                                </View>
                            </SwiperItem>
                            <SwiperItem>
                                <View className="swiper-item">
                                    <View className="item-image">
                                        <Image src=""></Image>
                                    </View>
                                    <View className="item-title">
                                        <Text>2室2厅2卫</Text>
                                        <Text>89.54m²</Text>
                                    </View>
                                    <View className="item-price">70万</View>
                                </View>
                            </SwiperItem>
                            <SwiperItem>
                                <View className="swiper-item">
                                    <View className="item-image">
                                        <Image src=""></Image>
                                    </View>
                                    <View className="item-title">
                                        <Text>2室1厅1卫</Text>
                                        <Text>67.37m²</Text>
                                    </View>
                                    <View className="item-price">56万</View>
                                </View>
                            </SwiperItem>
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
                                latitude={houseData.lat}
                                longitude={houseData.lng}
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
                <View className="house-comment mt20">
                    <View className="house-item-header view-content">
                        <View className="title">用户评论(11)</View>
                        <View className="more">
                            <Text>查看更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="house-item">
                        <View className="house-item-content">
                            <View className="comment-item">
                                <View className="user-photo">
                                    <Image src="http://192.168.2.248/assets/images/user_photo.jpg"></Image>
                                </View>
                                <View className="comment-text">
                                    <View className="name">Nyan Shen</View>
                                    <View className="text">未来周边配套怎么样啊，附近小学是哪个，什么时候投入使用，有没有超市，医院</View>
                                </View>
                            </View>
                            <View className="comment-item">
                                <View className="user-photo">
                                    <Image src="http://192.168.2.248/assets/images/user_photo.jpg"></Image>
                                </View>
                                <View className="comment-text">
                                    <View className="name">Nyan Shen</View>
                                    <View className="text">未来周边配套怎么样啊，附近小学是哪个，什么时候投入使用，有没有超市，医院</View>
                                </View>
                            </View>
                            <View className="btn btn-blue">
                                <Text className="btn-name">我要评论</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="house-question">
                    <View className="house-item-header view-content">
                        <View className="title">大家都在问(3)</View>
                        <View className="more">
                            <Text>查看更多</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="house-item">
                        <View className="house-item-content">
                            <View className="question-item">
                                <View className="question">
                                    <Text className="iconfont iconwen"></Text>
                                    <Text className="text">五中学校主体现在建好了吗？</Text>
                                </View>
                                <View className="question">
                                    <Text className="iconfont iconda"></Text>
                                    <Text className="text da">您好，襄阳五中华侨城实验学校已经封顶了，明年9月1日就正式开学了。</Text>
                                </View>
                            </View>
                            <View className="question-item">
                                <View className="question">
                                    <Text className="iconfont iconwen"></Text>
                                    <Text className="text">五中学校主体现在建好了吗？</Text>
                                </View>
                                <View className="question">
                                    <Text className="iconfont iconda"></Text>
                                    <Text className="text da">建好了。</Text>
                                </View>
                            </View>
                            <View className="btn btn-blue">
                                <Text className="btn-name">我要提问</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="house-consultant mt20">
                    <View className="house-item-header view-content">
                        <View className="title">置业顾问(3)</View>
                    </View>
                    <View className="house-consultant-content clearfix">
                        <View className="consultant-item">
                            <View className="item-image">
                                <Image src="http://192.168.2.248/assets/images/105x105.jpg"></Image>
                            </View>
                            <View className="item-name">胡锦文</View>
                            <View className="item-btn">
                                <Button className="ovalbtn ovalbtn-brown">
                                    <Text className="iconfont"></Text>
                                    <Text>咨询</Text>
                                </Button>
                            </View>
                        </View>
                        <View className="consultant-item">
                            <View className="item-image">
                                <Image src="http://192.168.2.248/assets/images/105x105.jpg"></Image>
                            </View>
                            <View className="item-name">胡文</View>
                            <View className="item-btn">
                                <Button className="ovalbtn ovalbtn-brown">
                                    <Text className="iconfont"></Text>
                                    <Text>咨询</Text>
                                </Button>
                            </View>
                        </View>
                        <View className="consultant-item">
                            <View className="item-image">
                                <Image src="http://192.168.2.248/assets/images/105x105.jpg"></Image>
                            </View>
                            <View className="item-name">胡锦文</View>
                            <View className="item-btn">
                                <Button className="ovalbtn ovalbtn-brown">
                                    <Text className="iconfont"></Text>
                                    <Text>咨询</Text>
                                </Button>
                            </View>
                        </View>
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