import React, { useState } from 'react'
import Taro, { getCurrentPages } from '@tarojs/taro'
import { View, ScrollView, Text, Input, RichText } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { keywordcolorful } from '@utils/index'
import '@components/search/index.scss'
import './index.scss'

const SaleCommunitySearch = () => {
    const { contentHeight } = useNavData()
    const [matcheList, setMatcheList] = useState([])
    const [searchValue, setSearchValue] = useState("")


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
                url: `/house/esf/sale/index`
            })
        }
    }

    const handleItemClick = (item: any) => {
        const pages: any = getCurrentPages()
        const prevPage: any = pages[pages.length - 2]
        prevPage.setData({
            community: {
                id: item.id,
                title: item.title,
                fang_area_id: item.fang_area_id,
                address: item.address
            }
        })
        Taro.navigateBack({ delta: 1 })
    }

    const updateKeyList = (keyValue: string) => {
        if (!keyValue) {
            return
        }
        app.request({
            url: app.areaApiUrl(api.searchCommunity),
            data: {
                title: keyValue
            }
        }, { loading: false }).then((result: any) => {
            setMatcheList(result)
        })
    }

    const handleCancel = () => {
        Taro.navigateBack({ delta: 1 })
    }

    return (
        <View className="search search-community">
            <View className="search-wrapper clearfix">
                <View className="search-content">
                    <View className="search-icon">
                        <Text className="iconfont iconsearch"></Text>
                    </View>
                    <Input
                        className="search-input"
                        placeholder="请输入小区名称"
                        onInput={handleInput}
                        onConfirm={handleConfirm}
                        value={searchValue}
                        confirmType="search"
                        autoFocus
                    ></Input>
                    {searchValue && <Text className="iconfont iconclear" onClick={() => setSearchValue("")}></Text>}
                </View>
                <Text className="search-cancel" onClick={handleCancel}>取消</Text>
            </View>
            <ScrollView scrollY style={{ maxHeight: `${contentHeight - 50}px` }}>
                {searchValue ?
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
                    </View> :
                    <View className="search-memo">
                        <Text>输入小区名称进行匹配，若没有匹配的小区，建议输入"其他小区"</Text>
                    </View>
                }
            </ScrollView>
        </View>
    )
}

export default SaleCommunitySearch