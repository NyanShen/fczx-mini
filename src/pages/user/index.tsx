import React, { useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import storage from '@utils/storage'
import NavBar from '@components/navbar/index'
import './index.scss'

interface IUser {
  avatarUrl: string
  nickName?: string
}

const INIT_USER: IUser = {
  avatarUrl: 'http://192.168.2.248/assets/mini/user_photo.png'
}

console.log("test")

const User = () => {
  const [user, setUser] = useState<IUser>(INIT_USER)

  useDidShow(() => {
    const storageUser = storage.getItem('user', 'login')
    if (storageUser) {
      setUser({ ...storageUser })
    }
  })

  const gotoLogin = () => {
    if (user.nickName) {
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
          <Text className="login-name">{user.nickName ? user.nickName : '登录/注册'}</Text>
        </View>
        {
          !user.nickName &&
          <View className="login-nav">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        }
      </View>
      {
        user.nickName &&
        <View className="user-item user-logout" onClick={handleLogout}>
          <Text>退出登录</Text>
        </View>
      }
    </View>
  )
}

export default User
