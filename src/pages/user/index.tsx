import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import NavBar from '@components/navbar/index'
import './index.scss'

interface IUser {
  avatarUrl: string
  nickname?: string
  username: string
}

const INIT_USER: IUser = {
  avatarUrl: 'http://192.168.2.248/assets/mini/user_photo.png',
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
  }

  return (
    <View className="user">
      <NavBar title="个人中心" home={true} />
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
      {
        user.username &&
        <View className="user-item user-logout" onClick={handleLogout}>
          <Text>退出登录</Text>
        </View>
      }
    </View>
  )
}

export default User
