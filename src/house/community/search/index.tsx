import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@components/search/index'

const CommunitySearch = () => {

  const searchOption: ISearchOption[] = [{ type: "community", name: "小区" }]

  const handleItemClick = (item: any) => {
    Taro.navigateTo({
      url: `/house/community/index/index?id=${item.id}&name=${item.name}`
    })
  }

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索小区"
        searchOption={searchOption}
        onItemClick={handleItemClick}
        searchRemark="请输入小区或地址"
        hotListUrl={api.getHouseSearchHot}
        searchUrl={api.getHouseList}
      ></Search>
    </View>
  )
}

export default CommunitySearch

