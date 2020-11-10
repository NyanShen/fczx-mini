import React, { useEffect, useRef, useState } from 'react'
import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Image } from "@tarojs/components"
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE } from '@constants/house'
import { formatChatListTime } from '@utils/index'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import './index.scss'
import { fetchUserData } from '@services/login'


interface IParam {
    currentPage: number
}

const INIT_PARAM = { currentPage: 1 }

const MESSAGE_TYPE = {
    text: '1',
    image: '2',
    image_text: '3'
}

const ChatRoom = () => {
    const PAGE_LIMIT: number = 10
    const router: any = getCurrentInstance().router
    const fromUserId: string = router?.params.fromUserId
    const messageType: any = router?.params.messageType
    const content: any = router?.params.content
    const toUser: any = JSON.parse(router?.params.toUser) || {}
    const { contentHeight } = useNavData()
    const [user, setUser] = useState<any>({})
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [chatData, setChatData] = useState<any[]>([])
    const [bottom, setBottom] = useState<number>(0)
    const [toView, setToView] = useState<string>('')
    const [isPhoto, setIsPhoto] = useState<boolean>(false)
    const [inputData, setInputData] = useState<any>({ value: '', send: false })
    const ref = useRef<string>('')

    useDidShow(() => {
        fetchUserData().then((result) => {
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
            if (param.currentPage === INIT_PARAM.currentPage) {
                setChatData(result.data)
            } else {
                setChatData([...result.data, ...chatData])
            }
            if (result.data.length > 0) {
                setToView(`toView_${result.data[result.data.length - 1].id}`)
            }
            setPage({
                ...page,
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
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
        setIsPhoto(false)
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
                app.uploadFile(res).then((result: any) => {
                    sendMessage(MESSAGE_TYPE.image, result)
                })
            }
        })
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
        }).then(() => {
            setIsPhoto(false)
            setInputData({ value: '', send: false })
            setParam({
                currentPage: INIT_PARAM.currentPage
            })
        })
    }

    const toHouseRoom = (type: string, content: any) => {
        Taro.navigateTo({
            url: `/house/${type}/index/index?id=${content.id}&title=${content.title}`
        })
    }

    const renderContentByType = (chatItem: any, isMine: boolean = false) => {
        let itemContent: any = null
        switch (chatItem.message_type) {
            case '1':
                return <Text className={classnames('text', isMine && 'text-primary')} selectable>{chatItem.content}</Text>
            case '2':
                return <Image className="image" src={chatItem.content} mode="widthFix" />
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
                        <View className="content-text">{itemContent.price}{PRICE_TYPE[itemContent.price_type]}</View>
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
                            <Text className="area">{itemContent.building_area}㎡</Text>
                        </View>
                        <View className="content-price">{itemContent.price}{PRICE_TYPE[itemContent.price_type]}</View>
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
                                <Text className="area">{RENT_TYPE[itemContent.rent_type]}</Text>
                            </View>
                            <View className="content-price">{itemContent.price}元/月</View>
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
            <NavBar title={toUser.nickname} back={true}></NavBar>
            <View className="chat-room-content">
                <ScrollView
                    scrollY
                    className="msg-box"
                    style={{ maxHeight: contentHeight - 52 }}
                    upperThreshold={40}
                    onScrollToUpper={handleScrollToUpper}
                    onClick={() => setIsPhoto(false)}
                    scrollIntoView={toView}
                    scrollWithAnimation={false}
                >
                    {renderChatList()}
                </ScrollView>
                <View className="send-box" style={{ bottom }}>
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
                                    onClick={() => sendMessage(MESSAGE_TYPE.text, inputData.value)}
                                >
                                    <Text className="text">发送</Text>
                                </View> :
                                <View className="icon-btn" onClick={() => setIsPhoto(true)}>
                                    <Text className="iconfont iconadd"></Text>
                                </View>
                        }
                    </View>
                    {
                        isPhoto &&
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
                </View>
            </View>
        </View>
    )
}
export default ChatRoom