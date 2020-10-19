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

interface IFilter {
    id: string
    name: string
    value?: string
}

interface IConditionState {
    currentPage: number
    areaList?: IFilter
    price?: IFilter
    year?: IFilter
}

const default_value = { id: 'all', name: '不限' }

const INIT_CONDITION = {
    currentPage: 1,
    areaList: default_value,
    price: default_value,
    year: default_value
}

const PlotList = () => {
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
            type: 'price',
            name: '均价',
            keys: ['price']
        },
        {
            type: 'year',
            name: '房龄',
            keys: ['year']
        }]

    useEffect(() => {
        fetchCondition()
    }, [])

    useEffect(() => {
        fetchHouseList(selected.currentPage)
    }, [selected.currentPage, selected.areaList, selected.price, selected.year])

    const fetchCondition = () => {
        app.request({
            url: app.testApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition(result)
        })
    }

    const fetchHouseList = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getHouseList),
            data: {
                page: currentPage,
                limit: PAGE_LIMIT,
                fang_area_id: filterParam(selected.areaList?.id),
                price: filterParam(selected.price?.id),
                fang_year: filterParam(selected.year?.id),

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
            url: `/house/plot/index/index?id=${item.id}&name=${item.title}`
        })
    }

    const handleSearchClick = () => {
        Taro.navigateTo({
            url: `/house/plot/search/index`
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
        <View className="plot">
            <NavBar title="小区" back={true} />
            <View className="fixed" style={{ top: appHeaderHeight }}>
                <View className="plot-header view-content">
                    <View className="plot-search" onClick={handleSearchClick}>
                        <Text className="iconfont iconsearch"></Text>
                        <Text className="plot-search-text placeholder">请输入小区或地址</Text>
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
                <View className={classnames('search-container', tab === 'price' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('price')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', tab === 'year' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('year')}
                        </View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>

            <View className="plot-content">
                <ScrollView
                    className="house-list"
                    scrollY
                    style={{ maxHeight: contentHeight - 90 }}
                    lowerThreshold={30}
                    onScrollToLower={handleScrollToLower}
                >
                    <View className="house-list-ul">
                        <View className="house-list-li" onClick={() => handleHouseItemClick({})}>
                            <View className="li-image">
                                <Image src=""></Image>
                            </View>
                            <View className="li-text">
                                <View className="text-item row2">
                                    <Text>天润颐景园小区</Text>
                                </View>
                                <View className="text-item text-item-small">
                                    <Text>樊城区</Text>
                                    <Text className="ml20">万达广场</Text>
                                </View>
                                <View className="text-item mb8">
                                    <Text className="price">23443</Text>
                                    <Text className="price-unit">元/m²</Text>
                                </View>
                                <View className="text-item text-item-small">
                                    <Text>二手房(323)</Text>
                                    <Text className="ml20">租房(102)</Text>
                                    <Text className="ml20">2011年</Text>
                                </View>
                            </View>
                        </View>
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
export default PlotList