import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'
import '@styles/common/house.scss'
import '@styles/common/search-tab.scss'
import './index.scss'
import { PROJECT_NAME } from '@constants/global'

interface IFilter {
    id: string
    name: string
    value?: string
}

interface IConditionState {
    currentPage: number
    areaList?: IFilter
    rentPrice?: IFilter
    fangRoom?: IFilter
    rentType?: IFilter
    propertyType?: IFilter
    fangBuildingType?: IFilter
    renovationStatus?: IFilter
    fangDirectionType?: IFilter

}

const initial_value: IFilter = { id: '', name: '' }
const default_value: IFilter = { id: 'all', name: '不限' }

const INIT_CONDITION: IConditionState = {
    currentPage: 1,
    areaList: default_value,
    rentPrice: default_value,
    fangRoom: default_value,
    rentType: initial_value,
    propertyType: initial_value,
    fangBuildingType: initial_value,
    renovationStatus: initial_value,
    fangDirectionType: initial_value,
}

const RENT_TYPE: any = {
    '1': '整租',
    '2': '合租'
}

const tabs: any[] = [
    {
        type: 'areaList',
        name: '区域',
        keys: ['areaList']
    },
    {
        type: 'rentPrice',
        name: '租金',
        keys: ['rentPrice']
    },
    {
        type: 'fangRoom',
        name: '户型',
        keys: ['fangRoom']
    },
    {
        type: 'more',
        name: '筛选',
        keys: ['rentType', 'propertyType', 'fangBuildingType', 'renovationStatus', 'fangDirectionType']
    }]

const RentList = () => {
    const { contentHeight } = useNavData()
    const PAGE_LIMIT = 10
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const [tab, setTab] = useState<string>('')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [condition, setCondition] = useState<any>()
    const [houseList, setHouseList] = useState<any>([])
    const router = getCurrentInstance().router
    const title = router?.params.title

    useShareTimeline(() => {
        return {
            title: `${PROJECT_NAME}-租房`,
            path: `/house/rent/list/index`
        }
    })

    useShareAppMessage(() => {
        return {
            title: `${PROJECT_NAME}-租房`,
            path: `/house/rent/list/index`
        }
    })


    useEffect(() => {
        fetchCondition()
    }, [])

    useEffect(() => {
        fetchHouseList(selected.currentPage)
    }, [selected.currentPage, selected.areaList, selected.rentPrice, selected.fangRoom])

    const fetchCondition = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition(result)
        })
    }

    const fetchHouseList = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getRentList),
            data: {
                title: title || '',
                page: currentPage,
                limit: PAGE_LIMIT,
                fang_area_id: filterParam(selected.areaList?.id),
                price: filterParam(selected.rentPrice?.id),
                room: filterParam(selected.fangRoom?.id),
                rent_type: selected.rentType?.id,
                fang_renovation_status_id: selected.renovationStatus?.id,
                fang_direction_type_id: selected.fangDirectionType?.id,
                fang_property_type_id: selected.propertyType?.id,
                fang_building_type_id: selected.fangBuildingType?.id
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
    }

    const handleReset = () => {
        setSelected({
            ...selected,
            rentType: initial_value,
            propertyType: initial_value,
            renovationStatus: initial_value,
            fangDirectionType: initial_value,
        })
    }

    const handleConfirm = () => {
        setTab('')
        fetchHouseList()
    }

    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/house/rent/index/index?id=${item.id}&name=${item.title}`
        })
    }

    const handleSearchClick = () => {
        Taro.navigateTo({
            url: `/house/rent/search/index?title=${title}`
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

    const renderMultiItem = (key: string, title: string = '') => {
        return (
            <View className="search-multi-item">
                {title && <View className="title">{title}</View>}
                <View className="options">
                    {
                        condition && condition[key].map((item: any, index: number) => (
                            <View
                                key={index}
                                className={classnames("options-item", selected[key].id === item.id && 'actived')}
                                onClick={() => handleMultiClick(key, item)}
                            >
                                {item.name}
                            </View>
                        ))
                    }
                </View>
            </View>
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

    const renderPrice = (price: string) => {
        if (price === '0') {
            return <Text className="price">面议</Text>
        } else {
            return <Text className="price">{price}<Text className="price-unit">元/月</Text></Text>
        }
    }

    return (
        <View className="rent">
            <View className="fixed" style={{ top: 0 }}>
                <View className="rent-header view-content">
                    <View className="rent-search" onClick={handleSearchClick}>
                        <Text className="iconfont iconsearch"></Text>
                        <Text className={classnames('rent-search-text', !title && 'placeholder')}>
                            {title ? title : '请输入小区或地址'}
                        </Text>
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
                <View className={classnames('search-container', tab === 'rentPrice' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('rentPrice')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', tab === 'fangRoom' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('fangRoom')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab === 'more' && 'actived')}>
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: scrollMoreHeight }}>
                        {renderMultiItem('rentType', '租房类型')}
                        {renderMultiItem('propertyType', '建筑类型')}
                        {renderMultiItem('renovationStatus', '装修状况')}
                        {renderMultiItem('fangDirectionType', '朝向')}
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>

            <View className="rent-content">
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
                                            <Image className="taro-image" src={item.image_path} mode="aspectFill"></Image>
                                        </View>
                                        <View className="house-text">
                                            <View className="text-item row2">
                                                <Text>{item.title}</Text>
                                            </View>
                                            <View className="text-item text-item-small">
                                                <Text>{item.room}室{item.office}厅{item.toilet}卫</Text>
                                                <Text className="line-split"></Text>
                                                <Text>{item.building_area}m²</Text>
                                                <Text className="ml20">{item.community}</Text>
                                            </View>
                                            <View className="text-item mb12">
                                                {renderPrice(item.price)}
                                            </View>
                                            <View className="text-item tags">
                                                <Text className="tags-item sale-status-2">{RENT_TYPE[item.rent_type]}</Text>
                                                {
                                                    item.tags.map((tag: string, tagIndex: number) => (
                                                        <Text key={tagIndex} className="tags-item">{tag}</Text>
                                                    ))
                                                }
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
export default RentList