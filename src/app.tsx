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

    ChatEvent.emit('chat')

    ChatEvent.on('chat', (result: string) => {
      this.handleTabBarRedDot(result)
    })

    ChatEvent.on('chat_status', (result: any) => {
      this.handleTabBarRedDot(result.status)
    })

  }

  handleTabBarRedDot = (result: boolean | string) => {
    const pathname: any = getCurrentInstance().router?.path
    if (this.tabbarList.includes(pathname)) {
      if (result) {
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
