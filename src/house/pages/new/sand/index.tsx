import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {
    View,
    MovableArea,
    MovableView,
    Image,
    Text,
    Label,
    CheckboxGroup,
    Checkbox, ScrollView
} from '@tarojs/components'
import classnames from 'classnames'
import { includes } from 'lodash'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import '@styles/common/house.scss'
import '@house/styles/common.scss'
import './index.scss'

interface ISandState {
    value: string
    text: string
    checked: boolean
}

const INIT_SAND_STATE: ISandState[] = [
    {
        value: '1',
        text: '在售',
        checked: true
    },
    {
        value: '2',
        text: '待售',
        checked: true
    },
    {
        value: '3',
        text: '售完',
        checked: true
    }
]

interface IShowState {
    show: boolean
    text: string
}

const INIT_SAND_DATA = {
    sandBuilding: []
}

const INIT_SHOW_STATE = { show: true, text: '收起' }

const HouseSand = () => {
    const INTI_CURRENT = { id: '167' }
    const [movableView, setMovableView] = useState<any>({})
    const [showState, setShowState] = useState<IShowState>(INIT_SHOW_STATE)
    const [sandState, setSandState] = useState<ISandState[]>(INIT_SAND_STATE)
    const [sandData, setSandData] = useState<any>(INIT_SAND_DATA)
    const [roomData, setRoomData] = useState<any[]>([])
    const [current, setCurrent] = useState<any>(INTI_CURRENT)

    useEffect(() => {
        fetchSand()
    }, [])

    useEffect(() => {
        fetchRoom()
    }, [current.id])

    const winData = Taro.getSystemInfoSync()

    const handleSandImageLoad = (e: any) => {
        setMovableView({
            width: e.detail.width,
            height: e.detail.height
        })
    }

    const fetchSand = () => {
        app.request({
            url: app.testApiUrl(api.getHouseSand),
            data: {
                id: '194'
            }
        }).then((result: any) => {
            setSandData(result)
        })
    }

    const fetchRoom = () => {
        app.request({
            url: app.testApiUrl(api.getHouseSandRoom),
            data: {
                id: current.id
            }
        }).then((result: any) => {
            setRoomData(result)
        })
    }

    const toggleShowState = () => {
        setShowState({
            show: !showState.show,
            text: showState.show ? '展开' : '收起'
        })
    }

    const handleCheckboxChange = (e: any) => {
        const values = e.detail.value
        for (const item of sandState) {
            if (includes(values, item.value)) {
                item.checked = true
            } else {
                item.checked = false
            }
        }
        setSandState(sandState)
    }

    const switchCurrent = (item: any) => {
        setCurrent(item)
    }
    
    const handleRoomCheck = (item: any) => {
        console.log(item)
    }
    return (
        <View className="sand">
            <NavBar title="楼盘沙盘图"></NavBar>
            <View className="sand-wrapper">
                <View className="sand-card">
                    <MovableArea className="sand-area">
                        <MovableView
                            x={(winData.safeArea.width - movableView.width) / 2}
                            y={(300 - movableView.height) / 2}
                            style={movableView}
                            className="sand-view"
                            direction="all"
                            animation={false}
                        >
                            <Image className="sand-image" src={sandData.fang_sand_pic} onLoad={handleSandImageLoad}></Image>
                            {
                                sandData.sandBuilding.map((item: any, index: number) => (
                                    <View
                                        key={index}
                                        style={item.style}
                                        className={classnames('sand-item', `sale-status-${item.sale_status}`)}
                                        onClick={() => switchCurrent(item)}
                                    >
                                        <Text>{item.name}</Text>
                                        <Text className="triangle-down"></Text>
                                    </View>
                                ))
                            }
                        </MovableView>
                    </MovableArea>
                    <View className="sand-state">
                        <CheckboxGroup
                            onChange={handleCheckboxChange}
                            className={classnames('sand-state-box', !showState.show && 'hide')}
                        >
                            {
                                sandState.map((item: any, index: any) => (
                                    <Label
                                        key={index}
                                        for={index}
                                        className={classnames('check-label', `sale-status-${item.value}`)}
                                    >
                                        <Checkbox
                                            className="check-box"
                                            value={item.value}
                                            checked={item.checked}
                                        >
                                        </Checkbox>
                                        <Text className="check-text">{item.text}</Text>
                                    </Label>
                                ))
                            }
                        </CheckboxGroup>
                        <View className="sand-state-btn" onClick={toggleShowState}>{showState.text}</View>
                    </View>
                </View>
                <View className="sand-content">
                    <View className="sand-info">
                        <ScrollView
                            className="sand-info-header"
                            scrollX
                        >
                            <View className="sand-list">
                                {
                                    sandData.sandBuilding.map((item: any, index: number) => (
                                        <View
                                            key={index}
                                            className={classnames('sand-item', current.id === item.id && 'actived')}
                                            onClick={() => switchCurrent(item)}
                                        >{item.name}
                                        </View>
                                    ))
                                }
                            </View>
                        </ScrollView>
                        <View className="sand-info-detail">
                            <View className="sand-info-detail-content view-content">
                                <View className="detail-item">
                                    <Text>规划户数</Text>
                                    <Text></Text>
                                </View>
                                <View className="detail-item">
                                    <Text>楼层</Text>
                                    <Text></Text>
                                </View>
                                <View className="detail-item">
                                    <Text>梯户配比</Text>
                                    <Text></Text>
                                </View>
                            </View>
                            <View className="sand-info-detail-room mt20">
                                <View className="room-header">
                                    <Text className="title">户型</Text>
                                </View>
                                <View className="room-list">
                                    {
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
                                        })
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