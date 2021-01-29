import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Map } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import remove from 'lodash/remove'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import useNavData from '@hooks/useNavData'
import { bMapTransQQMap, qqMapTransBMap } from '@utils/map'
import { PRICE_TYPE } from '@constants/house'
import down_fill from '@assets/icons/downfill.png'
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
    renovationStatus?: IFilter
    zoom: number
    swlng?: number | string
    swlat?: number | string
    nelng?: number | string
    nelat?: number | string
}

const initial_value: IFilter = { id: '', name: '' }
const default_value: IFilter = { id: 'all', name: '不限' }

const INIT_CONDITION: IConditionState = {
    zoom: 11,
    priceType: '',
    areaList: default_value,
    unitPrice: default_value,
    totalPrice: initial_value,
    room: default_value,
    propertyType: initial_value,
    fangBuildingType: initial_value,
    renovationStatus: initial_value,
    swlng: '',
    swlat: '',
    nelat: '',
    nelng: '',
}

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


const HouseMap = () => {
    const { contentHeight } = useNavData()
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const city = storage.getItem('city')
    const centerLocation = bMapTransQQMap(city.latitude, city.longitude)
    const [tab, setTab] = useState<string>('')
    const [center, setCenter] = useState<any>(centerLocation)
    const [customZoom, setCustomZoom] = useState<number>(INIT_CONDITION.zoom)
    const [condition, setCondition] = useState<any>()
    const [priceType, setPriceType] = useState<string>('unitPrice')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [markers, setMarkers] = useState<any[]>([])

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition(result)
        })
    }, [])

    useEffect(() => {
        fetchAreaHouse()
    }, [
        selected.zoom,
        selected.swlat,
        selected.swlng,
        selected.nelat,
        selected.nelng,
        selected.areaList,
        selected.unitPrice,
        selected.totalPrice,
        selected.room
    ])

    const fetchAreaHouse = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseMap),
            data: {
                zoom: selected.zoom,
                nelat: selected.nelat,
                nelng: selected.nelng,
                swlat: selected.swlat,
                swlng: selected.swlng,
                price: filterParam(selected.unitPrice?.id || selected.totalPrice?.id),
                price_type: filterParam(selected.priceType),
                fang_area_id: filterParam(selected.areaList?.id),
                fang_room_type: filterParam(selected.room?.id),
                fang_property_type: selected.propertyType?.id,
                fang_building_type: selected.fangBuildingType?.id,
                fang_renovation_status: selected.renovationStatus?.id
            }
        }).then((result: any) => {
            if (selected.zoom < 12) {
                setRegionData(result.gather_regions)
            } else {
                setHouseLabels(result.label_rows)
            }
        })
    }
    /**
     * 地图方法
     * @param dataList 
     */
    const setRegionData = (dataList: any[]) => {
        let totalCount = 0
        let regionLabels: any[] = []
        for (const item of dataList) {
            totalCount = totalCount + item.count
            const location = bMapTransQQMap(item.latitude, item.longitude)
            regionLabels.push({
                id: Number(item.id),
                latitude: location.latitude,
                longitude: location.longitude,
                iconPath: down_fill,
                width: 20,
                height: 30,
                callout: {
                    content: `${item.name}\n${item.count}个新盘`,
                    color: '#fff',
                    anchorX: 0,
                    anchorY: 30,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: '#fff',
                    bgColor: '#11a43c',
                    textAlign: 'center',
                    display: 'ALWAYS'
                }
            })
        }
        setMarkers(regionLabels)
    }

    const setHouseLabels = (dataList: any[]) => {
        let houseLabels: any[] = []
        for (const item of dataList) {
            const location = bMapTransQQMap(item.latitude, item.longitude)
            const showPrice = item.price === '0' ? '价格待定' : `${item.price}${PRICE_TYPE[item.price_type]}`
            houseLabels.push({
                id: Number(item.id),
                latitude: location.latitude,
                longitude: location.longitude,
                iconPath: down_fill,
                width: 20,
                height: 30,
                callout: {
                    content: `${showPrice} | ${item.title}`,
                    color: '#fff',
                    anchorX: 0,
                    anchorY: 20,
                    padding: 10,
                    borderRadius: 10,
                    bgColor: '#11a43c',
                    textAlign: 'center',
                    display: 'ALWAYS'
                }
            })
        }
        setMarkers(houseLabels)
    }

    const handleRegionChangeEnd = (e: any) => {
        let causeType = e.causedBy
        let zoom = e.detail.scale
        let ne = e.detail.region.northeast
        let sw = e.detail.region.southwest
        let nepoint = qqMapTransBMap(ne.latitude, ne.longitude)
        let swpoint = qqMapTransBMap(sw.latitude, sw.longitude)
        if (causeType === 'update') {
            if (selected.zoom === 11) {
                setSelected({
                    ...selected,
                    swlat: '',
                    swlng: '',
                    nelat: '',
                    nelng: '',
                })
                return
            }
            setSelected({
                ...selected,
                swlat: swpoint.latitude,
                swlng: swpoint.longitude,
                nelat: nepoint.latitude,
                nelng: nepoint.longitude,
            })
        } else {
            setSelected({
                ...selected,
                zoom,
                swlat: swpoint.latitude,
                swlng: swpoint.longitude,
                nelat: nepoint.latitude,
                nelng: nepoint.longitude,
            })
        }
    }

    const handleCalloutTap = (e: any) => {
        const markerId = e.detail.markerId
        const areaTarget = find(condition.areaList, { id: `${markerId}` })
        if (areaTarget) {
            setSelected({
                ...selected,
                zoom: 13,
                areaList: areaTarget
            })
            setCustomZoom(13)
            setCenter(bMapTransQQMap(areaTarget.latitude, areaTarget.longitude))
        } else {
            Taro.navigateTo({
                url: `/house/new/index/index?id=${markerId}`
            })
        }
    }

    /**
     * 查询条件
     * @param id 
     */

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
        switch (key) {
            case 'unitPrice':
                setSelected({
                    ...selected,
                    totalPrice: initial_value,
                    priceType: '1',
                    [key]: item
                })
                break
            case 'totalPrice':
                setSelected({
                    ...selected,
                    unitPrice: initial_value,
                    priceType: '2',
                    [key]: item
                })
                break
            case 'areaList':
                if (item.latitude) {
                    const newZoom = 13 + Math.random() / 1000
                    setSelected({
                        ...selected,
                        [key]: item,
                        zoom: newZoom
                    })
                    setCustomZoom(newZoom)
                    setCenter(bMapTransQQMap(item.latitude, item.longitude))
                } else {
                    const newZoom = INIT_CONDITION.zoom + Math.random() / 1000
                    setSelected({
                        ...selected,
                        [key]: item,
                        zoom: newZoom
                    })
                    setCustomZoom(newZoom)
                    setCenter(bMapTransQQMap(centerLocation.latitude, centerLocation.longitude))
                }
                break
            default:
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
            fangBuildingType: initial_value,
            renovationStatus: initial_value
        })
    }

    const handleConfirm = () => {
        setTab('')
        fetchAreaHouse()
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

    return (
        <View className="house-map">
            <View className="fixed" style={{ top: 0 }}>
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
                <View className={classnames('search-container', 'search-multi-container', tab === 'price' && 'actived')}>
                    <View className="search-content search-content-scroll">
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
                        {renderMultiItem('propertyType', '物业类型')}
                        {renderMultiItem('fangBuildingType', '建筑类型')}
                        {renderMultiItem('renovationStatus', '装修状况')}
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>
            <View className="QQMap">
                <Map
                    id="QQMapId"
                    style={{ width: '100%', height: contentHeight }}
                    latitude={center.latitude}
                    longitude={center.longitude}
                    scale={customZoom}
                    markers={markers}
                    onEnd={handleRegionChangeEnd}
                    onCalloutTap={handleCalloutTap}
                >
                </Map>
            </View>
        </View>
    )
}

export default HouseMap