import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Input, Image } from "@tarojs/components"

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import './index.scss'


interface IParam {
    currentPage: number
}

const INIT_PARAM = { currentPage: 1 }

const ChatRoom = () => {
    const PAGE_LIMIT: number = 10
    const router: any = getCurrentInstance().router
    const fromUserId: string = router?.params.fromUserId
    const toUser: any = JSON.parse(router?.params.toUser) || {}
    const { contentHeight } = useNavData()
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [chatList, setChatList] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: app.testApiUrl(api.getChatData),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                from_user_id: fromUserId,
            }
        }).then((result: any) => {
            setChatList([...chatList, ...result.data])
            setPage({
                ...page,
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
        })
    }, [])

    const handleScrollToLower = () => {
        if (page.totalPage > param.currentPage) {
            setParam({
                currentPage: param.currentPage + 1
            })
        }
    }

    const renderChatList = () => {
        return chatList.map((item: any, index: number) => (
            <View key={index} className="msg-item">
                {
                    item.to_user_id !== toUser.id ?
                        (
                            <View className="msg-item">
                                <View className="item-content">
                                    <View className="photo">
                                        <Image src={toUser.avatar} />
                                    </View>
                                    <View className="message">
                                        <Text className="text">{item.content}</Text>
                                    </View>
                                </View>
                                <View className="item-tip">
                                    <Text className="text">{formatTimestamp(item.modified, 'MM-dd')}</Text>
                                </View>
                            </View>
                        ) :
                        (
                            <View className="msg-item">
                                <View className="item-content item-content-reverse">
                                    <View className="photo">
                                        <Image src="" />
                                    </View>
                                    <View className="message">
                                        <Text className="text text-primary">{item.content}</Text>
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
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {renderChatList()}
                </ScrollView>
                <View className="send-box">
                        <View className="send-content">
                            <Input />
                            <View className="btn btn-primary">
                                <Text>发送</Text>
                            </View>
                        </View>
                    </View>
            </View>
        </View>
    )
}
export default ChatRoom