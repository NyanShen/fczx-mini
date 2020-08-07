import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Chat extends Component {

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='chat'>
        <Text>test chat!</Text>
      </View>
    )
  }
}
