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

  tabCallback(name) {
    console.log(name)
  }

  render () {
    return (
      <View className='index'>
        <Text>test Hello world!</Text>
        <Tabbar callback={this.tabCallback.bind(this)}></Tabbar>
      </View>
    )
  }
}
