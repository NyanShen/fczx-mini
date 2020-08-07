import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class User extends Component {

  componentDidShow () { 
  }

  componentDidHide () { }

  render () {
    return (
      <View className='user'>
        <Text>test user!</Text>
      </View>
    )
  }
}
