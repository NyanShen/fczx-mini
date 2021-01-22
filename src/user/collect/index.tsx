import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { ScrollView, View, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import '@styles/common/house.scss'
import './index.scss'
const PAGE_LIMIT = 10

interface IParam {
    cateId: string
    currentPage: number
}

const INIT_PARAM: IParam = { cateId: '1', currentPage: 1 }
const collectCate = [
    {
        id: '1',
        name: '新房'
    },
    {
        id: '2',
        name: '二手房'
    },
    {
        id: '3',
        name: '租房'
    }
]
const RENT_TYPE: any = {
    '1': '整租',
    '2': '合租'
}
const Collect = () => {
    const { contentHeight } = useNavData()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [collectList, setCollectList] = useState<any[]>([])

    const [activity, setActivity] = useState<string[]>([])

    useEffect(() => {
        fetchCollectList()
    }, [param])

    const fetchCollectList = () => {
        app.request({
            url: app.testApiUrl(api.getCollectList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                cateId: param.cateId
            }
        }).then((result: any) => {
            const totalPage = getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            setPage({
                totalCount: result.pagination.totalCount,
                totalPage
            })
            if (param.currentPage === INIT_PARAM.currentPage) {
                setCollectList(result.data)
            } else {
                setCollectList([...collectList, ...result.data])
            }
        })
    }
    const handleScrollToLower = () => {
        if (page.totalPage > param.currentPage) {
            setParam({
                ...param,
                currentPage: param.currentPage + 1
            })
        }
    }
    const handleCateChange = (cateId: string) => {
        setParam({
            cateId,
            currentPage: INIT_PARAM.currentPage
        })
    }
    const handleHouseItemClick = (item: any, type: string) => {
        Taro.navigateTo({
            url: `/house/${type}/index/index?id=${item.id}`
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
    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <Text className="price">待定</Text>
        } else {
            return <Text className="price">{price}<Text className="price-unit">{PRICE_TYPE[price_type]}</Text></Text>
        }
    }

    const renderHouse = () => {
        return (
            <View className="house-list-ul">
                {
                    collectList.map((item: any, index: number) => (
                        <View key={index} className="house-list-li">
                            <View className="house-content" onClick={() => handleHouseItemClick(item, 'new')}>
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
            </View>)
    }
    const renderEsf = () => {
        return <View className="house-list-ul">
            {
                collectList.map((item: any, index: number) => (
                    <View key={index} className="house-list-li">
                        <View className="house-content" onClick={() => handleHouseItemClick(item, 'esf')}>
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
    }
    const renderRent = () => {
        return (
            <View className="house-list-ul">
                {
                    collectList.map((item: any, index: number) => (
                        <View key={index} className="house-list-li">
                            <View className="house-content" onClick={() => handleHouseItemClick(item, 'rent')}>
                                <View className="house-image">
                                    <Image src={item.image_path} mode="aspectFill"></Image>
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
                                        {renderPrice(item.price, '3')}
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
        )
    }
    return (
        <View className="collect">
            <View className="collect-content">
                <View className="collect-cate">
                    {
                        collectCate.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleCateChange(item.id)}
                                className={classnames('collect-cate-item', param.cateId === item.id && 'actived')}
                            >{item.name}</View>
                        ))
                    }
                </View>
                {
                    collectList.length > 0 ?
                        <ScrollView
                            className="house-list"
                            scrollY
                            style={{ maxHeight: contentHeight }}
                            lowerThreshold={40}
                            onScrollToLower={handleScrollToLower}
                        >
                            {param.cateId === '1' && renderHouse()}
                            {param.cateId === '2' && renderEsf()}
                            {param.cateId === '3' && renderRent()}
                        </ScrollView> :
                        <View className="collect-empty">
                            <View className="empty-container">
                                <View className="iconfont iconempty"></View>
                                <View className="empty-text">暂无记录</View>
                            </View>
                        </View>
                }
            </View>
        </View>
    )

}

export default Collect