import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
export default class Search extends Component {

  componentDidShow() {
  }

  componentDidHide() { }
  // const { width, height, left, top, right } = wx.getMenuButtonBoundingClientRect()
  // setNavSize () {
  //   let sysinfo = Taro.getSystemInfoSync()
  //   let statusHeight = sysinfo.statusBarHeight
  //   let isiOS = sysinfo.system.indexOf('iOS') > -1
  //   let navHeight
  //   if (isiOS) {
  //     navHeight = 44;
  //   } else {
  //     navHeight = 48;
  //   }
  //   this.setState({
  //     status: statusHeight,
  //     navHeight: navHeight
  //   })
  // }

  render() {
    const style = {
      marginTop: Taro['$navBarMarginTop'] + 'px',
      height: '44px',
      lineHeight: '44px'
    }
    return (
      <View className='search' style={style}>
        <Text>自定义导航栏测试search box!</Text>
      </View>
    )
  }
}
