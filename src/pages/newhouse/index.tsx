import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'
import { find, remove } from 'lodash'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import '@styles/common/house-list.scss'
import '@styles/common/search-tab.scss'
import './index.scss'

interface IFilter {
    id: string
    name: string
    value?: string
}

interface IConditionState {
    region?: IFilter
    unit_price?: IFilter
    total_price?: IFilter
    house_type?: IFilter
    house_property?: IFilter
    sale_status?: IFilter
    renovation?: IFilter
    feature?: IFilter

}

const initial_value = { id: '', name: '', value: '' }

const INIT_CONDITION = {
    region: { id: 'all', name: '不限', value: '' },
    unit_price: { id: 'all', name: '不限', value: '' },
    total_price: initial_value,
    house_type: { id: 'all', name: '不限', value: '' },
    house_property: initial_value,
    sale_status: initial_value,
    renovation: initial_value,
    feature: initial_value
}

const NewHouse = () => {
    const { appHeaderHeight, contentHeight } = useNavData()
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const [tab, setTab] = useState<string>('')
    const [priceType, setPriceType] = useState<string>('unit_price')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [condition, setCondition] = useState<any>()
    const [houseList, setHouseList] = useState<any>([])
    const tabs = [
        {
            type: 'region',
            name: '区域',
            keys: ['region']
        },
        {
            type: 'price',
            name: '价格',
            keys: ['unit_price', 'total_price']
        },
        {
            type: 'house_type',
            name: '户型',
            keys: ['house_type']
        },
        {
            type: 'more',
            name: '更多',
            keys: ['house_property', 'sale_status', 'renovation', 'feature']
        }]
    const priceTabs = [
        {
            id: 'id_01',
            name: '按单价',
            value: "unit_price"
        },
        {
            id: 'id_02',
            name: '按总价',
            value: "total_price"
        }
    ]

    useEffect(() => {
        fetchCondition()
    }, [])

    useEffect(() => {
        fetchHouseList()
    }, [selected.region, selected.unit_price, selected.total_price, selected.house_type])

    const fetchCondition = () => {
        app.request({
            url: api.getHouseCondition,
            data: { type: 'newHouse' }
        }, {
            isMock: true,
            loading: false
        }).then((result: any) => {
            setCondition(result || {})
        })
    }

    const fetchHouseList = () => {
        app.request({
            url: api.getHouseNew,
            data: {
                region: selected.region?.id,
                unit_price: selected.unit_price?.value,
                total_price: selected.total_price?.value,
                house_type: selected.house_type?.value,
                house_property: selected.house_property?.value,
                sale_status: selected.sale_status?.value,
                feature: selected.feature?.value,
                renovation: selected.renovation?.value
            }
        }, {
            isMock: true
        }).then((result: any) => {
            setHouseList(result || [])
        })
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
        if (key === 'unit_price') {
            setSelected({
                ...selected,
                total_price: initial_value,
                [key]: item
            })
        } else if (key === 'total_price') {
            setSelected({
                ...selected,
                unit_price: initial_value,
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
            house_property: initial_value,
            renovation: initial_value,
            sale_status: initial_value,
            feature: initial_value
        })
    }

    const handleConfirm = () => {
        setTab('')
        fetchHouseList()
    }

    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/pages/house/index?id=${item.id}&name=${item.house_name}`
          })
    }

    const renderSplitItem = (key: string) => {
        return (
            <ScrollView className="split-list flex-item" scrollY style={{ height: scrollHeight }}>
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
                <View className={classnames('search-container', tab === 'region' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            <View className="split-type flex-item">
                                <View className="split-item actived">区域</View>
                            </View>
                            {renderSplitItem('region')}
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
                <View className={classnames('search-container', tab === 'house_type' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('house_type')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab === 'more' && 'actived')}>
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: scrollMoreHeight }}>
                        {renderMultiItem('house_property', '类型')}
                        {renderMultiItem('renovation', '装修')}
                        {renderMultiItem('sale_status', '状态')}
                        {renderMultiItem('feature', '特色')}
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
                                        <View className="title mb10">
                                            <Text>{item.house_name}</Text>
                                        </View>
                                        <View className="small-desc mb10">
                                            <Text>{item.area && item.area.name}</Text>
                                            <Text className="line-split"></Text>
                                            <Text>建面{item.building_area}平米</Text>
                                        </View>
                                        <View className="mb10">
                                            <Text className="price">{item.price}</Text>
                                            <Text className="price-unit">{PRICE_TYPE[item.price_type]}</Text>
                                        </View>
                                        <View className="tags">
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