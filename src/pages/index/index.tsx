import React, { Component } from 'react'
import { View, Text, Input } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {

  componentDidShow() {
  }

  componentDidHide() { }


  render() {
    return (
      <View className='index'>
        <View className="index-search">
          <View className="index-search-content clearfix">
            <Text className="iconfont">&#xe616;</Text>
            <Input className="index-search-content-input" type="text" placeholder="输入区县、小区名"></Input>
            <Text className="index-search-content-text">区域</Text>
          </View>
        </View>
      </View>
    )
  }
}
