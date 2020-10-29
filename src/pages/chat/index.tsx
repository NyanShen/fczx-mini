import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Image } from '@tarojs/components'
import NavBar from '@components/navbar/index'
import './index.scss'

export default class Chat extends Component {

  toChatRoom = (item: any) => {
    Taro.navigateTo({
      url: `/pages/chat/room/index?id=${item.id}`
    })
  }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className="chat">
        <NavBar title="会话列表" home={true} />
        <View className="chat-content">
          <ScrollView scrollY>
            <View className="chat-item" onClick={() => this.toChatRoom({})}>
              <View className="item-photo">
                <Image src="" mode="aspectFill"></Image>
              </View>
              <View className="item-text">
                <View className="item-text-item">
                  <View className="name">花旗参</View>
                  <View className="date">10-29</View>
                </View>
                <View className="item-text-item">
                  <View className="record">想看房子的话联系我哦,想看房子的话联系我哦电话：12312333333</View>
                </View>
              </View>
            </View>
            <View className="chat-item">
              <View className="item-photo">
                <Image src="" mode="aspectFill"></Image>
              </View>
              <View className="item-text">
                <View className="item-text-item">
                  <View className="name">花旗参</View>
                  <View className="date">10-29</View>
                </View>
                <View className="item-text-item">
                  <View className="record">想看房子的话联系我哦，电话：12312333333</View>
                  <View className="iconfont iconnotice"></View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
