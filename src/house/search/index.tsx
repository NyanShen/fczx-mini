import React from 'react'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@components/search/index'
import './index.scss'

const HouseSearch = () => {

  const searchOption: ISearchOption[] = [
    { type: "new", name: "新房", searchUrl: api.getHouseList},
    { type: "esf", name: "二手房", searchUrl: api.getEsfList }
  ]

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索"
        searchOption={searchOption}
        searchRemark="请输入楼盘名称或地址"
        hotListUrl={api.getHouseSearchHot}
      ></Search>
    </View>
  )
}

export default HouseSearch

