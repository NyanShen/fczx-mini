import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import ChatEvent from '@utils/event'
import './app.scss'


class App extends Component {

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

  render() {
    return (
      <View>
        {this.props.children}
      </View>
    )
  }
}

export default App
