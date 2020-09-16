import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search from '@components/search'

const NewHouseSearch = () => {

  const searchOption = [{ type: "newhouse", name: "新房" }]

  const handleItemClick = (item) => {
    Taro.navigateTo({
      url: `/pages/newhouse/index?id=${item.id}&name=${item.name}`
    })
  }

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索新房"
        searchOption={searchOption}
        onItemClick={handleItemClick}
        searchRemark="请输入楼盘名称或地址"
        searchUrl={api.getSearchKeyList}
      ></Search>
    </View>
  )
}

export default NewHouseSearch

