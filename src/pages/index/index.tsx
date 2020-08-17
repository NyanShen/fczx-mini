import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  componentDidShow() {
  }

  componentDidHide() { }

  clickHandler() {
    Taro.redirectTo({
      url: '/pages/search/index'
    })
  }

  render() {
    return (
      <View className="index">
        <View className="index-search">
          <View className="index-search-content clearfix">
            <Text className="iconfont">&#xe616;</Text>
            <Text className="index-search-content-desc" onClick={this.clickHandler.bind(this)}>输入区县、小区名</Text>
            <Text className="index-search-content-text">区域</Text>
          </View>
        </View>
      </View>
    )
  }
}
