import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, RichText, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import NavBar from '../../components/navbar/index'
import './index.scss'

const INIT_NODES: any = [
  {
    name: 'ul',
    attrs: {
      class: 'nodes_ul'
    },
    children: [
      {
        name: 'li',
        attrs: {
          class: 'nodes_li'
        },
        children: [
          {
            name: 'p',
            attrs: {
              class: 'name'
            },
            children: [{
              type: 'text',
              text: '1襄阳吾悦广场',
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'address'
            },
            children: [
              {
                type: 'text',
                text: '1地址襄阳吾悦广场',
              }
            ]
          }
        ]
      },
      {
        name: 'li',
        attrs: {
          class: 'nodes_li'
        },
        children: [
          {
            name: 'p',
            attrs: {
              class: 'name'
            },
            children: [{
              type: 'text',
              text: '2襄阳吾悦广场',
            }]
          },
          {
            name: 'p',
            attrs: {
              class: 'address'
            },
            children: [
              {
                type: 'text',
                text: '2地址襄阳吾悦广场',
              }
            ]
          }
        ]
      }
    ]
  }
]

const INIT_HOT_LIST = ["樊城", "沃尔玛", "襄阳吾悦广场", "襄阳万达广场", "火车站"]
const INIT_SEARCH_HISTORIES = ["初始化", "襄阳吾悦广场"]

const Search = () => {
  const [clear, setClear] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [matcheList, setMatcheList] = useState(INIT_NODES)
  const [hotList, setHotList] = useState(INIT_HOT_LIST)
  const [searchHistories, setSearchHistories] = useState(INIT_SEARCH_HISTORIES)

  useEffect(() => {
    // Taro.request({
    //   url: 'http://xiangyang.fczx.com/house/list',
    //   data: {},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })
  }, [])

  const handleInput = (event) => {
    if (event.currentTarget.value) {
      setClear(true)
    } else {
      setClear(false)
    }
    setSearchValue(event.currentTarget.value)
  }

  const clearSearchValue = () => {
    setClear(false)
    setSearchValue("")
  }

  const renderSearchKeys = (title, className, keyList, allowClear = false) => {
    if (keyList && keyList.length > 0) {
      return (
        <View className={classnames("search-record", className)}>
          <View className="search-header clearfix">
            <Text className="title">{title}</Text>
            {allowClear && <Text className="iconfont iconclear1"></Text>}
          </View>
          <View className="search-list clearfix">
            {keyList.map((item, index) => {
              return <Text className="item" key={index}>{item}</Text>
            })}
          </View>
        </View>
      )
    }
  }

  return (
    <View className="search">
      <NavBar title="搜索" back={true} />
      <ScrollView>
        <View className="search-container clearfix">
          <View className="search-content">
            <View className="search-label">
              <Text className="search-label-text">新房</Text>
              <Text className="iconfont iconarrow-down-filling"></Text>
            </View>
            <Input className="search-input" placeholder="请输入楼盘名称或地址" onInput={handleInput} value={searchValue} autoFocus></Input>
            {clear && <Text className="iconfont iconclear" onClick={clearSearchValue}></Text>}
          </View>
          <Text className="search-cancel">取消</Text>
        </View>
        {
          searchValue ?
            <RichText className="search-matches" nodes={matcheList} /> :
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

