import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance, useReady, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import {
    View,
    Text,
    ScrollView
} from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'

import api from '@services/api'
import app from '@services/request'
import SandCommon from '@components/sandCommon/index'
import '@styles/common/house.scss'
import './index.scss'

const INIT_SAND_BUILDING = []

const HouseSand = () => {
    const params: any = getCurrentInstance().router?.params
    const houseTitle = decodeURIComponent(params.title)
    const [sandBuilding, setSandBuilding] = useState<any>(INIT_SAND_BUILDING)
    const [current, setCurrent] = useState<any>({})
    const [roomData, setRoomData] = useState<any[]>([])

    useReady(() => {
        Taro.setNavigationBarTitle({ title: `${houseTitle}沙盘图` })
    })

    useShareTimeline(() => {
        return {
            title: `${houseTitle}沙盘图`,
            path: `/house/new/sand/index?id=${current.id}&title=${houseTitle}&share=true`
        }
    })

    useShareAppMessage(() => {
        return {
            title: `${houseTitle}沙盘图`,
            path: `/house/new/sand/index?id=${current.id}&title=${houseTitle}&share=true`
        }
    })

    useEffect(() => {
        if (current.id) {
            fetchRoom()
        }
    }, [current.id])


    const fetchRoom = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseSandRoom),
            data: {
                id: current.id
            }
        }).then((result: any) => {
            setRoomData(result)
        })
    }

    const handleSandBuildingChange = (sandBuilding: any[]) => {
        setSandBuilding(sandBuilding)
        if (params.buildId) {
            setCurrent(find(sandBuilding, { id: params.buildId }))
        } else {
            setCurrent(sandBuilding[0])
        }
    }

    const handleRoomCheck = (item: any) => {
        Taro.navigateTo({
            url: `/house/new/type/detail?id=${item.id}&houseId=${params.id}`
        })
    }

    const getSandCommonComponent = useMemo(() => {
        return (
            <SandCommon
                houseId={params.id}
                outerHeight={350}
                buildId={current.id}
                setCurrentBuilding={(currentBuilding) => setCurrent(currentBuilding)}
                updateSandBuilding={handleSandBuildingChange}
            />
        )
    }, [current])

    return (
        <View className="sand">
            <View className="sand-wrapper">
                {getSandCommonComponent}
                <View className="sand-content">
                    <View className="sand-info">
                        <ScrollView
                            className="sand-info-header"
                            scrollX
                            scrollIntoView={`view_${current.id}`}
                        >
                            <View className="sand-list">
                                {
                                    sandBuilding.map((item: any, index: number) => (
                                        <View
                                            key={index}
                                            id={`view_${item.id}`}
                                            className={classnames('sand-item', current.id === item.id && 'actived')}
                                            onClick={() => setCurrent(item)}
                                        >{item.name}
                                        </View>
                                    ))
                                }
                            </View>
                        </ScrollView>
                        <View className="sand-info-detail">
                            <View className="sand-info-detail-content view-content">
                                <View className="detail-item">
                                    <Text className="label">规划户数：</Text>
                                    <Text>{current.plan_households}</Text>
                                </View>
                                <View className="detail-item">
                                    <Text className="label">楼层：</Text>
                                    <Text>{current.storey_height}</Text>
                                </View>
                                <View className="detail-item">
                                    <Text className="label">梯户配比：</Text>
                                    <Text>{current.elevator_number}梯{current.elevator_households}户</Text>
                                </View>
                            </View>
                            <View className="sand-info-detail-room mt20">
                                <View className="room-header">
                                    <Text className="title">户型</Text>
                                </View>
                                <View className="room-list">
                                    {
                                        roomData.length > 0 ?
                                            roomData.map((item: any, index: number) => {
                                                const itemData = item.fangHouseBuildingRoom
                                                return (
                                                    <View key={index} className="room-item">
                                                        <Text className="item-text">{itemData.name}</Text>
                                                        <Text className="item-text">{itemData.room}室{itemData.office}厅{itemData.toilet}卫</Text>
                                                        <Text className="item-text">{itemData.building_area}㎡</Text>
                                                        <Text className="item-btn" onClick={() => handleRoomCheck(itemData)}>查看</Text>
                                                    </View>
                                                )
                                            }) :
                                            <View className="room-item">
                                                <Text className="item-text">暂无数据</Text>
                                            </View>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HouseSand