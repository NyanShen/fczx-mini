import React from 'react'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@components/search/index'

const RentSearch = () => {

  const searchOption: ISearchOption[] = [{ type: "rent", name: "租房", searchUrl: api.getRentList }]

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索租房"
        searchOption={searchOption}
        searchRemark="请输入小区名称或地址"
      ></Search>
    </View>
  )
}

export default RentSearch

