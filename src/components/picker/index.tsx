import React, { useEffect, useRef, useState } from 'react'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import classnames from 'classnames'
import findIndex from 'lodash/findIndex'

import './index.scss'

export interface IPicker {
    item: any,
    name: string
    show: boolean
    list: any[]
}

export const INIT_PICKER: IPicker = {
    item: {},
    name: '',
    show: false,
    list: []
}

interface IProps extends IPicker {
    onConfirm: (any) => void
}

const CustomPicker = (props: IProps) => {
    const { item, list, show, onConfirm } = props
    const [pickEnd, setPickEnd] = useState<boolean>(true)
    const [current, setCurrent] = useState<any>({})
    const ref = useRef({})

    useEffect(() => {
        //同一个生成过程需要setTimeout
        setTimeout(() => {
            const index = findIndex(list, { name: item.name })
            if (index !== -1) {
                setCurrent({ ...item, index })
                ref.current = { ...item, index }
            } else {
                setCurrent(item)
                ref.current = item
            }
        }, 0);
    }, [item])

    const handleChange = (e: any) => {
        const index = e.detail.value[0]
        setCurrent({ ...list[index], index })
        setPickEnd(true)
    }

    const handlePickStart = () => {
        setPickEnd(false)
    }

    // handleChange执行玩了在执行
    const handleConfirm = () => {
        if (pickEnd) {
            onConfirm(current.index ? current : list[0])
        }
    }

    // handleChange执行玩了在执行
    const handleCancel = () => {
        if (pickEnd) {
            setCurrent(ref.current)
            onConfirm(null)
        }
    }
    return (
        <View className={classnames('picker', show && 'show')}>
            <View className="mask show" onClick={handleCancel}></View>
            <View className="picker-content">
                <View className="dialog-header">
                    <View className="dialog-button cancel" onClick={() => handleCancel()}>取消</View>
                    <View className="dialog-button" onClick={() => handleConfirm()}>确定</View>
                </View>
                <PickerView
                    className='picker-view-wrap'
                    onChange={handleChange}
                    onPickStart={handlePickStart}
                    value={[current.index]}
                >
                    <PickerViewColumn>
                        {
                            list.map((item: any, index: number) => {
                                return <View className="picker-item" key={index}>{item.name}</View>
                            })
                        }
                    </PickerViewColumn>
                </PickerView>
            </View>
        </View>
    )
}

export default CustomPicker