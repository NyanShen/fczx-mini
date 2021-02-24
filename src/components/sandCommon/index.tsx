import React, { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import {
    View,
    Image,
    Text,
    Label,
    CheckboxGroup,
    Checkbox,
    MovableArea,
    MovableView
} from '@tarojs/components'
import classnames from 'classnames'
import find from 'lodash/find'
import includes from 'lodash/includes'

import api from '@services/api'
import app from '@services/request'
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

interface IProps {
    houseId: string,
    outerWidth?: number,
    outerHeight: number,
    buildId?: string,
    setCurrentBuilding: (any) => void,
    updateSandBuilding: (any) => void
}

let lastPointX: number = 0
let lastPointY: number = 0
let imgTop: number = 0
let imgLeft: number = 0
let maxLeft: number = 0
let maxTop: number = 0

const SandCommon = (props: IProps) => {
    const { houseId, outerHeight, buildId = '' } = props
    const [movableView, setMovableView] = useState<any>({})
    const [showState, setShowState] = useState<IShowState>(INIT_SHOW_STATE)
    const [sandState, setSandState] = useState<ISandState[]>(INIT_SAND_STATE)
    const [sandData, setSandData] = useState<any>(INIT_SAND_DATA)
    const [sandBuilding, setSandBuilding] = useState<any>(INIT_SAND_DATA.sandBuilding)
    const [current, setCurrent] = useState<any>({})
    const screenWidth = Taro.getSystemInfoSync().screenWidth
    const outerWidth = props.outerWidth ? props.outerWidth : screenWidth

    useEffect(() => {
        fetchSand()
    }, [houseId])

    useEffect(() => {
        if (buildId && sandBuilding.length > 0) {
            setCurrent(find(sandBuilding, { id: buildId }))
        }
    }, [buildId])

    const setImageRealSize = (fang_sand_pic: string) => {
        Taro.getImageInfo({
            src: fang_sand_pic,
            success: (result: any) => {
                setMovableView({
                    width: result.width,
                    height: result.height,
                    centerX: (outerWidth - result.width) / 2,
                    centerY: (outerHeight - result.height) / 2
                })
            }
        })
    }

    const fetchSand = () => {
        app.request({
            url: app.areaApiUrl(api.getHouseSand),
            data: {
                id: houseId
            }
        }, { loading: false }).then((result: any) => {
            setSandData(result)
            setImageRealSize(result.fang_sand_pic)
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

    const handleTouchStart = (e: any) => {
        const sandView: any = document.getElementsByClassName('sand-view')[0]
        maxLeft = outerWidth - movableView.width
        maxTop = outerHeight - movableView.height
        lastPointX = e.touches[0].clientX;
        lastPointY = e.touches[0].clientY;
        imgLeft = parseFloat(sandView.style.left)
        imgTop = parseFloat(sandView.style.top)
    }

    const handleTouchMove = (e: any) => {
        e.preventDefault();
        let changeX = e.touches[0].clientX - lastPointX;
        let changeY = e.touches[0].clientY - lastPointY;
        let disX = imgLeft + changeX;
        let disY = imgTop + changeY;
        setMovableView({
            ...movableView,
            centerX: Math.max(Math.min(disX, 0), maxLeft),
            centerY: Math.max(Math.min(disY, 0), maxTop)
        })
    }

    const renderSandBuilding = () => {
        return sandBuilding.map((item: any, index: number) => (
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

    const renderMovableView = () => {
        const { width, height, centerX, centerY } = movableView
        return IS_H5 ?
            (
                <View className="sand-area">
                    <View
                        className="sand-view"
                        style={{
                            width: `${width}px`,
                            height: `${height}px`,
                            left: `${centerX}px`,
                            top: `${centerY}px`
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                    >
                        <Image className="taro-image" src={sandData.fang_sand_pic} />
                        {renderSandBuilding()}
                    </View>
                </View>
            ) :
            (
                <MovableArea className="sand-area">
                    <MovableView
                        x={centerX}
                        y={centerY}
                        style={{ width, height }}
                        className="sand-view"
                        direction="all"
                        animation={false}
                    >
                        <Image className="taro-image" src={sandData.fang_sand_pic} />
                        {renderSandBuilding()}
                    </MovableView>
                </MovableArea>
            )
    }

    return (
        <View className="sand-card" style={{ width: '100%', height: `${outerHeight}px` }}>
            {renderMovableView()}
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