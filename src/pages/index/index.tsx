import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import Tabbar from '../../components/tabbar'
import './index.scss'

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text className="iconfont">&#xe682;test Hello world!</Text>
        <Tabbar></Tabbar>
      </View>
    )
  }
}
