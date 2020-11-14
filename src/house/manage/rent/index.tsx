import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { ScrollView, View, Text, Image } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import '../index.scss'

interface IParam {
    currentPage: number
}

const INIT_PARAM = { currentPage: 1 }

const HouseManageRent = () => {
    const PAGE_LIMIT = 10
    const { contentHeight } = useNavData()
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [list, setList] = useState<any[]>([])

    useDidShow(() => {
        fetchList()
    })

    useEffect(() => {
        fetchList()
    }, [param])

    const fetchList = () => {
        app.request({
            url: app.areaApiUrl(api.getRentSaleList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT
            }
        }).then((result: any) => {
            setList([...list, ...result.data])
            setPage({
                ...page,
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
        })
    }

    const handleScrollToLower = () => {
        if (page.totalPage > param.currentPage) {
            setParam({
                ...param,
                currentPage: param.currentPage + 1
            })
        } else {
            setShowEmpty(true)
        }
    }

    const toRentSale = (id: string = '') => {
        Taro.navigateTo({
            url: `/house/rent/sale/index?id=${id}`
        })
    }

    const renderList = () => (
        <View className="house-list">
            {
                list.map((item: any, index: number) => (
                    <View key={index} className="house-list-item">
                        <View className="item-image">
                            <Image src={item.image_path} mode="aspectFill"></Image>
                        </View>
                        <View className="item-content">
                            <View className="item-title">{item.title}</View>
                            <View className="item-text item-text-small">
                                <View className="right">
                                    <Text>{item.room}室{item.office}厅{item.toilet}卫</Text>
                                    <Text className="line-split"></Text>
                                    <Text>{item.building_area}m²</Text>
                                </View>
                            </View>
                            <View className="item-text">
                                <View className="right">
                                    <Text className="price">{item.price_total}<Text className="price-unit">万</Text></Text>
                                </View>
                            </View>
                            <View className="item-text item-text-middle">
                                <View className="right">
                                    <Text className="item-city">[{item.city.name}]</Text>
                                    <Text>{item.area.name}</Text>
                                    <Text>-</Text>
                                    <Text>{item.fangHouse.title}</Text>
                                </View>
                            </View>
                        </View>
                        <View className="item-action">
                            <View className="action-item" onClick={() => toRentSale(item.id)}>
                                <View className="btn btn-plain">修改</View>
                            </View>
                            <View className="action-item">
                                <View className="btn btn-plain">删除</View>
                            </View>
                        </View>
                    </View>
                ))
            }
        </View>
    )

    const renderEmpty = () => (
        <View className="empty-container empty-container-center">
            <View className="iconfont iconempty"></View>
            <View className="empty-text">您还没有发布房源信息</View>
            <View className="btn btn-primary empty-btn" onClick={() => toRentSale()}>立即发布</View>
        </View>
    )

    return (
        <View className="house-manage">
            <NavBar title="管理出租" back={true}></NavBar>
            <View className="house-content">
                <ScrollView
                    scrollY
                    style={{ maxHeight: contentHeight }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {list.length > 0 ? renderList() : renderEmpty()}
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

export default HouseManageRent