import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'

import './index.scss'

interface IProps {
    meetCount: number
    dataList?: any[]
}

const CustomProgress = (props: IProps) => {
    const { dataList = [], meetCount } = props
    const [progressData, setProgressData] = useState<any>({ dataList: [] })

    useEffect(() => {
        filterDataList()
    }, [])

    const filterDataList = () => {
        let widthPercent = '0'
        const totalCount = dataList.length
        if (totalCount < 2) {
            dataList[0].left = '86%'
            widthPercent = `${(meetCount / dataList[0].needCount) * 100}%`
        } else if (totalCount < 3) {
            dataList[0].left = '36%'
            dataList[1].left = '86%'
            if (meetCount < dataList[0].needCount) {
                widthPercent = `${(meetCount / dataList[1].needCount) * 100}%`
            }
        } else {

        }
        setProgressData({ widthPercent, dataList })
    }

    return (
        <View className="progress">
            <View className="progress-linear">
                <Text className="progress-linearbar" style={{ width: progressData.widthPercent }}></Text>
            </View>
            <View className="progress-nodebar">
                <View className="node-circle"></View>
                <View className="node-count">0</View>
            </View>
            {
                progressData.dataList.map((item: any, index: number) => (
                    <View key={index} className="progress-nodebar" style={{ left: item.left }}>
                        <View className="node-statement">
                            <View className="statement">{item.name}</View>
                            <View className="statement">还差{item.needCount - meetCount}人可获得</View>
                            <Text className="iconarrow"></Text>
                        </View>
                        <View className="node-circle"></View>
                        <View className="node-count">{item.needCount}</View>
                    </View>
                ))
            }

        </View>
    )
}

export default CustomProgress