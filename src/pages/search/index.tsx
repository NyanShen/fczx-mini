import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import {map, includes} from 'lodash'
import { View, Text, Input, RichText, ScrollView } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import { keywordcolorful } from '@utils/index'
import storage from '@utils/storage'
import useNavData from '@hooks/useNavData'
import NavBar from '@components/navbar/index'
import './index.scss'

const INIT_HISTORIES = storage.getItem('histories', 'search') || []

const Search = () => {
  const { contentHeight } = useNavData()
  const [clear, setClear] = useState(false)
  const [hotList, setHotList] = useState([])
  const [matcheList, setMatcheList] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [searchHistories, setSearchHistories] = useState(INIT_HISTORIES)

  useEffect(() => {
    app.request({ url: api.getSearchHotList }, { isMock: true, loading: false })
      .then((result: any) => {
        setHotList(result || [])
      })
  }, [])

  const handleKeyClick = (item) => {
    let ids = map(searchHistories, 'id');
    if (ids.length === 0) {
      searchHistories.push(item)
    } else if (!includes(ids, item.id)) {
      searchHistories.push(item)
    }
    storage.setItem('histories', searchHistories, 'search');
    Taro.navigateTo({
      url: `/pages/house/index?id=${item.id}&name=${item.name}`
    })
  }

  const handleInput = (event) => {
    let keyValue = event.currentTarget.value
    if (keyValue) {
      setClear(true)
    } else {
      setClear(false)
    }
    setSearchValue(keyValue)
    updateKeyList(keyValue)
  }

  const updateKeyList = (keyValue) => {
    app.request({
      url: api.getSearchKeyList,
      data: { kw: keyValue }
    }, { isMock: true, loading: false })
      .then((result: any) => {
        setMatcheList(result || [])
      })
  }

  const clearSearchValue = () => {
    setClear(false)
    setSearchValue("")
  }

  const handleCancel = () => {
    Taro.navigateBack()
  }

  const handleClearClick = () => {
    storage.clear('search')
    setSearchHistories([])
  }

  const renderSearchKeys = (title, className, keyList, allowClear = false) => {
    if (keyList && keyList.length > 0) {
      return (
        <View className={classnames("search-record", className)}>
          <View className="search-header clearfix">
            <Text className="title">{title}</Text>
            {allowClear && <Text className="iconfont iconclear1" onClick={handleClearClick}></Text>}
          </View>
          <View className="search-list clearfix">
            {keyList.map((item: any) => {
              return <Text className="item" key={item.id} onClick={() => handleKeyClick(item)}>{item.name}</Text>
            })}
          </View>
        </View>
      )
    }
  }

  return (
    <View className="search">
      <NavBar title="搜索" back={true} />
      <View className="search-container clearfix">
        <View className="search-content">
          <View className="search-label">
            <Text className="search-label-text">新房</Text>
            <Text className="iconfont iconarrow-down-filling"></Text>
          </View>
          <Input className="search-input" placeholder="请输入楼盘名称或地址" onInput={handleInput} value={searchValue} autoFocus></Input>
          {clear && <Text className="iconfont iconclear" onClick={clearSearchValue}></Text>}
        </View>
        <Text className="search-cancel" onClick={handleCancel}>取消</Text>
      </View>
      <ScrollView style={{ height: `${contentHeight - 50}px` }} scrollY>
        {searchValue ?
          <View className="search-matches">
            {
              matcheList.map((item: any, index: number) => {
                return (
                  <View className="match-item" key={index} onClick={() => handleKeyClick(item)}>
                    <RichText nodes={keywordcolorful(item.name, searchValue)} />
                    <View className="address">{item.address}</View>
                  </View>
                )
              })
            }
          </View> :
          <View>
            {renderSearchKeys('搜索历史', 'search-history', searchHistories, true)}
            {renderSearchKeys('热门搜索', 'search-hot', hotList)}
          </View>
        }
      </ScrollView>
    </View>
  )
}

export default Search

