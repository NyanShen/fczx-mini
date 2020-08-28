import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import NavBar from '@components/navbar/index'
import './index.scss'

export default class User extends Component {

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <View className="user">
        <NavBar title="个人中心" home={true} />
        <Text>test user!</Text>
      </View>
    )
  }
}
