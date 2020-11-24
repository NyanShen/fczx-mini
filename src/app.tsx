import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import ChatEvent from '@utils/event'
import './app.scss'
import { hasLogin } from '@services/login'


class App extends Component {

  componentDidMount() {
    ChatEvent.on('chat', (resutl: any[]) => {
      if (resutl) {
        Taro.showTabBarRedDot({ index: 1 })
      } else {
        Taro.hideTabBarRedDot({ index: 1 })
      }
    })
    hasLogin().then((res: any) => {
      if (res) {
        ChatEvent.emit('chat')
      }
    })
  }

  render() {
    return (
      <View>
        {this.props.children}
      </View>
    )
  }
}

export default App
