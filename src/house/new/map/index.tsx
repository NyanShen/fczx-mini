import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, ScrollView, Text, Input, Map } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import remove from 'lodash/remove'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import NavBar from '@components/navbar'
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
    renovationStatus: initial_value,
}

interface IMapParam {
    zoom: number
    swlng?: number
    swlat?: number
    nelng?: number
    nelat?: number
}

const INIT_MAP_PARAM = {
    zoom: 11
}

const HouseMap = () => {
    const { appHeaderHeight, contentHeight } = useNavData()
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const city = storage.getItem('city')
    const center = bMapTransQQMap(city.latitude, city.longitude)
    const [tab, setTab] = useState<string>('')
    const [condition, setCondition] = useState<any>()
    const [priceType, setPriceType] = useState<string>('unitPrice')
    const [mapParam, setMapParam] = useState<IMapParam>(INIT_MAP_PARAM)
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [markers, setMarkers] = useState<any[]>([])
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
            keys: ['propertyType', 'fangBuildingType', 'renovationStatus']
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
        app.request({
            url: app.areaApiUrl(api.getHouseAttr)
        }).then((result: any) => {
            setCondition(result)
        })
    }, [])

    useEffect(() => {
        app.request({
            url: app.areaApiUrl(api.getHouseMap),
            data: {
                zoom: mapParam.zoom,
                nelat: mapParam.nelat || '',
                nelng: mapParam.nelng || '',
                swlat: mapParam.swlat || '',
                swlng: mapParam.swlng || '',
                price: filterParam(selected.unitPrice?.id || selected.totalPrice?.id),
                price_type: filterParam(selected.priceType),
                fang_area_id: filterParam(selected.areaList?.id),
                fang_room_type: filterParam(selected.room?.id),
                fang_property_type: selected.propertyType?.id,
                fang_building_type: selected.fangBuildingType?.id,
                fang_renovation_status: selected.renovationStatus?.id
            }
        }).then((result: any) => {
            if (mapParam.zoom < 12) {
                setRegionData(result.gather_regions)
            } else {
                setHouseLabels(result.label_rows)
            }
        })
    }, [mapParam, selected])

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
                label: {
                    content: `${item.name}\n${item.count}个新盘`,
                    color: '#fff',
                    anchorX: -20,
                    anchorY: -50,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: '#fff',
                    bgColor: '#11a43c',
                    textAlign: 'center'
                }
            })
        }
        setMarkers(regionLabels)
    }

    const setHouseLabels = (dataList: any[]) => {
        let houseLabels: any[] = []
        for (const item of dataList) {
            const location = bMapTransQQMap(item.latitude, item.longitude)
            houseLabels.push({
                id: Number(item.id),
                latitude: location.latitude,
                longitude: location.longitude,
                iconPath: down_fill,
                width: 20,
                height: 30,
                label: {
                    content: `${item.price}${PRICE_TYPE[item.price_type]} | ${item.title}`,
                    color: '#fff',
                    anchorX: 10,
                    anchorY: -52,
                    padding: 10,
                    borderRadius: 10,
                    bgColor: '#11a43c',
                    textAlign: 'center'
                }
            })
        }
        setMarkers(houseLabels)
    }

    const handleRegionChangeEnd = () => {
        const mapctx = Taro.createMapContext('QQMapId')
        mapctx.getScale({
            success: (scaleRes: any) => {
                mapctx.getRegion({
                    success: (regionRes: any) => {
                        const ne = regionRes.northeast
                        const sw = regionRes.southwest
                        const nepoint = qqMapTransBMap(ne.latitude, ne.longitude)
                        const swpoint = qqMapTransBMap(sw.latitude, sw.longitude)
                        setMapParam({
                            zoom: scaleRes.scale,
                            swlat: swpoint.latitude,
                            swlng: swpoint.longitude,
                            nelat: nepoint.latitude,
                            nelng: nepoint.longitude,
                        })
                    }
                })

            }
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
            fangBuildingType: initial_value,
            renovationStatus: initial_value
        })
    }

    const handleConfirm = () => {
        setTab('')
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
            <NavBar title="新房-地图找房" back={true}></NavBar>
            <View className="fixed" style={{ top: appHeaderHeight }}>
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
                    <View className="search-footer">
                        <Input className="search-input" placeholder="最低价" />-
                        <Input className="search-input" placeholder="最高价" />
                        <View className="btn confirm-btn single-btn">确定</View>
                    </View>
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
                    scale={INIT_MAP_PARAM.zoom}
                    markers={markers}
                    onEnd={handleRegionChangeEnd}
                >
                </Map>
            </View>
        </View>
    )
}

export default HouseMap