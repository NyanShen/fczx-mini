import React from 'react'
import { View } from '@tarojs/components'

import api from '@services/api'
import storage from '@/utils/storage'
import Search, { ISearchOption } from '@components/search/index'
import './index.scss'

const HouseSearch = () => {
  let searchOption: ISearchOption[] = []
  const { is_show_house, is_show_esf } = storage.getItem('navSetting')

  if (is_show_house == 1) {
    searchOption.push({ type: "new", name: "新房", searchUrl: api.getHouseList })
  }
  if (is_show_esf == 1) {
    searchOption.push({ type: "esf", name: "二手房", searchUrl: api.getEsfList })
  }

  return (
    <View className="house-search">
      {
        searchOption.length > 0 ?
          <Search
            searchTitle="搜索"
            searchOption={searchOption}
            searchRemark="请输入楼盘名称或地址"
            hotListUrl={api.getHouseSearchHot}
          ></Search> :
          <View className="empty-container">
            暂无权限操作
          </View>
      }

    </View>
  )
}

export default HouseSearch

