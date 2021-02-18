import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import remove from 'lodash/remove'
import isEmpty from 'lodash/isEmpty'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE } from '@constants/house'
import { PROJECT_NAME } from '@constants/global'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'
import {
    tabs,
    initial_value,
    IConditionState,
    default_value,
    INIT_CONDITION,
    filterParam,
    filterArrParam,
    findTarget,
    fetchCondition
} from './index.util'

import '@styles/common/house.scss'
import '@styles/common/search-tab.scss'
import './index.scss'

const CommunityList = () => {
    const { contentHeight } = useNavData()
    const PAGE_LIMIT = 10
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const [tab, setTab] = useState<any>({})
    const [subTabs, setSubTabs] = useState<any[]>(tabs[0].subTabs)
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [condition, setCondition] = useState<any>({})
    const [subCondition, setSubCondition] = useState<any>()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [houseList, setHouseList] = useState<any>([])
    const router = getCurrentInstance().router
    const title = router?.params.title

    useShareTimeline(() => {
        return {
            title: `${PROJECT_NAME}-小区`,
            path: `/house/community/list/index`
        }
    })

    useShareAppMessage(() => {
        return {
            title: `${PROJECT_NAME}-小区`,
            path: `/house/community/list/index`
        }
    })

    useEffect(() => {
        fetchCondition((result: any) => {
            setCondition(result)
        })
    }, [])

    useEffect(() => {
        fetchHouseList(selected.currentPage)
    }, [selected.currentPage, selected.propertyType, selected.buildYear])

    const fetchHouseList = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getCommunityList),
            data: {
                title: title || '',
                page: currentPage,
                limit: PAGE_LIMIT,
                fang_area_id: filterParam(selected.areaList?.id),
                fang_subway: filterParam(selected.subway?.id),
                fang_area_circles: filterArrParam(selected.circle).join(','),
                fang_subway_station: filterArrParam(selected.station).join(','),
                fang_property_type: filterParam(selected.propertyType?.id),
                build_year: filterParam(selected.buildYear?.id),

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

    const fetchSubCondition = (type: string, apiUrl: string, param: any = {}) => {
        app.request({
            url: app.areaApiUrl(apiUrl),
            data: param
        }, { loading: false }).then((result: any) => {
            setSubCondition({ [type]: result })
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

    const switchCondition = (item) => {
        if (tab.type === item.type) {
            setTab({})
            return
        }
        setTab(item)
        setSubTabs(item.subTabs)
    }

    const handleSubTabsUpdate = (subTab: any) => {
        for (const item of subTabs) {
            item.actived = item.type === subTab.type
        }
        setSubTabs([...subTabs])
    }

    const handleSingleClick = (key: string, item: any) => {
        switch (key) {
            case 'areaList':
                setSelected({
                    ...selected,
                    [key]: item,
                    subway: default_value,
                    circle: [default_value],
                    station: [default_value]
                })
                if (item.id === 'all') {
                    setSubCondition(null)
                } else {
                    fetchSubCondition('circle', api.getAreaCircle, { id: item.id })
                }
                break
            case 'circle':
                setSelected({
                    ...selected,
                    circle: [default_value]
                })
                break
            case 'subway':
                setSelected({
                    ...selected,
                    [key]: item,
                    areaList: default_value,
                    circle: [default_value],
                    station: [default_value],
                })
                if (item.id === 'all') {
                    setSubCondition(null)
                } else {
                    fetchSubCondition('station', api.getSubway, { pid: item.id })
                }
                break
            case 'station':
                setSelected({
                    ...selected,
                    station: [default_value]
                })
                break
            default:
                setSelected({
                    ...selected,
                    [key]: item,
                    currentPage: INIT_CONDITION.currentPage
                })
                setTab({})

        }
    }
    const handleMultiClick = (key: string, item: any) => {
        let selectedValue = selected[key]
        if (selectedValue instanceof Object) {
            if (selectedValue.id === item.id) {
                setSelected({
                    ...selected,
                    [key]: initial_value
                })
            } else {
                setSelected({
                    ...selected,
                    [key]: item
                })
            }
        }

        if (selectedValue instanceof Array) {
            remove(selectedValue, { id: 'all' })
            if (findTarget(selectedValue, item)) {
                remove(selectedValue, { id: item.id })
                setSelected({
                    ...selected,
                    [key]: selectedValue
                })
            } else {
                setSelected({
                    ...selected,
                    [key]: [...selectedValue, item]
                })
            }
        }
    }
    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/house/community/index/index?id=${item.id}`
        })
    }

    const handleSearchClick = () => {
        Taro.navigateTo({
            url: `/house/community/search/index`
        })
    }

    
    const handleTabReset = () => {
        setSelected({
            ...selected,
            areaList: default_value,
            subway: default_value,
            circle: [default_value],
            station: [default_value]
        })
        setSubCondition(null)
    }

    const handleConfirm = () => {
        setTab({})
        fetchHouseList()
    }

    const renderSubTabs = () => {
        return (
            <View className="split-list flex-item">
                {
                    subTabs.map((item: any, index: number) => {
                        if (item.type === 'subway' && isEmpty(condition.subway)) {
                            return null
                        } else {
                            return (
                                <View
                                    key={index}
                                    className={classnames("split-item", item.actived && 'actived')}
                                    onClick={() => handleSubTabsUpdate(item)}>
                                    {item.name}
                                </View>
                            )
                        }
                    })
                }
            </View>
        )
    }

    const renderSplitTabItem = () => {
        if (!tab.type) {
            return
        }
        const target = find(subTabs, { actived: true })
        const key = target ? target.type : tab.keys[0]
        return (
            <ScrollView className="split-list flex-item" scrollY style={{ height: scrollHeight }}>
                <View
                    className={classnames("split-item", selected[key].id === default_value.id && 'actived')}
                    onClick={() => handleSingleClick(key, default_value)}
                >{default_value.name}
                </View>
                {
                    condition[key] &&
                    condition[key].map((item: any, index: number) => (
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

    const renderSplitSubTabItem = () => {
        const target = find(subTabs, { actived: true })
        if (!target) {
            return
        }
        const key = target.subType
        if (subCondition[key]) {
            return (
                <ScrollView className="split-list flex-item" scrollY style={{ height: scrollHeight }}>
                    <View
                        className={classnames("split-item", findTarget(selected[key], default_value) && 'actived')}
                        onClick={() => handleSingleClick(key, default_value)}
                    >{default_value.name}
                    </View>
                    {
                        subCondition[key].map((item: any, index: number) => (
                            <View
                                key={index}
                                className={classnames("split-item", findTarget(selected[key], item) && 'actived')}
                                onClick={() => handleMultiClick(key, item)}
                            >
                                <Text className="text">{item.name}</Text>
                                <Text className={classnames('iconfont', findTarget(selected[key], item) ? 'iconcheckbox' : 'iconcheckboxno')}></Text>
                            </View>
                        ))
                    }
                </ScrollView>
            )
        }
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

    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <Text className="price">待定</Text>
        } else {
            return <Text className="price">{price}<Text className="price-unit">{PRICE_TYPE[price_type]}</Text></Text>
        }
    }

    const renderSearchTabs = () => {
        return tabs.map((item: any, index: number) => {
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

    return (
        <View className="community">
            <View className="fixed" style={{ top: 0 }}>
                <View className="community-header view-content">
                    <View className="community-search" onClick={handleSearchClick}>
                        <Text className="iconfont iconsearch"></Text>
                        <Text className={classnames('community-search-text', !title && 'placeholder')}>
                            {title ? title : '请输入小区或地址'}
                        </Text>
                    </View>
                </View>
                <View className="search-tab">
                    {renderSearchTabs()}
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab.type === 'location' && 'actived')}>
                    <View className="search-content search-content-scroll">
                        <View className="search-split">
                            {renderSubTabs()}
                            {renderSplitTabItem()}
                            {subCondition && renderSplitSubTabItem()}
                        </View>
                    </View>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleTabReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
                <View className={classnames('search-container', tab.type === 'propertyType' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitTabItem()}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', tab.type === 'buildYear' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitTabItem()}
                        </View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab.type && 'show')} onClick={() => setTab('')}></View>

            <View className="community-content">
                <ScrollView
                    className="house-list"
                    scrollY
                    style={{ maxHeight: contentHeight - 108 }}
                    lowerThreshold={30}
                    onScrollToLower={handleScrollToLower}
                >
                    <View className="house-list-ul">
                        {
                            houseList.map((item: any, index: number) => (
                                <View key={index} className="house-list-li">
                                    <View className="house-content" onClick={() => handleHouseItemClick(item)}>
                                        <View className="house-image">
                                            <Image className="taro-image" src={item.image_path}></Image>
                                        </View>
                                        <View className="house-text">
                                            <View className="text-item row2">
                                                <Text>{item.title}</Text>
                                            </View>
                                            <View className="text-item text-item-small">
                                                <Text>{item.area.name}</Text>
                                                <Text className="ml20">{item.address}</Text>
                                            </View>
                                            <View className="text-item mb8">
                                                {renderPrice(item.price, item.price_type)}
                                            </View>
                                            <View className="text-item text-item-small">
                                                <Text>二手房({item.house_num})</Text>
                                                <Text className="ml20">租房({item.rent_num})</Text>
                                                <Text className="ml20">{item.build_year}年</Text>
                                            </View>
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