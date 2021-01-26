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

const Collect = () => {
    const { contentHeight } = useNavData()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [collectList, setCollectList] = useState<any[]>([])

    useEffect(() => {
        fetchCollectList()
    }, [param])

    const fetchCollectList = () => {
        app.request({
            url: app.areaApiUrl(api.getCollectList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT,
                type: param.cateId
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
        setCollectList([])
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
                    collectList.map((collectItem: any, index: number) => {
                        const item = collectItem.fangHouse
                        return (
                            <View key={index} className="house-list-li">
                                <View className="house-content" onClick={() => handleHouseItemClick(item, 'new')}>
                                    <View className="house-image">
                                        <Image src={item.image_path} mode="aspectFill"></Image>
                                    </View>
                                    <View className="house-text">
                                        <View className="text-item title mb8">
                                            <Text>{item.title}</Text>
                                        </View>
                                        <View className="text-item title mb8">
                                            <Text className={classnames('sale-status', `sale-status-${item.sale_status}`)}>{SALE_STATUS[item.sale_status]}</Text>
                                        </View>
                                        <View className="mb12">
                                            {renderPrice(item.price, item.price_type)}
                                        </View>

                                    </View>
                                </View>

                            </View>
                        )
                    })
                }
            </View>)
    }
    const renderEsf = () => {
        return <View className="house-list-ul">
            {
                collectList.map((collectItem: any, index: number) => {
                    const item = collectItem.esf
                    return (
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

                                </View>
                            </View>
                        </View>
                    )
                })
            }
        </View>
    }
    const renderRent = () => {
        return (
            <View className="house-list-ul">
                {
                    collectList.map((collectItem: any, index: number) => {
                        const item = collectItem.rent
                        return (
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
                                    </View>
                                </View>
                            </View>
                        )
                    })
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