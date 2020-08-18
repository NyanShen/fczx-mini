import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import NavBar from '../../components/navbar/index'
import './index.scss'

export default class Chat extends Component {

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className="chat">
        <NavBar title="微聊" home={true}/>
        <Text>test chat!</Text>
      </View>
    )
  }
}
