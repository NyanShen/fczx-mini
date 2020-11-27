import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import ChatEvent from '@utils/event'
import { toUrlParam } from '@utils/urlHandler'
import { formatTimestamp } from '@utils/index'
import { hasLogin } from '@services/login'
import './index.scss'

const Chat = () => {
  const [user, setUser] = useState<any>(null)
  const [unread, setUnread] = useState<string>('')
  const [chatDialog, setChatDialog] = useState<any[]>([])

  useDidShow(() => {
    hasLogin().then((result: any) => {
      if (result) {
        setUser(result)
        fetchChatDialog(result)
      } else {
        setUser(null)
      }
    })
  })

  useEffect(() => {
    if (user && unread) {
      fetchChatDialog(user)
    }
  }, [unread])

  const fetchChatDialog = (user: any) => {
    app.request({
      url: app.apiUrl(api.getChatDialog)
    }, { loading: false }).then((result: any) => {
      setChatDialog(result)
      getUnreadStatus(result, user)
    })
    ChatEvent.on('chat', (result: string) => {
      setUnread(result)
    })
  }

  const getUnreadStatus = (result: any[], user: any) => {
    let status = false
    for (const item of result) {
      if (item.status == '1' && item.to_user_id == user.id) {
        status = true
        break
      }
    }
    ChatEvent.emitStatus('chat_status', { status })
  }

  const toChatRoom = (item: any) => {
    let fromUserId: string = ''
    if (user.id == item.from_user_id) {
      fromUserId = item.to_user_id
    } else {
      fromUserId = item.from_user_id
    }
    const paramString = toUrlParam({
      fromUserId,
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
        <View className="memo">登录后查看会话，聊天更顺畅</View>
        <View className="btn btn-primary" onClick={toLogin}>
          立即登录
        </View>
      </View>
    )
  }

  const renderContent = (item: any) => {
    switch (item.message_type) {
      case '1':
        return item.last_content
      case '2':
        return '[图片]'
      case '3': //新房
      case '4': //二手房
      case '5': //租房
      case '6': //新房户型
        return '[房源]'
      default:
        return null
    }
  }

  const renderDialog = () => {
    if (chatDialog.length > 0) {
      return chatDialog.map((item: any, index: number) => (
        <View key={index} className="chat-item" onClick={() => toChatRoom(item)}>
          <View className="item-photo">
            <Image src={item.user.avatar} mode="aspectFill"></Image>
            {
              item.status == '1' && item.to_user_id == user.id &&
              <View className="item-dot"></View>
            }
          </View>
          <View className="item-text">
            <View className="item-text-item">
              <View className="name">{item.user.nickname}</View>
              <View className="date">{item.modified && formatTimestamp(item.modified, 'MM-dd hh:mm')}</View>
            </View>
            <View className="item-text-item">
              <View className="record">{renderContent(item)}</View>
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
      <View className="chat-content">
        {
          user ? renderDialog() : renderLogin()
        }
      </View>
    </View>
  )
}
export default Chat
