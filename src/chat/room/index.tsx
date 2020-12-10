import React, { useEffect, useRef, useState } from 'react'
import Taro, { getCurrentInstance, useDidShow, useReady } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Image } from "@tarojs/components"
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { toUrlParam } from '@utils/urlHandler'
import { PRICE_TYPE } from '@constants/house'
import { fetchUserData } from '@services/login'
import { formatChatListTime } from '@utils/index'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import './index.scss'

interface IParam {
    currentPage: number
}

const INIT_PARAM = { currentPage: 1 }
const MESSAGE_TYPE = {
    text: '1',
    image: '2',
    image_text: '3'
}
const EXPRESSIONS = [
    '你好，房子还有吗？',
    '首付大概要多少',
    '位置在哪？可以发我下位置吗？',
    '什么时候方便看房子？',
    '房子的价格还可以谈么',
]
const PAGE_LIMIT: number = 20
const INIT_ACTION = { expression: false, photo: false }
const INIT_INPUT_DATA = { value: '', send: false }

const ChatRoom = () => {
    const params: any = getCurrentInstance().router?.params
    const fromUserId: string = params.fromUserId
    const messageType: string = params.messageType
    const content: string = params.content
    const toUser: any = JSON.parse(params.toUser || '{}') || {}
    const { contentHeight } = useNavData()

    const [user, setUser] = useState<any>({})
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [chatData, setChatData] = useState<any[]>([])
    const [bottom, setBottom] = useState<number>(0)
    const [toView, setToView] = useState<string>('')
    const [images, setImages] = useState<string[]>([])
    const [action, setAction] = useState<any>(INIT_ACTION)
    const [inputData, setInputData] = useState<any>(INIT_INPUT_DATA)
    const ref = useRef<string>('') // 判断显示时间点

    useReady(() => {
        Taro.setNavigationBarTitle({ title: toUser.nickname })
    })

    useDidShow(() => {
        const paramString = toUrlParam({
            messageType,
            fromUserId,
            toUser: params.toUser,
            content: params.content
        })
        const backUrl = `/chat/room/index${paramString}`
        fetchUserData(backUrl).then((result) => {
            setUser(result)
        })
    })

    useEffect(() => {
        if (messageType && content) {
            sendMessage(messageType, content)
        }
    }, [])

    useEffect(() => {
        fetchChatData()
    }, [param])

    const fetchChatData = () => {
        app.request({
            url: app.apiUrl(api.getChatData),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                from_user_id: fromUserId,
            }
        }, { loading: false }).then((result: any) => {
            const resData = result.data
            if (param.currentPage === INIT_PARAM.currentPage) {
                setChatData(resData)
                imageFilter(resData)
            } else {
                const dataList = [...resData, ...chatData]
                setChatData(dataList)
                imageFilter(dataList)
            }
            if (resData.length > 0) {
                setToView(`toView_${resData[resData.length - 1].id}`)
            }
            setPage({
                ...page,
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
        })
    }

    const imageFilter = (dataList) => {
        var images: string[] = []
        for (const item of dataList) {
            if (item.message_type == '2') {
                images.push(item.content)
            }
        }
        setImages(images)
    }

    const handleViewImage = (content: string) => {
        Taro.previewImage({
            urls: images,
            current: content
        })
    }

    const handleScrollToUpper = () => {
        if (page.totalPage > param.currentPage) {
            setParam({
                currentPage: param.currentPage + 1
            })
        }
    }

    const handleInputFocus = (e: any) => {
        setAction(INIT_ACTION)
        setBottom(e.detail.height)
        setToView(`toView_${chatData[chatData.length - 1].id}`)
    }

    const handleInputChange = (e: any) => {
        const value = e.detail.value
        setInputData({
            value,
            send: !!value
        })
    }

    const handlePhotoClick = (type: any) => {
        Taro.chooseImage({
            count: 9,
            sourceType: [type],
            success: (res: any) => {
                app.uploadFile(res, (result: string) => {
                    sendActionMessage(MESSAGE_TYPE.image, result)
                })
            }
        })
    }

    const handlePhoneCall = () => {
        Taro.makePhoneCall({ phoneNumber: toUser.mobile })
    }

    const handleCopyWechat = () => {
        Taro.setClipboardData({ data: toUser.wx })
    }

    const sendMessage = (type: string, content: any) => {
        app.request({
            url: app.apiUrl(api.postChatSend),
            method: 'POST',
            data: {
                to_user_id: toUser.id,
                message_type: type,
                content
            }
        }, { loading: false }).then(() => {
            setParam({
                currentPage: INIT_PARAM.currentPage
            })
        })
    }

    const sendActionMessage = (type: string, content: string) => {
        sendMessage(type, content)
        setAction(INIT_ACTION)
    }

    const sendInputMessage = (content: string) => {
        sendMessage(MESSAGE_TYPE.text, content)
        setInputData(INIT_INPUT_DATA)
    }

    const toggleAction = (name: string) => {
        setAction({
            ...action,
            [name]: !action[name]
        })
    }

    const toHouseRoom = (type: string, content: any) => {
        Taro.navigateTo({
            url: `/house/${type}/index/index?id=${content.id}&title=${content.title}`
        })
    }

    const toHouseType = (content: any) => {
        Taro.navigateTo({
            url: `/house/new/type/detail?id=${content.id}`
        })
    }

    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <View className="content-price">待定</View>
        } else {
            return <View className="content-price">{price}{PRICE_TYPE[price_type]}</View>
        }
    }

    const renderContentByType = (chatItem: any, isMine: boolean = false) => {
        let itemContent: any = null
        switch (chatItem.message_type) {
            case '1':
                return <Text className={classnames('text', isMine && 'text-primary')} selectable>{chatItem.content}</Text>
            case '2':
                return <Image
                    className="image"
                    src={chatItem.content}
                    mode="widthFix"
                    onClick={() => handleViewImage(chatItem.content)}
                />
            case '3':
                itemContent = JSON.parse(chatItem.content)
                return (
                    <View className="content" onClick={() => toHouseRoom('new', itemContent)}>
                        <View className="content-image">
                            <Image src={itemContent.image_path} mode="aspectFill" />
                            <View className="tag">新房</View>
                        </View>
                        <View className="content-title">{itemContent.title}</View>
                        <View className="content-text">{itemContent.areaName}</View>
                        {renderPrice(itemContent.price, itemContent.price_type)}
                    </View>
                )
            case '4':
                itemContent = JSON.parse(chatItem.content)
                return (
                    <View className="content" onClick={() => toHouseRoom('rent', itemContent)}>
                        <View className="content-image">
                            <Image src={itemContent.image_path} mode="aspectFill" />
                            <View className="tag">二手房</View>
                        </View>
                        <View className="content-title">{itemContent.title}</View>
                        <View className="content-text">
                            <Text>{itemContent.room}室{itemContent.office}厅{itemContent.toilet}卫</Text>
                            <Text className="ml20">{itemContent.building_area}㎡</Text>
                        </View>
                        {renderPrice(itemContent.price, itemContent.price_type)}
                    </View>
                )
            case '5':
                const RENT_TYPE = {
                    '1': '整租',
                    '2': '合租'
                }
                itemContent = JSON.parse(chatItem.content)
                return (
                    <View className="content" onClick={() => toHouseRoom('rent', itemContent)}>
                        <View className="content-image">
                            <Image src={itemContent.image_path} mode="aspectFill" />
                            <View className="tag">租房</View>
                        </View>
                        <View className="content-title">{itemContent.title}</View>
                        <View className="content-text">
                            <Text>{itemContent.room}室{itemContent.office}厅{itemContent.toilet}卫</Text>
                            <Text className="ml20">{RENT_TYPE[itemContent.rent_type]}</Text>
                        </View>
                        <View className="content-price">{itemContent.price}元/月</View>
                    </View>
                )
            case '6':
                itemContent = JSON.parse(chatItem.content)
                return (
                    <View className="content" onClick={() => toHouseType(itemContent)}>
                        <View className="content-image">
                            <Image src={itemContent.image_path} mode="aspectFill" />
                            <View className="tag">新房户型</View>
                        </View>
                        <View className="content-title">
                            <Text>{itemContent.name}</Text>
                            <Text className="ml20">{itemContent.room}室{itemContent.office}厅{itemContent.toilet}卫</Text>
                        </View>
                        <View className="content-text">
                            <Text>{itemContent.title}</Text>
                        </View>
                        {renderPrice(itemContent.price, itemContent.price_type)}
                    </View>
                )
            default:
                return null
        }
    }

    const renderTime = (time: string) => {
        if (ref.current !== time) {
            ref.current = time
            return (
                <View className="item-tip">
                    <Text className="text">{formatChatListTime(time)}</Text>
                </View>
            )
        }
    }

    const renderChatList = () => {
        return chatData.map((item: any, index: number) => (
            <View key={index} id={`toView_${item.id}`}>
                {
                    item.from_user_id === fromUserId ?
                        (
                            <View className="msg-item">
                                {renderTime(item.time)}
                                <View className="item-content">
                                    <View className="photo">
                                        <Image src={toUser.avatar} />
                                    </View>
                                    <View className="message">
                                        {renderContentByType(item)}
                                    </View>
                                </View>
                            </View>
                        ) :
                        (
                            <View className="msg-item">
                                {renderTime(item.time)}
                                <View className="item-content item-content-reverse">
                                    <View className="photo">
                                        <Image src={user.avatar} />
                                    </View>
                                    <View className="message">
                                        {renderContentByType(item, true)}
                                    </View>
                                </View>
                            </View>
                        )
                }
            </View>
        ))
    }

    return (
        <View className="chat-room">
            <View className="chat-room-content">
                <ScrollView
                    scrollY
                    className="msg-box"
                    style={{ maxHeight: contentHeight - 94 }}
                    upperThreshold={40}
                    onScrollToUpper={handleScrollToUpper}
                    onClick={() => setAction(INIT_ACTION)}
                    scrollIntoView={toView}
                    scrollWithAnimation={false}
                >
                    {renderChatList()}
                </ScrollView>
                <View className="send-box" style={{ bottom }}>
                    <View className="send-action">
                        <View
                            className={classnames('action-item', action.expression && 'actived')}
                            onClick={() => toggleAction('expression')}>
                            <Text>常用语</Text>
                        </View>
                        {
                            toUser.is_show_more &&
                            <View className="action-item" onClick={handlePhoneCall}>
                                <Text>电话咨询</Text>
                            </View>
                        }
                        {
                            toUser.is_show_more &&
                            toUser.wx &&
                            <View className="action-item" onClick={handleCopyWechat}>
                                <Text>复制微信号</Text>
                            </View>
                        }
                    </View>
                    <View className="send-content">
                        <Input
                            adjustPosition={false}
                            onFocus={handleInputFocus}
                            onBlur={() => setBottom(0)}
                            value={inputData.value}
                            onInput={handleInputChange}
                        />
                        {
                            inputData.send ?
                                <View
                                    className="btn btn-primary"
                                    onClick={() => sendInputMessage(inputData.value)}
                                >
                                    <Text className="text">发送</Text>
                                </View> :
                                <View
                                    className={classnames('icon-btn', action.photo && 'actived')}
                                    onClick={() => toggleAction('photo')}
                                >
                                    <Text className="iconfont iconadd"></Text>
                                </View>
                        }
                    </View>
                    {
                        action.photo &&
                        <View className="photo-content">
                            <View className="photo-item photo-album" onClick={() => handlePhotoClick('album')}>
                                <View className="iconfont iconphoto"></View>
                                <View className="text">照片</View>
                            </View>
                            <View className="photo-item photograph" onClick={() => handlePhotoClick('camera')}>
                                <View className="iconfont iconphotograph"></View>
                                <View className="text">拍照</View>
                            </View>
                        </View>
                    }
                    {
                        action.expression &&
                        <View className="expressions">
                            {
                                EXPRESSIONS.map((item: string, index: number) => (
                                    <View
                                        key={index}
                                        className="expressions-item"
                                        onClick={() => sendActionMessage(MESSAGE_TYPE.text, item)}
                                    >
                                        <Text>{item}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}
export default ChatRoom