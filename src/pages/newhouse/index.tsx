import React, { useState } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import classnames from 'classnames'

import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import '@styles/common/house-list.scss'
import '@styles/common/search-tab.scss'
import './index.scss'

const NewHouse = () => {
    const { appHeaderHeight, contentHeight } = useNavData()
    const scrollHeight = contentHeight * 0.5 - 60
    const scrollMoreHeight = contentHeight * 0.6 - 60
    const [tab, setTab] = useState<string>('')
    const tabs = [
        {
            filter: 'region',
            name: '区域'
        },
        {
            filter: 'price',
            name: '价格'
        },
        {
            filter: 'house_type',
            name: '户型'
        },
        {
            filter: 'more',
            name: '更多'
        }]
    const conditions = [
        {

        }
    ]
    const switchCondition = (item) => {
        if (tab === item.filter) {
            setTab('')
            return
        }
        setTab(item.filter)
    }
    return (
        <View className="newhouse">
            <NavBar title="新房" back={true} />
            <View className="fixed-top" style={{ top: appHeaderHeight }}>
                <View className="newhouse-header view-content">
                    <View className="newhouse-search">
                        <Text className="iconfont iconsearch"></Text>
                        <Text className="newhouse-search-text placeholder">请输入楼盘名称或地址</Text>
                    </View>
                    <View className="newhouse-nav-right">
                        <Text className="iconfont iconmap"></Text>
                        <Text className="text">地图找房</Text>
                    </View>
                </View>
                <View className="search-tab">
                    {
                        tabs.map((item: any, index: number) => (
                            <View className="search-tab-item" key={index} onClick={() => switchCondition(item)}>
                                <Text className="text">{item.name}</Text>
                                <Text className="iconfont iconarrow-down-bold"></Text>
                            </View>
                        ))
                    }
                </View>
                <View className={classnames('search-container', tab === 'region' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            <View className="split-type flex-item">
                                <View className="split-item actived">区域</View>
                            </View>
                            <ScrollView className="split-list flex-item" scrollY style={{ height: scrollHeight }}>
                                <View className="split-item actived">不限</View>
                                <View className="split-item">樊城</View>
                                <View className="split-item">襄城</View>
                                <View className="split-item">襄州</View>
                                <View className="split-item">谷城</View>
                            </ScrollView>
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', tab === 'price' && 'actived')}>
                    <View className="search-content search-content-scroll">
                        <View className="search-split">
                            <View className="split-type flex-item">
                                <View className="split-item actived">按单价</View>
                                <View className="split-item">按总价</View>
                            </View>
                            <ScrollView className="split-list flex-item" scrollY style={{ height: scrollHeight }}>
                                <View className="split-item actived">不限</View>
                                <View className="split-item">4000元/m²以下</View>
                                <View className="split-item">4000-5000元/m²</View>
                                <View className="split-item">5000-6000元/m²</View>
                                <View className="split-item">6000-7000元/m²</View>
                                <View className="split-item">7000-8000元/m²</View>
                                <View className="split-item">8000-10000元/m²</View>
                                <View className="split-item">10000元/m²以上</View>
                            </ScrollView>
                        </View>
                    </View>
                    <View className="search-footer">
                        <Input className="search-input" placeholder="最低价" />-
                        <Input className="search-input" placeholder="最高价" />
                        <View className="btn confirm-btn single-btn">确定</View>
                    </View>
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab === 'house_type' && 'actived')}>
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: scrollMoreHeight }}>
                        <View className="search-multi-item">
                            <View className="options">
                                <View className="options-item">一居</View>
                                <View className="options-item">两居</View>
                                <View className="options-item">三居</View>
                                <View className="options-item">四居</View>
                                <View className="options-item">五居</View>
                                <View className="options-item">五居以上</View>
                            </View>
                        </View>
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn">取消</View>
                        <View className="btn confirm-btn">确定</View>
                    </View>
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab === 'more' && 'actived')}>
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: scrollMoreHeight }}>
                        <View className="search-multi-item">
                            <View className="title">类型</View>
                            <View className="options">
                                <View className="options-item">住宅</View>
                                <View className="options-item">别墅</View>
                                <View className="options-item">写字楼</View>
                                <View className="options-item">商住</View>
                                <View className="options-item">商铺</View>
                            </View>
                        </View>
                        <View className="search-multi-item">
                            <View className="title">销售状态</View>
                            <View className="options">
                                <View className="options-item">待售</View>
                                <View className="options-item">在售</View>
                                <View className="options-item">售完</View>
                            </View>
                        </View>
                        <View className="search-multi-item">
                            <View className="title">装修</View>
                            <View className="options">
                                <View className="options-item">毛坯</View>
                                <View className="options-item">简装修</View>
                                <View className="options-item">精装修</View>
                            </View>
                        </View>
                        <View className="search-multi-item">
                            <View className="title">特色</View>
                            <View className="options">
                                <View className="options-item">小戶型</View>
                                <View className="options-item">低总价</View>
                            </View>
                        </View>
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn">取消</View>
                        <View className="btn confirm-btn">确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>

            <View className="newhouse-content">
                <View className="house-list view-content">
                    <ScrollView className="house-list-ul">
                        <View className="house-list-li">
                            <View className="li-image">
                                <Image src="//static.fczx.com/www/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="li-text">
                                <View className="title mb10">
                                    <Text>襄阳吾悦广场</Text>
                                </View>
                                <View className="small-desc mb10">
                                    <Text>樊城区-樊城区</Text>
                                    <Text className="line-split"></Text>
                                    <Text>建面85-0139平米</Text>
                                </View>
                                <View className="mb10">
                                    <Text className="price">1200</Text>
                                    <Text className="price-unit">元/m²</Text>
                                </View>
                                <View className="tags">
                                    <Text className="tags-item sale-status-1">在售</Text>
                                </View>
                            </View>
                        </View>
                        <View className="house-list-li">
                            <View className="li-image">
                                <Image src="//static.fczx.com/www/assets/images/1400x933_1.jpg"></Image>
                            </View>
                            <View className="li-text">
                                <View className="title mb10">
                                    <Text>襄阳吾悦广场</Text>
                                </View>
                                <View className="small-desc mb10">
                                    <Text>樊城区-樊城区</Text>
                                    <Text className="line-split"></Text>
                                    <Text>建面85-0139平米</Text>
                                </View>
                                <View className="mb10">
                                    <Text className="price">1200</Text>
                                    <Text className="price-unit">元/m²</Text>
                                </View>
                                <View className="tags">
                                    <Text className="tags-item sale-status-1">在售</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}
export default NewHouse