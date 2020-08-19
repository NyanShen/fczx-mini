import React, { useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import NavBar from '../../components/navbar/index'
import './index.scss'

const Search = () => {
  const [clear, setClear] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleInput = (event) => {
    if (event.currentTarget.value) {
      setClear(true);
    } else {
      setClear(false);
    }
    setSearchValue(event.currentTarget.value);
  }

  const clearSearchValue = () => {
    setClear(false);
    setSearchValue("");
  }
  const handleSearchItemClick = (event) => {
    console.log(event)
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
        <Text className="search-cancel">取消</Text>
      </View>
      <View className="search-record search-history">
        <View className="search-header clearfix">
          <Text className="title">历史搜索</Text>
          <Text className="iconfont iconclear1"></Text>
        </View>
        <View className="search-list clearfix" onClick={handleSearchItemClick}>
          <Text className="item">吾悦广场</Text>
          <Text className="item">水运楼</Text>
        </View>
      </View>
      <View className="search-record search-hot">
        <View className="search-header clearfix">
          <Text className="title">热门搜索</Text>
        </View>
        <View className="search-list clearfix">
          <Text className="item">吾悦广场</Text>
          <Text className="item">广场</Text>
          <Text className="item">万达广场</Text>
          <Text className="item">万达场</Text>
          <Text className="item">万达广</Text>
          <Text className="item">万广场</Text>
        </View>
      </View>
    </View>
  )
}

export default Search;

