import React, { useEffect, useMemo, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import {
    View,
    Text,
    ScrollView
} from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import SandCommon from '@house/new/sand/common'
import '@styles/common/house.scss'
import './index.scss'

const INIT_SAND_BUILDING = []

const HouseSand = () => {
    let currentRouter: any = getCurrentInstance().router
    let params: any = currentRouter.params
    const currentBuilding = JSON.parse(params.currentBuilding)
    const [sandBuilding, setSandBuilding] = useState<any>(INIT_SAND_BUILDING)
    const [current, setCurrent] = useState<any>(currentBuilding)
    const [roomData, setRoomData] = useState<any[]>([])

    useEffect(() => {
        fetchRoom()
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

    const handleRoomCheck = (item: any) => {
        Taro.navigateTo({
            url: `/house/new/type/detail?id=${item.id}&houseId=${params.id}`
        })
    }

    const getSandCommonComponent = useMemo(() => {
        return (
            <SandCommon
                houseId={params.id}
                outerHeight={300}
                currentBuilding={current}
                setCurrentBuilding={(currentBuilding) => setCurrent(currentBuilding)}
                updateSandBuilding={(sandBuilding) => setSandBuilding(sandBuilding)}
            />
        )
    }, [current])

    return (
        <View className="sand">
            <NavBar title={`${params.title}沙盘图`} back={true}></NavBar>
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