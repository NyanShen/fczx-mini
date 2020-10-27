import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'
import '@styles/common/house.scss'
import '@styles/common/search-tab.scss'
import './index.scss'
import { PRICE_TYPE } from '@constants/house'

interface IFilter {
    id: string
    name: string
    value?: string
}

interface IConditionState {
    currentPage: number
    areaList?: IFilter
    unitPrice?: IFilter
    buildYear?: IFilter
}

const default_value = { id: 'all', name: '不限' }

const INIT_CONDITION = {
    currentPage: 1,
    areaList: default_value,
    unitPrice: default_value,
    buildYear: default_value
}

const CommunityList = () => {
    const { appHeaderHeight, contentHeight } = useNavData()
    const PAGE_LIMIT = 10
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const [tab, setTab] = useState<string>('')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [condition, setCondition] = useState<any>()
    const [houseList, setHouseList] = useState<any>([])
    const tabs = [
        {
            type: 'areaList',
            name: '区域',
            keys: ['areaList']
        },
        {
            type: 'unitPrice',
            name: '均价',
            keys: ['unitPrice']
        },
        {
            type: 'buildYear',
            name: '房龄',
            keys: ['buildYear']
        }]

    useEffect(() => {
        fetchCondition()
    }, [])

    useEffect(() => {
        fetchHouseList(selected.currentPage)
    }, [selected.currentPage, selected.areaList, selected.unitPrice, selected.buildYear])

    const fetchCondition = () => {
        app.request({
            url: app.testApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition(result)
        })
    }

    const fetchHouseList = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getCommunityList),
            data: {
                page: currentPage,
                limit: PAGE_LIMIT,
                fang_area_id: filterParam(selected.areaList?.id),
                price: filterParam(selected.unitPrice?.id),
                buildYear: filterParam(selected.buildYear?.id),

            }
        }, { loading: false }).then((result: any) => {
            setLoading(false)
            const totalPage = getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            if (totalPage <= INIT_CONDITION.currentPage) {
                setShowEmpty(true)
            } else {
                setShowEmpty(false)
            }
            setPage({
                totalCount: result.pagination.totalCount,
                totalPage
            })

            if (currentPage === 1) {
                setHouseList(result.data)
            } else {
                setHouseList([...houseList, ...result.data])
            }
        })
    }
    const handleScrollToLower = () => {
        if (page.totalPage > selected.currentPage) {
            setLoading(true)
            setSelected({
                ...selected,
                currentPage: selected.currentPage + 1
            })
        } else {
            setShowEmpty(true)
        }
    }

    const filterParam = (id: any) => {
        return id === 'all' ? '' : id
    }

    const switchCondition = (item) => {
        if (tab === item.type) {
            setTab('')
            return
        }
        setTab(item.type)
    }

    const handleSingleClick = (key: string, item: any) => {
        setTab('')
        setSelected({
            ...selected,
            [key]: item,
            currentPage: INIT_CONDITION.currentPage
        })
    }

    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/house/community/index/index?id=${item.id}&name=${item.title}`
        })
    }

    const handleSearchClick = () => {
        Taro.navigateTo({
            url: `/house/community/search/index`
        })
    }

    const renderSplitItem = (key: string) => {
        return (
            <ScrollView className="split-list flex-item" scrollY style={{ height: scrollHeight }}>
                <View
                    className={classnames("split-item", selected[key].id === default_value.id && 'actived')}
                    onClick={() => handleSingleClick(key, default_value)}
                >{default_value.name}
                </View>
                {
                    condition && condition[key].map((item: any, index: number) => (
                        <View
                            key={index}
                            className={classnames("split-item", selected[key].id === item.id && 'actived')}
                            onClick={() => handleSingleClick(key, item)}
                        >{item.name}
                        </View>
                    ))
                }
            </ScrollView>
        )
    }

    const renderShowName = (item: any) => {
        let showList: string[] = []
        for (const key of item.keys) {
            if (selected[key] instanceof Object) {
                let showName: string = selected[key].name
                if (!showName || ['不限', '全部'].includes(showName)) {
                    continue
                }
                showList.push(showName)
            }
        }

        if (showList.length > 1) {
            showList = ['多选']
        }

        return showList.join(',')
    }
    return (
        <View className="community">
            <NavBar title="小区" back={true} />
            <View className="fixed" style={{ top: appHeaderHeight }}>
                <View className="community-header view-content">
                    <View className="community-search" onClick={handleSearchClick}>
                        <Text className="iconfont iconsearch"></Text>
                        <Text className="community-search-text placeholder">请输入小区或地址</Text>
                    </View>
                </View>
                <View className="search-tab">
                    {

                        tabs.map((item: any, index: number) => {
                            let showName = renderShowName(item)
                            return (
                                <View
                                    key={index}
                                    className={classnames('search-tab-item', showName && 'actived')}
                                    onClick={() => switchCondition(item)}
                                >
                                    <Text className="text">{showName ? showName : item.name}</Text>
                                    <Text className="iconfont iconarrow-down-bold"></Text>
                                </View>
                            )
                        })
                    }
                </View>
                <View className={classnames('search-container', tab === 'areaList' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            <View className="split-type flex-item">
                                <View className="split-item actived">区域</View>
                            </View>
                            {renderSplitItem('areaList')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', tab === 'unitPrice' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('unitPrice')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', tab === 'buildYear' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('buildYear')}
                        </View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>

            <View className="community-content">
                <ScrollView
                    className="house-list"
                    scrollY
                    style={{ maxHeight: contentHeight - 90 }}
                    lowerThreshold={30}
                    onScrollToLower={handleScrollToLower}
                >
                    <View className="house-list-ul">
                        {
                            houseList.map((item: any, index: number) => (
                                <View key={index} className="house-list-li" onClick={() => handleHouseItemClick(item)}>
                                    <View className="li-image">
                                        <Image src={item.image_path}></Image>
                                    </View>
                                    <View className="li-text">
                                        <View className="text-item row2">
                                            <Text>{item.title}</Text>
                                        </View>
                                        <View className="text-item text-item-small">
                                            <Text>{item.area.name}</Text>
                                            <Text className="ml20">{item.address}</Text>
                                        </View>
                                        <View className="text-item mb8">
                                            <Text className="price">{item.price}</Text>
                                            <Text className="price-unit">{PRICE_TYPE[item.price_type]}</Text>
                                        </View>
                                        <View className="text-item text-item-small">
                                            <Text>二手房({item.house_num})</Text>
                                            <Text className="ml20">租房({item.rent_num})</Text>
                                            <Text className="ml20">{item.build_year}年</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                    {
                        loading &&
                        <View className="empty-container">
                            <Text>正在加载中...</Text>
                        </View>
                    }
                    {
                        showEmpty &&
                        <View className="empty-container">
                            <Text>没有更多数据了</Text>
                        </View>
                    }
                </ScrollView>
            </View>
        </View>
    )
}
export default CommunityList