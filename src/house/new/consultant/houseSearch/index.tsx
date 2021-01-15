import React, { useState } from 'react'
import Taro, { getCurrentPages } from '@tarojs/taro'
import { View, Text, Input, RichText, ScrollView } from '@tarojs/components'

import app from '@services/request'
import { keywordcolorful } from '@utils/index'
import useNavData from '@hooks/useNavData'
import './index.scss'

export interface ISearchOption {
  type: string
  name: string
  searchUrl?: string
}

const SearchHouse = () => {
  const { contentHeight } = useNavData()
  const [matcheList, setMatcheList] = useState([])
  const [searchValue, setSearchValue] = useState("")

  const handleItemClick = (item: any) => {
    const pages: any = getCurrentPages()
    const prevPage: any = pages[pages.length - 2]
    prevPage.setData({ id: item.id, title: item.title })
    Taro.navigateBack({ delta: 1 })
  }

  const handleInput = (event) => {
    let keyValue = event.currentTarget.value
    if (keyValue) {
      updateKeyList(keyValue)
    } else {
      setMatcheList([])
    }
    setSearchValue(keyValue)
  }

  const handleConfirm = () => {
    if (searchValue) {
      Taro.redirectTo({
        url: `/house/new/consultant/index?title=${searchValue}`
      })
    }
  }

  const updateKeyList = (keyValue: string, searchUrl: string = '/house/list') => {
    if (!keyValue || !searchUrl) {
      return
    }
    app.request({
      url: app.areaApiUrl(searchUrl),
      data: {
        title: keyValue,
        page: 1,
        limit: 10
      }
    }, { loading: false }).then((result: any) => {
      setMatcheList(result.data)
    })
  }

  const clearSearchValue = () => {
    setSearchValue("")
  }

  const handleCancel = () => {
    Taro.navigateBack()
  }

  return (
    <View className="search">
      <View className="search-wrapper clearfix">
        <View className="search-content">
          <View className="search-label">
            <Text className="search-label-text"></Text>
            <Text className="iconfont iconsearch"></Text>
          </View>
          <Input
            className="search-input"
            placeholder="请搜索楼盘关键词"
            onInput={handleInput}
            onConfirm={handleConfirm}
            value={searchValue}
            confirmType="search"
            autoFocus
          ></Input>
          {searchValue && <Text className="iconfont iconclear" onClick={clearSearchValue}></Text>}
        </View>
        <Text className="search-cancel" onClick={handleCancel}>取消</Text>
      </View>
      <ScrollView scrollY style={{ maxHeight: contentHeight - 50 }}>
        <View className="search-matches">
          {
            matcheList.map((item: any, index: number) => {
              return (
                <View className="match-item" key={index} onClick={() => handleItemClick(item)}>
                  <RichText nodes={keywordcolorful(item.title, searchValue)} />
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default SearchHouse

