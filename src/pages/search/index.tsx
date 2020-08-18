import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import NavBar from '../../components/navbar/index'
import './index.scss'

const Search = () => {
  
  return (
    <View className='search'>
      <NavBar title="搜索" back={true}/>
      <Text>search test!</Text>
    </View>
  )
}

export default Search;

