import React, { useState, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { ScrollView, View, Image, Text } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'

import '@styles/common/bottom-bar.scss'
import './index.scss'

interface IParam {
    currentPage: number,
    room?: string
}

const INIT_PARAM = {
    currentPage: 1,
    room: ''
}

const INIT_HOUSE_TYPE = { roomCount: { total: 0, list: [] }, roomList: [] }
const HouseType = () => {
    const PAGE_LIMIT = 20
    const fixedHeight = 50
    let router: any = getCurrentInstance().router
    const houseId = router?.params.id
    const { contentHeight } = useNavData()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [houseType, setHouseType] = useState<any>(INIT_HOUSE_TYPE)

    useEffect(() => {
        fetchRoomList()
    }, [param])

    const fetchRoomList = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseTypeList),
            data: {
                room: param.room,
                page: param.currentPage,
                limit: PAGE_LIMIT,
                fang_house_id: houseId || '1000006',
            }
        }).then((result: any) => {
            const pagination = result.roomList.pagination
            setPage({
                totalCount: pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, pagination.totalCount)
            })

            if (param.currentPage === 1) {
                setHouseType({
                    roomCount: result.roomCount,
                    roomList: result.roomList.data
                })
            } else {
                setHouseType({
                    roomCount: result.roomCount,
                    roomList: [...houseType.roomList, ...result.roomList.data]
                })
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
    const switchRoom = (roomParam: string) => {
        if (param.room !== roomParam) {
            setParam({
                room: roomParam,
                currentPage: INIT_PARAM.currentPage
            })
        }
    }

    const toDetail = (item: any) => {
        Taro.navigateTo({
            url: `/house/new/type/detail?id=${item.id}&houseId=${houseId}`
        })
    }
    return (
        <View className="house-type">
            <NavBar title="全部户型" back={true}></NavBar>
            <View className="fixed">
                <ScrollView className="type-tabs" scrollX>
                    <View className={classnames('tab-item', !param.room && 'actived')} onClick={() => switchRoom('')}>
                        全部({houseType.roomCount.total})
                    </View>
                    {
                        houseType.roomCount.list.map((item: any, index: number) => (
                            <View
                                key={index}
                                className={classnames('tab-item', item.room === param.room && 'actived')}
                                onClick={() => switchRoom(item.room)}
                            >
                                {item.room}室（{item.count}）
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
            <View className="type-content">
                <ScrollView
                    scrollY
                    className="type-list"
                    style={{ maxHeight: contentHeight - fixedHeight }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {
                        houseType.roomList.map((item: any, index: number) => (
                            <View key={index} className="type-item" onClick={() => toDetail(item)}>
                                <View className="type-image">
                                    <Image src={item.image_path} mode="aspectFill"></Image>
                                </View>
                                <View className="type-info">
                                    <View className="title">{item.room}室{item.office}厅{item.toilet}卫  {item.building_area}m²</View>
                                    <View className="price">
                                        {
                                            item.price == '0' ? '售价待定' : <Text>{item.price}{PRICE_TYPE[item.price_type]}</Text>
                                        }
                                    </View>
                                    <View className="type">{item.name}</View>
                                    <View className="tags">
                                        <Text className={classnames('tags-item', `sale-status-${item.sale_status}`)}>{SALE_STATUS[item.sale_status]}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                    <View className="empty-container">
                        <Text>没有更多数据了</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default HouseType