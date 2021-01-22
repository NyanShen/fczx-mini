import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { ScrollView, View, Image, Text } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import useNavData from '@hooks/useNavData'
import { PRICE_TYPE } from '@constants/house'
import { getTotalPage, INIT_PAGE, IPage } from '@utils/page'
import '@styles/common/house.scss'
import './index.scss'
const PAGE_LIMIT = 10

interface IParam {
    currentPage: number
}

const INIT_PARAM: IParam = { currentPage: 1 }

const Collect = () => {
    const { contentHeight } = useNavData()
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [collectList, setCollectList] = useState<any[]>([])

    useEffect(() => {
        fetchCollectList()
    }, [param.currentPage])

    const fetchCollectList = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseList),
            data: {
                page: param.currentPage,
                limit: PAGE_LIMIT
            }
        }).then((result: any) => {
            const totalPage = getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            setPage({
                totalCount: result.pagination.totalCount,
                totalPage
            })
            setCollectList([...collectList, ...result.data])
        })
    }
    const handleScrollToLower = () => {
        if (page.totalPage > param.currentPage) {
            setParam({
                currentPage: param.currentPage + 1
            })
        }
    }
    const handleHouseItemClick = (item: any) => {
        Taro.navigateTo({
            url: `/house/new/index/index?id=${item.id}`
        })
    }
    const renderPrice = (price: string, price_type: string) => {
        if (price === '0') {
            return <Text className="price">待定</Text>
        } else {
            return <Text className="price">{price}<Text className="price-unit">{PRICE_TYPE[price_type]}</Text></Text>
        }
    }
    return (
        <View className="collect">
            <View className="collect-content">
                
                {
                    collectList.length > 0 ?
                        <ScrollView
                            className="house-list"
                            scrollY
                            style={{ maxHeight: contentHeight }}
                            lowerThreshold={40}
                            onScrollToLower={handleScrollToLower}
                        >
                            <View className="house-list-ul">
                                {
                                    collectList.map((item: any) => (
                                        <View key={item.id} className="house-list-li">
                                            <View className="house-content" onClick={() => handleHouseItemClick(item)}>
                                                <View className="house-image">
                                                    <Image src={item.image_path} mode="aspectFill"></Image>
                                                </View>
                                                <View className="house-text">
                                                    <View className="text-item title mb8">
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
                                        </View>
                                    ))
                                }
                            </View>
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