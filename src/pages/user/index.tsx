import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import NavBar from '@components/navbar/index'
import './index.scss'

const User = () => {

  const gotoLogin = () => {
    Taro.navigateTo({
      url: '/login/index'
    })
  }

  return (
    <View className="user">
      <NavBar title="个人中心" home={true} />
      <View className="user-header" onClick={gotoLogin}>
        <View className="login-photo">
          <Image className="login-photo-image" src="http://192.168.2.248/assets/mini/user_photo.png" />
        </View>
        <View className="login-text">
          <Text className="login-name">登录/注册</Text>
        </View>
        <View className="login-nav">
          <Text className="iconfont iconarrow-right-bold"></Text>
        </View>
      </View>
    </View>
  )
}

export default User
