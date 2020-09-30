import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'
import { find, remove } from 'lodash'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE, SALE_STATUS, SALE_STATUS_ATTR } from '@constants/house'
import '@styles/common/house.scss'
import '@styles/common/search-tab.scss'
import './index.scss'

interface IFilter {
    id: string
    name: string
    value?: string
}

interface IConditionState {
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

}

const initial_value = { id: '', name: '' }
const default_value = { id: 'all', name: '不限' }

const INIT_CONDITION = {
    priceType: '',
    areaList: default_value,
    unitPrice: default_value,
    totalPrice: initial_value,
    room: default_value,
    propertyType: initial_value,
    fangBuildingType: initial_value,
    saleStatus: initial_value,
    renovationStatus: initial_value,
    projectFeature: initial_value
}

const NewHouse = () => {
    const { appHeaderHeight, contentHeight } = useNavData()
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const [tab, setTab] = useState<string>('')
    const [priceType, setPriceType] = useState<string>('unitPrice')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
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
            keys: ['propertyType', 'fangBuildingType', 'renovationStatus', 'projectFeature']
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
        fetchHouseList()
    }, [selected.areaList, selected.unitPrice, selected.totalPrice, selected.room])

    const fetchCondition = () => {
        app.request({
            url: app.testApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition({ ...result, saleStatus: SALE_STATUS_ATTR })
        })
    }

    const fetchHouseList = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseList),
            data: {
                page: 0,
                limit: 20,
                fang_area_id: filterParam(selected.areaList?.id),
                price: filterParam(selected.unitPrice?.id || selected.totalPrice?.id),
                price_type: filterParam(selected.priceType),
                sale_status: selected.saleStatus?.id,
                fang_room_type: filterParam(selected.room?.id),
                fang_project_feature: selected.projectFeature?.id,
                fang_renovation_status: selected.renovationStatus?.id,
                fang_property_type: selected.propertyType?.id,
                fang_building_type: selected.fangBuildingType?.id
            }
        }).then((result: any) => {
            setHouseList(result.data || [])
        })
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
                [key]: item
            })
        } else if (key === 'totalPrice') {
            setSelected({
                ...selected,
                unitPrice: initial_value,
                priceType: '2',
                [key]: item
            })
        } else {
            setSelected({
                ...selected,
                [key]: item
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

    const handleReset = () => {
        setSelected({
            ...selected,
            propertyType: initial_value,
            renovationStatus: initial_value,
            saleStatus: initial_value,
            projectFeature: initial_value
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
        <View className="newhouse">
            <NavBar title="新房" back={true} />
            <View className="fixed" style={{ top: appHeaderHeight }}>
                <View className="newhouse-header view-content">
                    <View className="newhouse-search" onClick={handleSearchClick}>
                        <Text className="iconfont iconsearch"></Text>
                        <Text className="newhouse-search-text placeholder">请输入楼盘名称或地址</Text>
                    </View>
                    <View className="newhouse-nav-right">
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
                        {renderMultiItem('projectFeature', '项目特色')}
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>

            <View className="newhouse-content">
                <ScrollView className="house-list" scrollY style={{ maxHeight: contentHeight - 90 }}>
                    <View className="house-list-ul">
                        {
                            houseList.length > 0 && houseList.map((item: any) => (
                                <View className="house-list-li" key={item.id} onClick={() => handleHouseItemClick(item)}>
                                    <View className="li-image">
                                        <Image src={item.image_path}></Image>
                                    </View>
                                    <View className="li-text">
                                        <View className="text-item title mb10">
                                            <Text>{item.title}</Text>
                                        </View>
                                        <View className="text-item small-desc mb10">
                                            <Text>{item.area && item.area.name}</Text>
                                            <Text className="line-split"></Text>
                                            <Text>{item.address}</Text>
                                        </View>
                                        <View className="mb10">
                                            <Text className="price">{item.price}</Text>
                                            <Text className="price-unit">{PRICE_TYPE[item.price_type]}</Text>
                                        </View>
                                        <View className="text-item tags">
                                            <Text className={classnames('tags-item', `sale-status-${item.sale_status}`)}>{SALE_STATUS[item.sale_status]}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                    <View className="empty-container">
                        <Text>没有更多数据了</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}
export default NewHouse