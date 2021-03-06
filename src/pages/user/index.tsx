import React, { useState } from 'react'
import Taro, { makePhoneCall, useDidShow, eventCenter } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'

import app from '@services/request'
import CustomSocket from '@utils/socket'
import { hasLogin } from '@services/login'
import { toUrlParam } from '@utils/urlHandler'
import NavBar from '@/components/navbar'
import storage from '@/utils/storage'
import './index.scss'

const INIT_USER: any = {
  avatar: 'https://static.fczx.com/www/assets/mini/user_photo.png',
  username: ''
}
const JOIN_PHONE = '18671072505'

const User = () => {

  const { is_show_esf } = storage.getItem('navSetting')
  const [user, setUser] = useState<any>(INIT_USER)

  useDidShow(() => {
    hasLogin().then((result: any) => {
      if (result) {
        setUser(result)
        CustomSocket.onChatUnread()
      } else {
        setUser(INIT_USER)
      }
    })
  })

  const toUserModule = (module: string) => {
    if (user.username) {
      taroNavigateTo(`/user/${module}/index${toUrlParam(user)}`)
      return
    }
    app.toLogin('', '', 'navigateTo')
  }

  const handleLogout = () => {
    setUser(INIT_USER)
    eventCenter.trigger('logout')
  }

  const toHouseModule = (url: string, type: string = 'esf') => {
    if (user.username) {
      taroNavigateTo(`/user/house/${url}/index?type=${type}`)
    } else {
      app.toLogin('', '', 'navigateTo')
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
      <NavBar title="个人中心" primary={true} showIcon={false} />
      <View className="user-content">
        <View className="user-header">
          <View className="header-bg"></View>
          <View className="user-item user-login" onClick={() => toUserModule('profile')}>
            <View className="login-photo">
              <Image className="taro-image" src={user.avatar} />
            </View>
            {
              user.username ?
                <View className="login-text">
                  <View className="login-name">{user.nickname || user.username}</View>
                  {/* <View className="user-type">
                    <Text className="iconfont"></Text>
                    <Text></Text>
                  </View> */}
                </View> :
                <View className="login-text">
                  <Text className="login-name">登录/注册</Text>
                </View>
            }
            <View className="login-nav">
              <Text className="iconfont iconarrow-right-bold"></Text>
            </View>
          </View>
        </View>

        <View className="user-group">
          {
            user.is_consultant == 1 &&
            <View>
              <View className="user-item" onClick={() => toUserModule('consultant')}>
                <View className="item-icon origin">
                  <Text className="iconfont iconwechat"></Text>
                </View>
                <View className="item-text">置业顾问</View>
                <View className="item-arrow">
                  <Text className="iconfont iconarrow-right-bold"></Text>
                </View>
              </View>
              <View className="user-item" onClick={() => toUserModule('dynamic')}>
                <View className="item-icon cyan">
                  <Text className="iconfont icondynamic"></Text>
                </View>
                <View className="item-text">楼盘动态</View>
                <View className="item-arrow">
                  <Text className="iconfont iconarrow-right-bold"></Text>
                </View>
              </View>
            </View>
          }
          {/* <View className="user-item" onClick={() => toUserModule('member')}>
            <View className="item-icon blue2">
              <Text className="iconfont iconmember"></Text>
            </View>
            <View className="item-text">会员升级</View>
            <View className="item-arrow">
              <Text className="iconfont iconarrow-right-bold"></Text>
            </View>
          </View> */}
          <View className="user-item" onClick={() => toUserModule('collect')}>
            <View className="item-icon lightblue">
              <Text className="iconfont iconstar"></Text>
            </View>
            <View className="item-text">我的收藏</View>
            <View className="item-arrow">
              <Text className="iconfont iconarrow-right-bold"></Text>
            </View>
          </View>
        </View>

        {
          is_show_esf == 1 &&
          <View className="user-group">
            <View className="user-item">
              <View className="item-icon origin">
                <Text className="iconfont iconhousemanage"></Text>
              </View>
              <View className="item-text">管理房源</View>
            </View>
            <View className="user-row">
              <View className="row-item" onClick={() => toHouseModule('list')}>
                <View className="iconfont iconmanage"></View>
                <View className="text">我的出售</View>
              </View>
              <View className="row-item" onClick={() => toHouseModule('list', 'rent')}>
                <View className="iconfont iconhome"></View>
                <View className="text">我的出租</View>
              </View>
              <View className="row-item" onClick={() => toHouseModule('sale')}>
                <View className="iconfont iconsquare"></View>
                <View className="text">发布出售</View>
              </View>
              <View className="row-item" onClick={() => toHouseModule('sale', 'rent')}>
                <View className="iconfont iconhomepage"></View>
                <View className="text">发布出租</View>
              </View>
            </View>
          </View>
        }
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
        </View>
        {
          user.username &&
          <View className="user-logout" onClick={handleLogout}>
            <Text>退出登录</Text>
          </View>
        }
      </View>
    </View>
  )
}

export default User
