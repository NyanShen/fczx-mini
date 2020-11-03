import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import NavBar from '@components/navbar/index'

import api from '@services/api'
import app from '@services/request'
import { toUrlParam } from '@utils/urlHandler'
import { formatTimestamp } from '@utils/index'
import { fetchUserData } from '@services/login'
import './index.scss'

const Chat = () => {
  const [user, setUser] = useState<any>({})
  const [chatDialog, setChatDialog] = useState<any[]>([])

  useDidShow(() => {
    const backUrl: string = '/pages/chat/index'
    fetchUserData(backUrl).then((result: any) => {
      setUser(result)
    })
  })

  useEffect(() => {
    app.request({
      url: app.testApiUrl(api.getChatDialog)
    }).then((result: any) => {
      setChatDialog(result)
    })
  }, [])

  const toChatRoom = (item: any) => {
    const paramString = toUrlParam({
      id: item.id,
      fromUserId: item.from_user_id,
      user: JSON.stringify(user),
      toUser: JSON.stringify(item.user)
    })
    Taro.navigateTo({
      url: `/chat/room/index${paramString}`
    })
  }
  return (
    <View className="chat">
      <NavBar title="会话列表" home={true} />
      <View className="chat-content">
        {
          chatDialog.length > 0 ?
            chatDialog.map((item: any, index: number) => (
              <View key={index} className="chat-item" onClick={() => toChatRoom(item)}>
                <View className="item-photo">
                  <Image src={item.user.avatar} mode="aspectFill"></Image>
                </View>
                <View className="item-text">
                  <View className="item-text-item">
                    <View className="name">{item.user.nickname}</View>
                    <View className="date">{formatTimestamp(item.modified, 'MM-dd')}</View>
                  </View>
                  <View className="item-text-item">
                    <View className="record">{item.last_content}</View>
                  </View>
                </View>
              </View>
            )) :
            <View className="chat-empty">
              <View className="empty-text">暂无会话消息</View>
            </View>
        }
      </View>
    </View>
  )
}
export default Chat
