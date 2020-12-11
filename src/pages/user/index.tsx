import React, { useState } from 'react'
import Taro, { makePhoneCall, useDidShow } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import ChatEvent from '@utils/event'
import { toUrlParam } from '@utils/urlHandler'
import './index.scss'

interface IUser {
  id?: string
  sex?: string
  mobile?: string
  avatarUrl: string
  nickname?: string
  username: string
}

const INIT_USER: IUser = {
  avatarUrl: 'https://static.fczx.com/www/assets/mini/user_photo.png',
  username: ''
}
const JOIN_PHONE = '18671072505'

const User = () => {
  const [user, setUser] = useState<IUser>(INIT_USER)

  useDidShow(() => {
    app.request({
      url: app.apiUrl(api.getUserData)
    }, { loading: false }).then((result: any) => {
      if (result) {
        setUser({
          id: result.id,
          sex: result.sex,
          mobile: result.mobile,
          avatarUrl: result.avatar,
          username: result.username,
          nickname: result.nickname
        })
      }
    })
  })
  const getUserInfo = (e: any) => {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      app.request({
        url: app.apiUrl(api.syncWxUser),
        method: 'POST',
        data: { ...e.detail.userInfo }
      }, { loading: false }).then((result: any) => {
        setUser({
          id: result.id,
          sex: result.sex,
          mobile: result.mobile,
          avatarUrl: result.avatar,
          username: result.username,
          nickname: result.nickname
        })
        Taro.showToast({
          title: '同步成功',
          icon: 'success'
        })
      })
    }
  }

  const gotoLogin = () => {
    if (user.username) {
      taroNavigateTo(`/user/profile/index${toUrlParam(user)}`)
      return
    }
    taroNavigateTo('/login/index')
  }

  const handleLogout = () => {
    storage.clear('login')
    setUser(INIT_USER)
    ChatEvent.clearTimer()
    Taro.hideTabBarRedDot({ index: 1 })
  }

  const toUserModule = (url: string, type: string = 'esf') => {
    if (user.username) {
      taroNavigateTo(`/house/manage/${url}/index?type=${type}`)
    } else {
      taroNavigateTo('/login/index')
    }
  }

  const toOfficialAccount = () => {
    taroNavigateTo('/user/official/index')
  }

  const taroNavigateTo = (url: string) => {
    Taro.navigateTo({ url })
  }

  return (
    <View className="user">
      <View className="user-group">
        <View className="user-item user-header" onClick={gotoLogin}>
          <View className="login-photo">
            <Image className="login-photo-image" src={user.avatarUrl} />
          </View>
          <View className="login-text">
            <Text className="login-name">{user.username ? user.nickname || user.username : '登录/注册'}</Text>
          </View>
          <View className="login-nav">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </View>
      </View>

      <View className="user-group">
        <View className="user-item" onClick={() => toUserModule('list')}>
          <View className="item-icon blue">
            <Text className="iconfont iconmanage"></Text>
          </View>
          <View className="item-text">管理出售</View>
          <View className="item-arrow">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </View>
        <View className="user-item" onClick={() => toUserModule('list', 'rent')}>
          <View className="item-icon blue">
            <Text className="iconfont iconmanage"></Text>
          </View>
          <View className="item-text">管理出租</View>
          <View className="item-arrow">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </View>
        <View className="user-item" onClick={() => toUserModule('sale')}>
          <View className="item-icon cyan">
            <Text className="iconfont iconsquare"></Text>
          </View>
          <View className="item-text">我要卖房</View>
          <View className="item-arrow">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </View>
        <View className="user-item" onClick={() => toUserModule('sale', 'rent')}>
          <View className="item-icon lightblue">
            <Text className="iconfont iconhomepage"></Text>
          </View>
          <View className="item-text">我要出租</View>
          <View className="item-arrow">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </View>
      </View>
      <View className="user-group">
        <Button className="user-item user-item-btn" open-type="contact">
          <View className="item-icon origin">
            <Text className="iconfont iconservice"></Text>
          </View>
          <View className="item-text">在线客服</View>
          <View className="item-arrow">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </Button>
        <View className="user-item" onClick={() => makePhoneCall({ phoneNumber: JOIN_PHONE })}>
          <View className="item-icon blue3">
            <Text className="iconfont iconjoin"></Text>
          </View>
          <View className="item-text">商务合作</View>
          <View className="item-arrow">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </View>
        <View className="user-item" onClick={toOfficialAccount}>
          <View className="item-icon blue2">
            <Text className="iconfont iconcode"></Text>
          </View>
          <View className="item-text">关注公众号</View>
          <View className="item-arrow">
            <Text className="iconfont iconarrow-right-bold"></Text>
          </View>
        </View>
        {
          user.username &&
          <Button className="user-item user-item-btn" open-type="getUserInfo" onGetUserInfo={getUserInfo}>
            <View className="item-icon">
              <Text className="iconfont iconwechat"></Text>
            </View>
            <View className="item-text">同步微信</View>
            <View className="item-arrow">
              <Text className="iconfont iconarrow-right-bold"></Text>
            </View>
          </Button>
        }
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
