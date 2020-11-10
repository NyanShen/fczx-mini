import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import map from 'lodash/map'

import api from '@services/api'
import app from '@services/request'
import ChatEvent from '@utils/event'
import NavBar from '@components/navbar/index'
import { toUrlParam } from '@utils/urlHandler'
import { formatTimestamp } from '@utils/index'
import { hasLogin } from '@services/login'
import './index.scss'

const Chat = () => {
  const [user, setUser] = useState<any>(null)
  const [unread, setUnread] = useState<string[]>([])
  const [chatDialog, setChatDialog] = useState<any[]>([])

  useDidShow(() => {
    hasLogin().then((result: any) => {
      if (result) {
        setUser(result)
        fetchChatDialog()
      } else {
        setUser(null)
      }
    })
  })

  const fetchChatDialog = () => {
    app.request({
      url: app.testApiUrl(api.getChatDialog)
    }).then((result: any) => {
      setChatDialog(result)
    })
    ChatEvent.on('chat', (result: any[]) => {
      setUnread(map(result, 'to_user_id'))
    })
  }

  const toChatRoom = (item: any) => {
    const paramString = toUrlParam({
      id: item.id,
      fromUserId: item.from_user_id,
      toUser: JSON.stringify(item.user)
    })
    Taro.navigateTo({
      url: `/chat/room/index${paramString}`
    })
  }

  const toLogin = () => {
    const backUrl = '/pages/chat/index'
    Taro.navigateTo({
      url: `/login/index?backUrl=${encodeURIComponent(backUrl)}&isTab=istab`
    })
  }

  const renderLogin = () => {
    return (
      <View className="chat-login">
        <View className="title">您还没有登录</View>
        <View className="memo">登陆后查看会话，聊天更顺畅</View>
        <View className="btn btn-primary" onClick={toLogin}>
          立即登录
        </View>
      </View>
    )
  }

  const renderDialog = () => {
    if (chatDialog.length > 0) {
      return chatDialog.map((item: any, index: number) => (
        <View key={index} className="chat-item" onClick={() => toChatRoom(item)}>
          <View className="item-photo">
            <Image src={item.user.avatar} mode="aspectFill"></Image>
            {
              unread.includes(item.to_user_id) &&
              <View className="item-dot"></View>
            }
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
      ))
    } else {
      return (
        <View className="chat-empty">
          <View className="empty-text">暂无会话消息</View>
        </View>
      )
    }
  }

  return (
    <View className="chat">
      <NavBar title="会话列表" home={true} />
      <View className="chat-content">
        {
          user ? renderDialog() : renderLogin()
        }

      </View>
    </View>
  )
}
export default Chat
