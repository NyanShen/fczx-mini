import React, { Component } from 'react'
import Taro, { getCurrentInstance, eventCenter } from '@tarojs/taro'
import { View } from '@tarojs/components'

import storage from '@utils/storage'
import CustomSocket from '@utils/socket'
import './app.scss'

class App extends Component {
  tabbarList = [
    '/pages/index/index',
    '/pages/user/index',
    '/pages/chat/index',
    '/pages/discover/index',
  ]

  componentDidMount() {
    CustomSocket.onSocketMessage((_, result: any[]) => {
      this.handleTabBarRedDot(result)
    })

    eventCenter.on('chat_unread', (result: any[]) => {
      console.log('on chat_unread', result)
      this.handleTabBarRedDot(result)
    })

    eventCenter.on('logout', () => {
      storage.clear('token')
      storage.clear('login_user')
      CustomSocket.closeSocket()
      this.handleTabBarRedDot([])
    })
  }

  componentWillUnmount() {
    eventCenter.off()
    console.log('app componentWillUnmount bye bye')
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
