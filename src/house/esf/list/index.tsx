import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
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
    unitPrice?: IFilter
    totalPrice?: IFilter
    priceType?: string
    fangRoom?: IFilter
    propertyType?: IFilter
    fangBuildingType?: IFilter
    fangDirectionType?: IFilter
    renovationStatus?: IFilter
    projectFeature?: IFilter

}

const initial_value = { id: '', name: '' }
const default_value = { id: 'all', name: '不限' }

const INIT_CONDITION = {
    currentPage: 1,
    priceType: '',
    areaList: default_value,
    unitPrice: default_value,
    totalPrice: initial_value,
    fangRoom: default_value,
    propertyType: initial_value,
    fangBuildingType: initial_value,
    fangDirectionType: initial_value,
    renovationStatus: initial_value,
    projectFeature: initial_value
}

const esfList = () => {
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
    const router = getCurrentInstance().router
    const title = router?.params.title
    const tabs = [
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
            type: 'fangRoom',
            name: '户型',
            keys: ['fangRoom']
        },
        {
            type: 'more',
            name: '更多',
            keys: ['propertyType', 'fangBuildingType', 'fangDirectionType', 'renovationStatus', 'projectFeature']
        }]
    const priceTabs = [
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

    useEffect(() => {
        fetchCondition()
    }, [])

    useEffect(() => {
        fetchHouseList(selected.currentPage)
    }, [selected.currentPage, selected.areaList, selected.unitPrice, selected.totalPrice, selected.fangRoom])

    const fetchCondition = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition(result)
        })
    }

    const fetchHouseList = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getEsfList),
            data: {
                title: title || '',
                page: currentPage,
                limit: PAGE_LIMIT,
                fang_area_id: filterParam(selected.areaList?.id),
                price: filterParam(selected.unitPrice?.id || selected.totalPrice?.id),
                price_type: filterParam(selected.priceType),
                room: filterParam(selected.fangRoom?.id),
                fang_project_feature: selected.projectFeature?.id,
                fang_renovation_status_id: selected.renovationStatus?.id,
                fang_property_type_id: selected.propertyType?.id,
                fang_building_type_id: selected.fangBuildingType?.id,
                fang_direction_type_id: selected.fangDirectionType?.id
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
    }

    const handleReset = () => {
        setSelected({
            ...selected,
            propertyType: initial_value,
            renovationStatus: initial_value,
            projectFeature: initial_value,
            fangBuildingType: initial_value,
            fangDirectionType: initial_value,
        })
    }

    const handleConfirm = () => {
        setTab('')
        fetchHouseList()
    }

    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/house/esf/index/index?id=${item.id}`
        })
    }

    const handleSearchClick = () => {
        Taro.navigateTo({
            url: `/house/esf/search/index?title=${title}`
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
    return (
        <View className="esf">
            <View className="fixed" style={{ top: 0 }}>
                <View className="esf-header view-content">
                    <View className="esf-search" onClick={handleSearchClick}>
                        <Text className="iconfont iconsearch"></Text>
                        <Text className={classnames('esf-search-text', !title && 'placeholder')}>
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
                        {renderMultiItem('propertyType', '建筑类型')}
                        {renderMultiItem('renovationStatus', '装修状况')}
                        {renderMultiItem('projectFeature', '项目特色')}
                        {renderMultiItem('fangBuildingType', '楼层类型')}
                        {renderMultiItem('fangDirectionType', '朝向')}
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>

            <View className="esf-content">
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
                                <View key={index} className="house-list-li">
                                    <View className="house-content" onClick={() => handleHouseItemClick(item)}>
                                        <View className="house-image">
                                            <Image src={item.image_path} mode="aspectFill"></Image>
                                        </View>
                                        <View className="house-text">
                                            <View className="text-item title row2">
                                                <Text>{item.title}</Text>
                                            </View>
                                            <View className="text-item text-item-small">
                                                <Text>{item.room}室{item.office}厅{item.toilet}卫</Text>
                                                <Text className="line-split"></Text>
                                                <Text>{item.building_area}m²</Text>
                                                <Text className="ml20">{item.community}</Text>
                                            </View>
                                            <View className="text-item mb12">
                                                <Text className="price">{item.price_total}</Text>
                                                <Text className="price-unit">万</Text>
                                                <Text className="small-desc ml20">{item.price_unit}元/m²</Text>
                                            </View>
                                            <View className="text-item tags">
                                                {
                                                    item.tags.map((item: string, index: number) => (
                                                        <Text key={index} className="tags-item">{item}</Text>
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
export default esfList