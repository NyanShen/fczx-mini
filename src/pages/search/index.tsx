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
    </View>
  )
}

export default Search;

