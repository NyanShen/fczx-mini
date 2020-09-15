import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search from '@components/search'
import './index.scss'

const HouseSearch = () => {

  const searchOption = [{ type: "newhouse", name: "新房" }]

  const handleItemClick = (item) => {
    Taro.navigateTo({
      url: `/pages/house/index?id=${item.id}&name=${item.name}`
    })
  }

  return (
    <View className="house-search">
      <Search
        isMultiply={true}
        searchTitle="搜索"
        searchOption={searchOption}
        onItemClick={handleItemClick}
        searchRemark="请输入楼盘名称或地址"
        searchUrl={api.getSearchKeyList}
      ></Search>
    </View>
  )
}

export default HouseSearch

