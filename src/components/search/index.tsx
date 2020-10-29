import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import map from 'lodash/map'
import includes from 'lodash/includes'
import { View, Text, Input, RichText, ScrollView } from '@tarojs/components'

import app from '@services/request'
import { keywordcolorful } from '@utils/index'
import storage from '@utils/storage'
import useNavData from '@hooks/useNavData'
import NavBar from '@components/navbar/index'
import './index.scss'

export interface ISearchOption {
  type: string
  name: string
}

interface ISearchProps {
  searchTitle: string
  searchOption: any[]
  searchRemark?: string
  searchUrl: string
  hotListUrl?: string
}

const Search = (props: ISearchProps) => {
  const isMultiply = props.searchOption.length > 1
  const INIT_OPTION = props.searchOption[0]
  const INIT_HISTORIES = storage.getItem('histories', `search_${INIT_OPTION.name}`) || []
  const { contentHeight } = useNavData()
  const [hotList, setHotList] = useState([])
  const [matcheList, setMatcheList] = useState([])
  const [searchValue, setSearchValue] = useState("")
  const [searchHistories, setSearchHistories] = useState(INIT_HISTORIES)
  const [option, setOption] = useState<ISearchOption>(INIT_OPTION)
  const [showOption, setShowOption] = useState<boolean>(false)

  useEffect(() => {
    app.request({
      url: app.areaApiUrl(props.hotListUrl)
    }, { loading: false }).then((result: any) => {
      setHotList(result || [])
    })
  }, [])

  const navData = {
    title: props.searchTitle,
    back: true,
    color: '#000000',
    backgroundColor: '#ffffff'
  }

  Taro.setNavigationBarColor({
    frontColor: navData.color,
    backgroundColor: navData.backgroundColor
  })

  const handleItemClick = (item: any) => {
    let ids = map(searchHistories, 'id')
    if (!includes(ids, item.id)) {
      searchHistories.push(item)
    }
    storage.setItem('histories', searchHistories, `search_${option.name}`)
    Taro.navigateTo({
      url: `/house/${option.type}/index/index?id=${item.id}&title=${item.title}`
    })
  }

  const handleInput = (event) => {
    console.log('handleInput')
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
      storage.setItem('histories', searchHistories, `search_${option.name}`)
      Taro.redirectTo({
        url: `/house/${option.type}/list/index?title=${searchValue}`
      })
    }
  }

  const updateKeyList = (keyValue) => {
    app.request({
      url: app.areaApiUrl(props.searchUrl),
      data: {
        title: keyValue,
        page: 0,
        limit: 50
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

  const handleClearClick = () => {
    storage.clear(`search_${option.name}`)
    setSearchHistories([])
  }

  const handleSwitchOption = (item: ISearchOption) => {
    setShowOption(false)
    if (item.type === option.type) {
      return
    }
    setOption(item)
    setSearchHistories(storage.getItem('histories', `search_${item.name}`) || [])
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
              return <Text
                key={item.id}
                className="item"
                onClick={() => handleItemClick(item)}
              >{item.title}
              </Text>
            })}
          </View>
        </View>
      )
    }
  }

  const renderSearOption = () => {
    return props.searchOption.map((item: ISearchOption, index: number) => (
      <View
        key={index}
        className={classnames('options-item', option.type === item.type && 'actived')}
        onClick={() => handleSwitchOption(item)}
      >{item.name}
      </View>
    ))
  }

  return (
    <View className="search">
      <NavBar {...navData} />
      <View className="search-wrapper clearfix">
        <View className="search-content">
          <View className="search-label" onClick={() => setShowOption(!showOption)}>
            <Text className="search-label-text">{option.name}</Text>
            <Text className={classnames('iconfont', isMultiply ? 'iconarrow-down-bold' : 'iconsearch')}></Text>
          </View>
          <Input
            className="search-input"
            placeholder={props.searchRemark}
            onInput={handleInput}
            onConfirm={handleConfirm}
            value={searchValue}
            confirmType="search"
            autoFocus
          ></Input>
          {searchValue && <Text className="iconfont iconclear" onClick={clearSearchValue}></Text>}
          {showOption &&
            <View className="search-options">
              <View className="triangle-up">
                <Text className="cover"></Text>
              </View>
              {renderSearOption()}
            </View>
          }
        </View>
        <Text className="search-cancel" onClick={handleCancel}>取消</Text>
      </View>
      <ScrollView scrollY style={{ maxHeight: contentHeight - 50 }}>
        {searchValue ?
          <View className="search-matches">
            <View className="match-header" onClick={handleConfirm}>
              <View>搜索“{searchValue}”</View>
              <View className="iconfont iconarrow-right-bold"></View>
            </View>
            {
              matcheList.map((item: any, index: number) => {
                return (
                  <View className="match-item" key={index} onClick={() => handleItemClick(item)}>
                    <RichText nodes={keywordcolorful(item.title, searchValue)} />
                    <View className="address">{item.address}</View>
                  </View>
                )
              })
            }
          </View> :
          <View className="search-category">
            {renderSearchKeys('搜索历史', 'search-history', searchHistories, true)}
            {renderSearchKeys('热门搜索', 'search-hot', hotList)}
          </View>
        }
      </ScrollView>
    </View>
  )
}

export default Search

