import React, { useEffect, useRef, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import remove from 'lodash/remove'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
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
    unitPrice?: IFilter
    totalPrice?: IFilter
    priceType?: string
    room?: IFilter
    propertyType?: IFilter
    fangBuildingType?: IFilter
    saleStatus?: IFilter
    renovationStatus?: IFilter
    projectFeature?: IFilter
    __discount?: IFilter

}

const initial_value: IFilter = { id: '', name: '' }
const default_value: IFilter = { id: 'all', name: '不限' }

const INIT_CONDITION: IConditionState = {
    currentPage: 1,
    priceType: '',
    areaList: default_value,
    unitPrice: default_value,
    totalPrice: initial_value,
    room: default_value,
    propertyType: initial_value,
    fangBuildingType: initial_value,
    saleStatus: initial_value,
    renovationStatus: initial_value,
    projectFeature: initial_value,
    __discount: initial_value
}

const SALE_STATUS_ATTR: IFilter[] = [
    {
        id: '1',
        name: '在售'
    },
    {
        id: '2',
        name: '待售'
    },
    {
        id: '3',
        name: '售罄'
    }
]
const tabs: any[] = [
    {
        type: 'areaList',
        name: '区域',
        keys: ['areaList']
    },
    {
        type: 'price',
        name: '价格',
        keys: ['totalPrice', 'unitPrice']
    },
    {
        type: 'room',
        name: '户型',
        keys: ['room']
    },
    {
        type: 'more',
        name: '更多',
        keys: ['propertyType', 'fangBuildingType', 'renovationStatus']
    }
]

const priceTabs: IFilter[] = [
    {
        id: '1',
        name: '按单价',
        value: "unitPrice"
    },
    {
        id: '2',
        name: '按总价',
        value: "totalPrice"
    }
]

const NewHouse = () => {
    const { contentHeight } = useNavData()
    const PAGE_LIMIT = 10
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const [tab, setTab] = useState<string>('')
    const [priceType, setPriceType] = useState<string>('unitPrice')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [condition, setCondition] = useState<any>()
    const [houseList, setHouseList] = useState<any>([])
    const [activity, setActivity] = useState<string[]>([])
    const params: any = getCurrentInstance().router?.params
    const title = params.title
    const is_group = params.is_group || ''
    const is_recommend = params.is_recommend || ''
    const refParams = useRef<any>({ is_group, is_recommend })

    useEffect(() => {
        fetchCondition()
    }, [])

    useEffect(() => {
        fetchHouseList(selected.currentPage)
    }, [
        selected.currentPage,
        selected.areaList,
        selected.unitPrice,
        selected.totalPrice,
        selected.room,
        selected.projectFeature,
        selected.__discount
    ])

    const fetchCondition = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition({ ...result, saleStatus: SALE_STATUS_ATTR })
        })
    }

    const fetchHouseList = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getHouseList),
            data: {
                title: title || '',
                page: currentPage,
                limit: PAGE_LIMIT,
                fang_area_id: filterParam(selected.areaList?.id),
                price: filterParam(selected.unitPrice?.id || selected.totalPrice?.id),
                price_type: filterParam(selected.priceType),
                sale_status: selected.saleStatus?.id,
                fang_room_type: filterParam(selected.room?.id),
                fang_project_feature: selected.projectFeature?.id,
                fang_renovation_status: selected.renovationStatus?.id,
                fang_property_type: selected.propertyType?.id,
                fang_building_type: selected.fangBuildingType?.id,
                __discount: selected.__discount?.id,
                ...refParams.current
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
            refParams.current = {}
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

        if (key === 'unitPrice') {
            setSelected({
                ...selected,
                totalPrice: initial_value,
                priceType: '1',
                [key]: item,
                currentPage: INIT_CONDITION.currentPage
            })
        } else if (key === 'totalPrice') {
            setSelected({
                ...selected,
                unitPrice: initial_value,
                priceType: '2',
                [key]: item,
                currentPage: INIT_CONDITION.currentPage
            })
        } else {
            setSelected({
                ...selected,
                [key]: item,
                currentPage: INIT_CONDITION.currentPage
            })
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
            let target = find(selectedValue, { id: item.id })
            if (target) {
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

    const handleToggleClick = (key: string, item: any) => {
        let selectedValue = selected[key]
        if (selectedValue instanceof Object) {
            if (selectedValue.id === item.id) {
                setSelected({
                    ...selected,
                    [key]: initial_value,
                    currentPage: INIT_CONDITION.currentPage
                })
            } else {
                setSelected({
                    ...selected,
                    [key]: item,
                    currentPage: INIT_CONDITION.currentPage
                })
            }
        }
    }

    const handleReset = () => {
        setSelected({
            ...selected,
            propertyType: initial_value,
            renovationStatus: initial_value,
            saleStatus: initial_value,
            // projectFeature: initial_value
        })
    }

    const handleConfirm = () => {
        setTab('')
        fetchHouseList()
    }

    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/house/new/index/index?id=${item.id}&name=${item.title}`
        })
    }

    const handleSearchClick = () => {
        Taro.navigateTo({
            url: `/house/new/search/index`
        })
    }

    const toHouseMap = () => {
        Taro.navigateTo({
            url: `/house/new/map/index`
        })
    }

    const handleActivity = (houseId: string) => {
        if (activity.includes(houseId)) {
            activity.splice(activity.findIndex((item: string) => item === houseId), 1)
            setActivity([...activity])
        } else {
            setActivity([...activity, houseId])
        }
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

    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <Text className="price">待定</Text>
        } else {
            return <Text className="price">{price}<Text className="price-unit">{PRICE_TYPE[price_type]}</Text></Text>
        }
    }
    return (
        <View className="newhouse">
            <View className="fixed" style={{ top: 0 }}>
                <View className="newhouse-header view-content">
                    <View className="newhouse-search" onClick={handleSearchClick}>
                        <Text className="iconfont iconsearch"></Text>
                        <Text className={classnames('newhouse-search-text', !title && 'placeholder')}>
                            {title ? title : '请输入楼盘名称或地址'}
                        </Text>
                    </View>
                    <View className="newhouse-nav-right" onClick={toHouseMap}>
                        <Text className="iconfont iconaddress"></Text>
                        <Text className="text">地图找房</Text>
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
                            <View className="split-type flex-item">
                                {
                                    priceTabs.map((item: any) => (
                                        <View
                                            key={item.id}
                                            className={classnames("split-item", item.value === priceType && 'actived')}
                                            onClick={() => setPriceType(item.value)}>
                                            {item.name}
                                        </View>
                                    ))
                                }
                            </View>
                            {renderSplitItem(priceType)}
                        </View>
                    </View>
                    {/* <View className="search-footer">
                        <Input className="search-input" placeholder="最低价" />-
                        <Input className="search-input" placeholder="最高价" />
                        <View className="btn confirm-btn single-btn">确定</View>
                    </View> */}
                </View>
                <View className={classnames('search-container', tab === 'room' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('room')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab === 'more' && 'actived')}>
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: scrollMoreHeight }}>
                        {renderMultiItem('propertyType', '建筑类型')}
                        {renderMultiItem('renovationStatus', '装修状况')}
                        {renderMultiItem('saleStatus', '销售状态')}
                        {/* {renderMultiItem('projectFeature', '项目特色')} */}
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>
            <View className="newhouse-content">
                <ScrollView
                    className="house-list"
                    scrollY
                    style={{ maxHeight: contentHeight - 108 }}
                    lowerThreshold={30}
                    onScrollToLower={handleScrollToLower}
                >
                    <ScrollView className="search-tag" scrollX>
                        <View
                            className={classnames("search-tag-item", selected.__discount?.id === '1' && 'actived')}
                            onClick={() => handleMultiClick('__discount', { id: '1' })}
                        >
                            <Text className="iconfont iconcoupon"></Text>
                            <Text className="tag-name">优惠楼盘</Text>
                        </View>
                        {
                            condition &&
                            condition['projectFeature'].map((item: any, index: number) => (
                                <View
                                    key={index}
                                    className={classnames("search-tag-item", selected.projectFeature?.id === item.id && 'actived')}
                                    onClick={() => handleToggleClick('projectFeature', item)}
                                >
                                    <Text className="tag-name">{item.name}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>
                    <View className="house-list-ul">
                        {
                            houseList.length > 0 && houseList.map((item: any, index: number) => (
                                <View key={index} className="house-list-li">
                                    <View className="house-content" onClick={() => handleHouseItemClick(item)}>
                                        <View className="house-image">
                                            <Image src={item.image_path} mode="aspectFill"></Image>
                                        </View>
                                        <View className="house-text">
                                            <View className="text-item title mb8">
                                                <Text className={classnames('sale-status', `sale-status-${item.sale_status}`)}>{SALE_STATUS[item.sale_status]}</Text>
                                                <Text>{item.title}</Text>
                                            </View>
                                            <View className="text-item small-desc mb8">
                                                <Text>{item.area && item.area.name}</Text>
                                                <Text className="line-split"></Text>
                                                <Text>{item.comment_num}条评论</Text>
                                            </View>
                                            <View className="mb12">
                                                {renderPrice(item.price, item.price_type)}
                                            </View>
                                            <View className="text-item tags">
                                                {
                                                    item.tags && item.tags.map((tag: string, index: number) => (
                                                        <Text key={index} className="tags-item">{tag}</Text>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View className="house-activity" onClick={() => handleActivity(item.id)}>
                                        <View className="activity-content">
                                            {
                                                item.is_discount == '1' &&
                                                <View className="activity-item">
                                                    <Text className="iconfont iconcoupon"></Text>
                                                    <Text className="text">{item.fangHouseDiscount.title}</Text>
                                                </View>
                                            }
                                            {
                                                item.is_group == '1' && activity.includes(item.id) &&
                                                <View className="activity-item">
                                                    <Text className="iconfont iconstars"></Text>
                                                    <Text className="text">{item.fangHouseGroup.title}</Text>
                                                </View>
                                            }
                                        </View>
                                        {
                                            item.is_discount == '1' &&
                                            item.is_group == '1' &&
                                            <View className="activity-icon">
                                                <Text className={classnames('iconfont', activity.includes(item.id) ? 'iconarrow-up-bold' : 'iconarrow-down-bold')}></Text>
                                            </View>
                                        }
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
export default NewHouse