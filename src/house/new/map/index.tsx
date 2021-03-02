import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import remove from 'lodash/remove'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import useNavData from '@hooks/useNavData'
import { bMapTransQQMap } from '@utils/map'
import SearchMap from '@/components/searchmap'
import SearchMapH5 from '@/components/searchmaph5'
import {
    default_zoom,
    region_zoom,
    default_value,
    initial_value,
    IConditionState,
    INIT_CONDITION,
    priceTabs,
    tabs
} from './index.util'

import '@styles/common/search-tab.scss'
import './index.scss'
import { toHouseNew } from '@/router'

const HouseMap = () => {
    const { contentHeight } = useNavData()
    const footerBtnHeight = 60
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const city = storage.getItem('city')
    const [tab, setTab] = useState<string>('')
    const [condition, setCondition] = useState<any>()
    const [priceType, setPriceType] = useState<string>('unitPrice')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const ref = useRef<any>()

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
            const { setRegionData, setHouseLabels } = ref.current
            if (selected.zoom < region_zoom) {
                setRegionData && setRegionData(result.gather_regions)
            } else {
                setHouseLabels && setHouseLabels(result.label_rows)
            }
        })
    }

    const handleAreaChange = (params: any) => {
        const areaTarget = find(condition.areaList, { id: `${params.houseId}` })
        if (areaTarget) {
            const { setCustomZoom, setCenter } = ref.current
            setSelected({
                ...selected,
                zoom: params.zoom,
                areaList: areaTarget
            })
            setCustomZoom && setCustomZoom(params.zoom)
            setCenter && setCenter(bMapTransQQMap(areaTarget.latitude, areaTarget.longitude))
        } else {
            toHouseNew('Index', { id: params.houseId })
        }
    }

    const handleParamsChange = (params: any) => {
        setSelected({
            ...selected,
            ...params
        })
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

    const updateAreaforH5 = (item: any) => {
        const { setMapCenter } = ref.current
        if (item.latitude) {
            setSelected({
                ...selected,
                areaList: item,
                zoom: region_zoom
            })
            const { latitude, longitude } = item
            setMapCenter && setMapCenter(region_zoom, { latitude, longitude })
        } else {
            setSelected({
                ...selected,
                areaList: item,
                zoom: default_zoom
            })
            setMapCenter && setMapCenter(default_zoom)
        }
    }

    const updateAreaforMini = (item: any) => {
        const { setCustomZoom, setCenter } = ref.current
        if (item.latitude) {
            const newZoom = region_zoom + Math.random() / 1000
            setSelected({
                ...selected,
                areaList: item,
                zoom: newZoom
            })
            setCustomZoom && setCustomZoom(newZoom)
            setCenter && setCenter(bMapTransQQMap(item.latitude, item.longitude))
        } else {
            const newZoom = INIT_CONDITION.zoom + Math.random() / 1000
            setSelected({
                ...selected,
                areaList: item,
                zoom: newZoom
            })
            setCustomZoom && setCustomZoom(newZoom)
            const position = bMapTransQQMap(city.latitude, city.longitude)
            setCenter && setCenter(bMapTransQQMap(position.latitude, position.longitude))
        }
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
                IS_H5 ? updateAreaforH5(item) : updateAreaforMini(item)
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
            <ScrollView className="split-list flex-item" scrollY style={{ maxHeight: `${scrollHeight - 50}px` }}>
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

    const getSearchMap = useMemo(() => {
        return IS_H5 ?
            <SearchMapH5
                ref={ref}
                city={city}
                default_zoom={default_zoom}
                region_zoom={region_zoom}
                updateParams={handleParamsChange}
            /> :
            <SearchMap
                ref={ref}
                city={city}
                zoom={selected.zoom}
                default_zoom={INIT_CONDITION.zoom}
                region_zoom={region_zoom}
                updateParams={handleParamsChange}
                updateAreaParams={handleAreaChange}
            />
    }, [selected.zoom, condition])

    return (
        <View className="house-map">
            <View className="fixed">
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
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: `${scrollMoreHeight}px` }}>
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
            {getSearchMap}
        </View>
    )
}

export default HouseMap