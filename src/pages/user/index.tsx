import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import ChatEvent from '@utils/event'
import './index.scss'

interface IUser {
  avatarUrl: string
  nickname?: string
  username: string
}

const INIT_USER: IUser = {
  avatarUrl: 'https://static.fczx.com/www/assets/mini/user_photo.png',
  username: ''
}

const User = () => {
  const [user, setUser] = useState<IUser>(INIT_USER)

  useDidShow(() => {
    app.request({
      url: app.apiUrl(api.getUserData)
    }).then((result: any) => {
      if (result) {
        setUser({
          avatarUrl: result.avatar,
          username: result.username,
          nickname: result.nickname
        })
      }
    })
  })

  const gotoLogin = () => {
    if (user.username) {
      return
    }
    Taro.navigateTo({
      url: '/login/index'
    })
  }

  const handleLogout = () => {
    storage.clear('login')
    setUser(INIT_USER)
    ChatEvent.clearTimer()
    Taro.hideTabBarRedDot({ index: 1 })
  }

  const toUserModule = (url: string, type: string = 'esf') => {
    if (user.username) {
      Taro.navigateTo({ url: `/house/manage/${url}/index?type=${type}` })
    } else {
      Taro.navigateTo({
        url: '/login/index'
      })
    }
  }

  return (
    <View className="user">
      <View className="user-item user-header" onClick={gotoLogin}>
        <View className="login-photo">
          <Image className="login-photo-image" src={user.avatarUrl} />
        </View>
        <View className="login-text">
          <Text className="login-name">{user.username ? user.nickname || user.username : '登录/注册'}</Text>
        </View>
        {
          !user.username &&
          <View className="login-nav">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        }
      </View>
      <View className="user-item" onClick={() => toUserModule('list')}>
        <View className="item-icon">
          <Text className="iconfont iconmanage"></Text>
        </View>
        <View className="item-text">管理出售</View>
        <View className="item-arrow">
          <Text className="iconfont iconarrow-right-bold"></Text>
        </View>
      </View>
      <View className="user-item" onClick={() => toUserModule('list', 'rent')}>
        <View className="item-icon">
          <Text className="iconfont iconmanage"></Text>
        </View>
        <View className="item-text">管理出租</View>
        <View className="item-arrow">
          <Text className="iconfont iconarrow-right-bold"></Text>
        </View>
      </View>
      <View className="user-item" onClick={() => toUserModule('sale')}>
        <View className="item-icon">
          <Text className="iconfont iconsquare"></Text>
        </View>
        <View className="item-text">我要卖房</View>
        <View className="item-arrow">
          <Text className="iconfont iconarrow-right-bold"></Text>
        </View>
      </View>
      <View className="user-item" onClick={() => toUserModule('sale', 'rent')}>
        <View className="item-icon">
          <Text className="iconfont iconhomepage"></Text>
        </View>
        <View className="item-text">我要出租</View>
        <View className="item-arrow">
          <Text className="iconfont iconarrow-right-bold"></Text>
        </View>
      </View>
      {
        user.username &&
        <View className="user-logout" onClick={handleLogout}>
          <Text>退出登录</Text>
        </View>
      }
    </View>
  )
}

export default User
