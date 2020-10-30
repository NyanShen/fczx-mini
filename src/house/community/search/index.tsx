import React from 'react'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@components/search/index'

const CommunitySearch = () => {

  const searchOption: ISearchOption[] = [
    { type: "community", name: "小区", searchUrl: api.getCommunityList }
  ]

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索小区"
        searchOption={searchOption}
        searchRemark="请输入小区或地址"
        hotListUrl={api.getHouseSearchHot}
      ></Search>
    </View>
  )
}

export default CommunitySearch

