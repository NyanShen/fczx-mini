import React, { useEffect, useState } from 'react'
import Taro, { getCurrentPages, useDidShow } from '@tarojs/taro'
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
        const pages: any = getCurrentPages()
        const currPageData: any = pages[pages.length - 1].data
        const isUpdate = currPageData.isUpdate
        if (isUpdate) {
            fetchList()
        }
    })

    useEffect(() => {
        fetchList(param.currentPage)
    }, [param])

    const fetchList = (currentPage: number = 1) => {
        app.request({
            url: app.areaApiUrl(api.getRentSaleList),
            data: {
                page: currentPage,
                limit: PAGE_LIMIT
            }
        }).then((result: any) => {
            setPage({
                ...page,
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
            if (currentPage === 1) {
                setList(result.data)
            } else {
                setList([...list, ...result.data])
            }
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
            url: `/house/manage/rent/sale?id=${id}`
        })
    }

    const handleDelete = (id: string) => {
        Taro.showModal({
            title: '提示',
            content: '确定删除该条房源记录？',
            success: (res: any) => {
                if (res.confirm) {
                    rentDelete(id)
                }
            }
        })
    }

    const rentDelete = (id: string) => {
        app.request({
            url: app.apiUrl(api.rentDelete),
            method: 'POST',
            data: { id }
        }).then(() => {
            fetchList()
            Taro.showToast({
                icon: 'none',
                title: '删除成功'
            })
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
                                    <Text className="price">{item.price}<Text className="price-unit">元/月</Text></Text>
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
                            <View className="action-item" onClick={() => handleDelete(item.id)}>
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