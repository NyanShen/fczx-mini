import React, { Component } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View } from '@tarojs/components'

import ChatEvent from '@utils/event'
import './app.scss'


class App extends Component {
  tabbarList = [
    '/pages/index/index',
    '/pages/user/index',
    '/pages/chat/index',
    '/pages/entry/index',
  ]

  componentDidMount() {

    ChatEvent.on('chat', (result: any[]) => {
      this.handleTabBarRedDot(result)
    })

    ChatEvent.on('chat_unread', (result: any[]) => {
      this.handleTabBarRedDot(result)
    })

    ChatEvent.emit('chat')
  }

  componentDidUpdate() {
    ChatEvent.on('chat', (result: any[]) => {
      this.handleTabBarRedDot(result)
    })
  }

  handleTabBarRedDot = (result: any[]) => {
    const pathname: any = getCurrentInstance().router?.path
    if (this.tabbarList.includes(pathname)) {
      if (result.length > 0) {
        Taro.showTabBarRedDot({
          index: 1,
          success() { },
          fail() { },
        })
      } else {
        Taro.hideTabBarRedDot({
          index: 1,
          success() { },
          fail() { },
        })
      }
    }
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
