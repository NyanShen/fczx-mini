import React from 'react'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@components/search/index'

const EsfSearch = () => {

  const searchOption: ISearchOption[] = [
    {
      type: "esf",
      name: "二手房",
      searchUrl: api.getEsfList
    }
  ]

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索二手房"
        searchOption={searchOption}
        searchRemark="请输入小区或地址"
      ></Search>
    </View>
  )
}

export default EsfSearch

