import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import CustomSocket from '@utils/socket'
import { getToken, hasLogin } from '@services/login'
import { toChatRoom } from '@/router/router'
import { formatTimestamp } from '@utils/index'
import logo from '@assets/icons/logo.png'
import NavBar from '@/components/navbar'
import './index.scss'

let is_subscribe_wx: boolean = false

const Chat = () => {
  const [user, setUser] = useState<any>(null)
  const [chatDialog, setChatDialog] = useState<any[]>([])

  CustomSocket.onSocketMessage((message: any) => {
    console.log('chatDiaglog onSocketMessage', message)
    fetchChatDialog()
  })

  useDidShow(() => {
    if (user && getToken()) {
      fetchChatDialog()
      return
    }
    hasLogin().then((result: any) => {
      if (result) {
        setUser(result)
        fetchChatDialog()
      } else {
        setUser(null)
      }
    })
    is_subscribe_wx = storage.getItem('is_subscribe_wx')
  })

  const fetchChatDialog = () => {
    app.request({
      url: app.apiUrl(api.getChatDialog)
    }, { loading: false }).then((result: any[]) => {
      setChatDialog(result)
      //异常删除会话列表处理
      if (result.length <= 0) {
        storage.setItem('chat_unread', [])
      }
      CustomSocket.onChatUnread()
    })
  }

  const handleToChatRoom = (item: any) => {
    let fromUserId: string = ''
    if (user.id == item.from_user_id) {
      fromUserId = item.to_user_id
    } else {
      fromUserId = item.from_user_id
    }
    updateChatUnread(fromUserId)

    const params: any = {
      fromUserId,
      toUser: JSON.stringify(item.user)
    }
    toChatRoom(params)
  }

  const updateChatUnread = (fromUserId: string | number) => {
    const new_chat_unread: any[] = []
    const chat_unread: any[] = storage.getItem('chat_unread') || []
    for (const item of chat_unread) {
      if (item.from_user_id != fromUserId) {
        new_chat_unread.push(item)
      }
    }
    storage.setItem('chat_unread', new_chat_unread)
  }

  const toLogin = () => {
    const backUrl = '/pages/chat/index'
    app.toLogin(backUrl, 'istab', 'navigateTo')
  }

  const toOfficialAccount = () => {
    Taro.navigateTo({
      url: '/user/official/index'
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
    if (chatDialog && chatDialog.length > 0) {
      return chatDialog.map((item: any, index: number) => {
        const user = item.user || {}
        return (
          <View key={index} className="chat-item" onClick={() => handleToChatRoom(item)}>
            <View className="item-photo">
              <Image className="taro-image" src={user.avatar} mode="aspectFill"></Image>
              {
                item.status == '1' && item.to_user_id == user.id &&
                <View className="item-dot"></View>
              }
            </View>
            <View className="item-text">
              <View className="item-text-item">
                <View className="name">{user.nickname}</View>
                <View className="date">{item.modified && formatTimestamp(item.modified, 'MM-dd hh:mm')}</View>
              </View>
              <View className="item-text-item">
                <View className="record">{renderContent(item)}</View>
              </View>
            </View>
          </View>
        )
      })
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
      <NavBar title="会话列表" showIcon={false} />
      {
        user && user.is_subscribe_wx != 1 && !is_subscribe_wx &&
        <View className="official">
          <View className="official-photo">
            <Image className="taro-image" src={logo} mode="aspectFill"></Image>
          </View>
          <View className="official-context">
            <View className="title">房产在线云</View>
            <View className="memo">关注房产在线公众号，获取最新消息</View>
          </View>
          <View className="official-btn" onClick={toOfficialAccount}>
            <View className="btn btn-plain">关注</View>
          </View>
        </View>
      }

      <View className="chat-content">
        {
          user ? renderDialog() : renderLogin()
        }
      </View>
    </View>
  )
}
export default Chat
