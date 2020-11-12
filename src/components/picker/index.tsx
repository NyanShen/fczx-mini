import React, { useState } from 'react'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import classnames from 'classnames'

import './index.scss'

export interface IPicker {
    name: string
    show: boolean
    list: any[]
}

export const INIT_PICKER: IPicker = {
    name: '',
    show: false,
    list: []
}

interface IProps extends IPicker {
    onConfirm: (any) => void
}

const CustomPicker = (props: IProps) => {
    const { list, show, onConfirm } = props
    const [current, setCurrent] = useState<any>(null)

    const handleChange = (e: any) => {
        const index = e.detail.value[0]
        setCurrent(list[index])
    }

    const handleConfirm = (isConfirm: boolean) => {
        if (isConfirm) {
            onConfirm(current || list[0])
        } else {
            onConfirm(null)
        }
    }
    return (
        <View className={classnames('picker', show && 'show')}>
            <View className="mask show" onClick={() => onConfirm(null)}></View>
            <View className="picker-content">
                <View className="dialog-header">
                    <View className="dialog-button cancel" onClick={() => handleConfirm(false)}>取消</View>
                    <View className="dialog-button" onClick={() => handleConfirm(true)}>确定</View>
                </View>
                <PickerView className='picker-view-wrap' onChange={handleChange}>
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