import React from 'react'
import { View } from '@tarojs/components'

import api from '@services/api'
import Search, { ISearchOption } from '@components/search/index'

const NewHouseSearch = () => {

  const searchOption: ISearchOption[] = [{ type: "new", name: "新房" }]

  return (
    <View className="house-search">
      <Search
        searchTitle="搜索新房"
        searchOption={searchOption}
        searchRemark="请输入楼盘名称或地址"
        hotListUrl={api.getHouseSearchHot}
        searchUrl={api.getHouseList}
      ></Search>
    </View>
  )
}

export default NewHouseSearch

