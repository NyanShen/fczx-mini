import React, { useEffect, useRef, useState } from 'react'
import Taro, { getCurrentInstance, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import remove from 'lodash/remove'
import isEmpty from 'lodash/isEmpty'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { PROJECT_NAME } from '@constants/global'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import {
    tabs,
    IConditionState,
    initial_value,
    default_value,
    INIT_CONDITION,
    SALE_STATUS_ATTR,
    filterParam,
    filterArrParam,
    findTarget,
    fetchCondition
} from './index.util'
import '@styles/common/house.scss'
import '@styles/common/search-tab.scss'
import './index.scss'

const PAGE_LIMIT = 10
const footerBtnHeight = 60

const NewHouse = () => {
    const { contentHeight } = useNavData()
    const scrollHeight = contentHeight * 0.5 - footerBtnHeight
    const scrollMoreHeight = contentHeight * 0.6 - footerBtnHeight
    const [tab, setTab] = useState<any>({})
    const [subTabs, setSubTabs] = useState<any[]>(tabs[0].subTabs)
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const [condition, setCondition] = useState<any>({})
    const [subCondition, setSubCondition] = useState<any>()
    const [houseList, setHouseList] = useState<any>([])
    const [activity, setActivity] = useState<string[]>([])
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const params: any = getCurrentInstance().router?.params
    const title = params.title
    const is_group = params.is_group || ''
    const is_recommend = params.is_recommend || ''
    const refParams = useRef<any>({ is_group, is_recommend })

    useShareTimeline(() => {
        return {
            title: `${PROJECT_NAME}-新房`,
            path: `/house/new/list/index`
        }
    })

    useShareAppMessage(() => {
        return {
            title: `${PROJECT_NAME}-新房`,
            path: `/house/new/list/index`
        }
    })

    useEffect(() => {
        fetchCondition((result: any) => {
            setCondition({ ...result, saleStatus: SALE_STATUS_ATTR })
        })
    }, [])

    useEffect(() => {
        fetchHouseList(selected.currentPage)
    }, [
        selected.currentPage,
        selected.unitPrice,
        selected.totalPrice,
        selected.room,
        selected.projectFeature,
        selected.__discount
    ])

    const fetchSubCondition = (type: string, apiUrl: string, param: any = {}) => {
        app.request({
            url: app.areaApiUrl(apiUrl),
            data: param
        }, { loading: false }).then((result: any) => {
            setSubCondition({ [type]: result })
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
                fang_subway: filterParam(selected.subway?.id),
                fang_area_circles: filterArrParam(selected.circle).join(','),
                fang_subway_station: filterArrParam(selected.station).join(','),
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
            case 'unitPrice':
                setSelected({
                    ...selected,
                    totalPrice: initial_value,
                    priceType: '1',
                    [key]: item,
                    currentPage: INIT_CONDITION.currentPage
                })
                setTab({})
                break
            case 'totalPrice':
                setSelected({
                    ...selected,
                    unitPrice: initial_value,
                    priceType: '2',
                    [key]: item,
                    currentPage: INIT_CONDITION.currentPage
                })
                setTab({})
                break
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

    const handleMoreReset = () => {
        setSelected({
            ...selected,
            propertyType: initial_value,
            renovationStatus: initial_value,
            saleStatus: initial_value
        })
    }

    const handleConfirm = () => {
        setTab({})
        fetchHouseList()
    }

    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/house/new/index/index?id=${item.id}`
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
            <ScrollView className="split-list flex-item" scrollY style={{ maxHeight: `${scrollHeight}px` }}>
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
                <ScrollView className="split-list flex-item" scrollY style={{ maxHeight: `${scrollHeight}px` }}>
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

    const renderMultiItem = (key: string, title: string = '') => {
        return (
            <View className="search-multi-item">
                {title && <View className="title">{title}</View>}
                <View className="options">
                    {
                        condition[key] &&
                        condition[key].map((item: any, index: number) => (
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

    const renderActivity = (houseItem: any) => {
        let activities: any[] = []
        if (houseItem.is_discount == '1') {
          activities.push({
            icon: 'iconcoupon',
            title: houseItem.fangHouseDiscount.title
          })
        }
        if (houseItem.is_group == '1') {
          activities.push({
            icon: 'iconstars',
            title: houseItem.fangHouseGroup.title
          })
        }
    
        return (
          <View className="house-activity" onClick={() => handleActivity(houseItem.id)}>
            <View className="activity-content">
              {
                activities.map((item: any, index: number) => {
                  if (index === 0) {
                    return (
                      <View className="activity-item" key={index}>
                        <Text className={classnames('iconfont', item.icon)}></Text>
                        <Text className="text">{item.title}</Text>
                      </View>
                    )
                  }
                  if (index > 0 && activity.includes(houseItem.id)) {
                    return (
                      <View className="activity-item" key={index}>
                        <Text className={classnames('iconfont', item.icon)}></Text>
                        <Text className="text">{item.title}</Text>
                      </View>
                    )
                  }
                })
              }
            </View>
            {
              activities.length > 1 &&
              <View className="activity-icon">
                <Text className={classnames('iconfont', activity.includes(houseItem.id) ? 'iconarrow-up-bold' : 'iconarrow-down-bold')}></Text>
              </View>
            }
          </View>
        )
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
                <View className={classnames('search-container', tab.type === 'price' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSubTabs()}
                            {renderSplitTabItem()}
                        </View>
                    </View>
                    {/* <View className="search-footer">
                        <Input className="search-input" placeholder="最低价" />-
                        <Input className="search-input" placeholder="最高价" />
                        <View className="btn confirm-btn single-btn">确定</View>
                    </View> */}
                </View>
                <View className={classnames('search-container', tab.type === 'room' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitTabItem()}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab.type === 'more' && 'actived')}>
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: `${scrollMoreHeight}px` }}>
                        {renderMultiItem('propertyType', '建筑类型')}
                        {renderMultiItem('renovationStatus', '装修状况')}
                        {renderMultiItem('saleStatus', '销售状态')}
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleMoreReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab.type && 'show')} onClick={() => setTab({})}></View>
            <View className="newhouse-content">
                <ScrollView
                    className="house-list"
                    scrollY
                    style={{ maxHeight: `${contentHeight - 108}px` }}
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
                            condition['projectFeature'] &&
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
                                            <Image className="taro-image" src={item.image_path} mode="aspectFill"></Image>
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
                                    {renderActivity(item)}
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