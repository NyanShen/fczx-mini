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
    Checkbox
} from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import includes from 'lodash/includes'

import api from '@services/api'
import app from '@services/request'
import './common.scss'

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

interface IProps {
    houseId: string,
    outerWidth?: number,
    outerHeight: number,
    currentBuilding?: any,
    setCurrentBuilding: (any) => void,
    updateSandBuilding: (any) => void
}

const SandCommon = (props: IProps) => {
    const { houseId, outerHeight, currentBuilding = {} } = props
    const [movableView, setMovableView] = useState<any>({})
    const [showState, setShowState] = useState<IShowState>(INIT_SHOW_STATE)
    const [sandState, setSandState] = useState<ISandState[]>(INIT_SAND_STATE)
    const [sandData, setSandData] = useState<any>(INIT_SAND_DATA)
    const [sandBuilding, setSandBuilding] = useState<any>(INIT_SAND_DATA.sandBuilding)
    const [current, setCurrent] = useState<any>({})
    const safeArea = Taro.getSystemInfoSync().safeArea
    const outerWidth = props.outerWidth ? props.outerWidth : safeArea.width

    useEffect(() => {
        fetchSand()
    }, [houseId])

    useEffect(() => {
        setCurrent(currentBuilding)
    }, [currentBuilding])

    const handleSandImageLoad = (e: any) => {
        setMovableView({
            width: e.detail.width,
            height: e.detail.height
        })
    }

    const fetchSand = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseSand),
            data: {
                id: houseId
            }
        }).then((result: any) => {
            setSandData(result)
            showSandBuilding(INIT_SAND_STATE, result.sandBuilding)
            props.updateSandBuilding(result.sandBuilding)
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
        showSandBuilding(sandState, sandData.sandBuilding)
    }

    const showSandBuilding = (sandState, allSandBUilding) => {
        let sandBuilding: any[] = []
        for (const item of allSandBUilding) {
            const target = find(sandState, { value: item.sale_status })
            if (target.checked) {
                sandBuilding.push(item)
            }
        }
        setSandBuilding(sandBuilding)
    }

    const switchCurrent = (item: any) => {
        props.setCurrentBuilding(item)
    }

    return (
        <View className="sand-card" style={{ width: '100%', height: outerHeight }}>
            <MovableArea className="sand-area">
                <MovableView
                    x={(outerWidth - movableView.width) / 2}
                    y={(outerHeight - movableView.height) / 2}
                    style={movableView}
                    className="sand-view"
                    direction="all"
                    animation={false}
                >
                    <Image
                        className="sand-image"
                        src={sandData.fang_sand_pic}
                        onLoad={handleSandImageLoad}
                    />
                    {
                        sandBuilding.map((item: any, index: number) => (
                            <View
                                key={index}
                                style={item.style}
                                className={classnames('sand-item', `sale-status-${item.sale_status}`, current.id === item.id && 'actived')}
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
                                    id={index}
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
    )
}
export default SandCommon