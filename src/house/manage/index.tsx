import React, { useState } from 'react'
import { ScrollView, View, Text } from '@tarojs/components'
import classnames from 'classnames'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { INIT_PAGE, IPage } from '@utils/page'
import './index.scss'

const houseCates = [
    {
        id: '1',
        type: 'sale',
        name: '出售房源'
    },
    {
        id: '2',
        type: 'rent',
        name: '出租房源'
    }
]
interface IParam {
    currentPage: number
}

const INIT_PARAM = { currentPage: 1 }
const HouseManage = () => {
    // const PAGE_LIMIT = 10
    const { contentHeight } = useNavData()
    const [showEmpty, setShowEmpty] = useState<boolean>(false)
    const [page] = useState<IPage>(INIT_PAGE)
    const [param, setParam] = useState<IParam>(INIT_PARAM)
    const [houseCate, setHouseCate] = useState<any>(houseCates[0])
    const handleCateChange = (item: any) => {
        setHouseCate(item)
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

    return (
        <View className="house-manage">
            <NavBar title="房源管理" back={true}></NavBar>
            <View className="house-cate">
                <ScrollView scrollX>
                    {
                        houseCates.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleCateChange(item)}
                                className={classnames('house-cate-item', houseCate.id === item.id && 'actived')}
                            >{item.name}</View>
                        ))
                    }
                </ScrollView>
            </View>
            <View className="house-content">
                <ScrollView
                    scrollY
                    style={{ maxHeight: contentHeight - 42 }}
                    lowerThreshold={40}
                    onScrollToLower={handleScrollToLower}
                >
                    {
                        showEmpty &&
                        <View className="empty-container">
                            <Text>没有更多数据了</Text>
                        </View>
                    }
                </ScrollView>
                <View className="empty-container">
                    <View className="iconfont iconempty"></View>
                    <View className="empty-text">您还没有发布房源信息</View>
                    <View className="btn btn-primary empty-btn">立即发布</View>
                </View>
            </View>
        </View>
    )
}

export default HouseManage