import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { formatTimestamp } from '@utils/index'

import './index.scss'
const HouseComment = () => {
    const { contentHeight } = useNavData()
    const [totalCount, setTotalCount] = useState<number>(0)
    const [commentList, setCommentList] = useState<any[]>([])

    useEffect(() => {
        fetchHouseComment()
    }, [])

    const fetchHouseComment = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseComment),
            data: {
                page: 0,
                limit: 10,
                fang_house_id: '1000006',
            }
        }).then((result: any) => {
            setCommentList(result.data)
            setTotalCount(result.pagination.totalCount)
        })
    }

    const handleScrollToLower = (e: any) => {
        console.log("handleScrollToLower", e)
    }
    return (
        <View className="comment">
            <NavBar title="评论" back={true}></NavBar>
            <View className="comment-header">
                <View className="title view-content">全部评论({totalCount})</View>
            </View>
            <View className="comment-content">
                <ScrollView
                    className="comment-list"
                    scrollY
                    style={{ height: contentHeight }}
                    onScrollToLower={handleScrollToLower}
                >
                    {
                        commentList.map((item: any, index: number) => (
                            <View key={index} className="comment-item">
                                <View className="user-photo">
                                    <Image src={item.user.avatar} />
                                </View>
                                <View className="context">
                                    <View className="context-name">{item.user.nickname}</View>
                                    <View className="context-content">{item.content}</View>
                                    {
                                        item.image_path &&
                                        <View className="context-image">
                                            <Image src={item.image_path} />
                                        </View>
                                    }
                                    <View className="context-footer">
                                        <View className="date">{formatTimestamp(item.modified, 'yy-MM-dd')}</View>
                                        <View className="action">
                                            <Text className="zan">{item.like_num}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </View>
    )
}

export default HouseComment