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

const INIT_SHOW_STATE = { show: true, text: '收起' }

const HouseSand = () => {
    const [movableView, setMovableView] = useState<any>({})
    const [showState, setShowState] = useState<IShowState>(INIT_SHOW_STATE)
    const [sandState, setSadState] = useState<ISandState[]>(INIT_SAND_STATE)
    const [sandData, setSandData] = useState<any>({})

    useEffect(() => {
        fetchSandData()
    }, [])

    const winData = Taro.getSystemInfoSync()

    const handleSandImageLoad = (e: any) => {
        setMovableView({
            width: e.detail.width,
            height: e.detail.height
        })
    }

    const fetchSandData = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseSand),
            data: {
                id: '194'
            }
        }).then((result: any) => {
            setSandData(result)
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
            console.log(values, item.value, includes(values, item.value))
            if (includes(values, item.value)) {
                item.checked = true
            } else {
                item.checked = false
            }
        }
        setSadState(sandState)
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
                                sandData.sandBuilding &&
                                sandData.sandBuilding.length > 0 &&
                                sandData.sandBuilding.map((item: any, index: number) => (
                                    <View
                                        key={index}
                                        className={classnames('sand-item', `sale-status-${item.sale_status}`)}
                                        style={item.style}
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
                                <View className="sand-item">11#</View>
                                <View className="sand-item actived">11#</View>
                                <View className="sand-item">11#</View>
                                <View className="sand-item">11#</View>
                                <View className="sand-item">11#</View>
                                <View className="sand-item">11#</View>
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
                                    <View className="room-item">
                                        <Text className="item-text">D户型高层</Text>
                                        <Text className="item-text">2房2室2厅1卫</Text>
                                        <Text className="item-text">100㎡</Text>
                                        <Text className="item-btn">查看</Text>
                                    </View>
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