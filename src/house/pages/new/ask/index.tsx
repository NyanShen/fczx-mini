import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'
import { toUrlParam } from '@utils/urlHandler'
import { IPage, INIT_PAGE, getTotalPage } from '@utils/page'

import './index.scss'

const HouseAsk = () => {
    const PAGE_LIMIT = 10
    const router = getCurrentInstance().router
    const houseId = router?.params.id
    const houseTitle = router?.params.title
    const { contentHeight } = useNavData()
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [page, setPage] = useState<IPage>(INIT_PAGE)
    const [askList, setAskList] = useState<any[]>([])

    useEffect(() => {
        fetchHouseAsk()
    }, [page.currentPage])


    const fetchHouseAsk = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseAsk),
            data: {
                page: page.currentPage,
                limit: PAGE_LIMIT,
                fang_house_id: houseId || '1000006',
            }
        }).then((result: any) => {
            setAskList([...askList, ...result.data])
            setPage({
                ...page,
                totalCount: result.pagination.totalCount,
                totalPage: getTotalPage(PAGE_LIMIT, result.pagination.totalCount)
            })
        })
    }

    const handleScrollToLower = () => {
        if (page.totalPage > page.currentPage) {
            setPage({
                ...page,
                currentPage: page.currentPage + 1
            })
        } else {
            setShowEmpty(true)
        }
    }
    const toHouseModule = (module: string) => {
        const paramString = toUrlParam({
            id: houseId,
            title: houseTitle
        })
        Taro.navigateTo({
            url: `/house/pages/new/${module}/index${paramString}`
        })
    }
    return (
        <View className="ask">
            <NavBar title="大家都在问" back={true}></NavBar>
            <View className="ask-header">
                <View className="title view-content">
                    关于【{houseTitle}】的
                    <Text className="count">{page.totalCount}个</Text>
                    问题</View>
            </View>
            <View className="ask-content">
                <ScrollView
                    className="ask-list"
                    scrollY
                    style={{ height: contentHeight - 80 }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {
                        askList.map((item: any, index: number) => (
                            <View key={index} className="question-item">
                                <View className="question">
                                    <Text className="iconfont iconwen"></Text>
                                    <Text className="text">{item.title}</Text>
                                </View>
                                <View className="question">
                                    <Text className="iconfont iconda"></Text>
                                    <Text className="text da">{item.reply_content ? item.reply_content : '暂无回答'}</Text>
                                </View>
                                <View className="small-desc">{formatTimestamp(item.modified, 'yy-MM-dd')}</View>
                            </View>
                        ))
                    }
                    {
                        showEmpty &&
                        <View className="empty-container">
                            <Text>没有更多数据了</Text>
                        </View>
                    }
                </ScrollView>
            </View>
            <View className="fixed ask-footer" onClick={() => toHouseModule('askForm')}>
                <View className="btn btn-primary">我要提问</View>
            </View>
        </View>
    )
}

export default HouseAsk