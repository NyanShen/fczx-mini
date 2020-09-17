import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@components/search'
import './index.scss'

const HouseSearch = () => {

  const searchOption: ISearchOption[] = [
    { type: "newhouse", name: "新房" },
    { type: "esf", name: "二手房" }
  ]

  const handleItemClick = (item: any, option: ISearchOption) => {
    Taro.navigateTo({
      url: `/pages/${option.type}/index/index?id=${item.id}&name=${item.name}`
    })
  }

  return (
    <View className="house-search">
      <Search
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

