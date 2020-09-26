import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@house/components/search'

const NewHouseSearch = () => {

  const searchOption: ISearchOption[] = [{ type: "newhouse", name: "新房" }]

  const handleItemClick = (item: any) => {
    Taro.navigateTo({
      url: `/house/pages/new/index/index?id=${item.id}&name=${item.name}`
    })
  }

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索新房"
        searchOption={searchOption}
        onItemClick={handleItemClick}
        searchRemark="请输入楼盘名称或地址"
        hotListUrl={api.getHouseSearchHot}
        searchUrl={api.getHouseList}
      ></Search>
    </View>
  )
}

export default NewHouseSearch

