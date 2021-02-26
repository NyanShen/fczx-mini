import React, { useEffect, useMemo, useRef, useState } from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Text } from "@tarojs/components"
import classnames from 'classnames'
import find from 'lodash/find'

import useNavData from '@hooks/useNavData'
import SurroundMap from '@/components/surroundmap'
import SurroundMapH5 from '@/components/surroundmaph5'
import { SURROUND_TABS, ISurroundTab } from '@constants/house'
import './index.scss'

const houseSurround = () => {
    const params: any = getCurrentInstance().router?.params
    const currentTab: any = find(SURROUND_TABS, { type: params.type }) || {}
    const title = params.title
    const latitude = params.latitude
    const longitude = params.longitude
    const { contentHeight } = useNavData()
    const [tab, setTab] = useState<ISurroundTab>(currentTab)
    const ref = useRef<any>({})

    useReady(() => {
        Taro.setNavigationBarTitle({ title: title || '周边及配套' })
    })

    useEffect(() => {
        ref.current.updateTabMarkers && ref.current.updateTabMarkers(tab)
    }, [tab])

    const handleTabChange = (item: ISurroundTab) => {
        if (item.type === tab.type) {
            return
        }
        setTab(item)
    }

    const getMapInstance = useMemo(() => {
        return IS_H5 ?
            <SurroundMapH5
                title={title}
                latitude={latitude}
                longitude={longitude}
                ref={ref}
            /> :
            <SurroundMap
                title={title}
                b_latitude={latitude}
                b_longitude={longitude}
                ref={ref}
            />
    }, [])

    return (
        <View className="surround">
            <View className="surround-wrapper" style={{ height: `${contentHeight}px` }}>
                {getMapInstance}
                <View className="surround-tabs">
                    {
                        SURROUND_TABS.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleTabChange(item)}
                                className={classnames('tabs-item', tab.type === item.type && 'actived')}
                            >
                                <Text className={classnames('iconfont', item.icon)}></Text>
                                <Text className="text">{item.name}</Text>
                            </View>
                        ))
                    }
                </View>
            </View>
        </View>
    )
}

export default houseSurround