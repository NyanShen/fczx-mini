import React, { forwardRef, useImperativeHandle } from 'react'
import { useReady } from '@tarojs/taro'
import { View } from "@tarojs/components"

import { ISurroundTab } from '@/constants/house'
import './index.scss'

interface IProps {
    title: string
    latitude: number
    longitude: number
}

const SurroundMapH5 = (props: IProps, ref: any) => {
    const { latitude, longitude } = props

    useReady(() => {
        const { BMap } = window as any
        let map: any = new BMap.Map("h5mapcontainer")
        let point: any = new BMap.Point(longitude, latitude)
        map.centerAndZoom(point, 15)

        // 设定1000米圆形范围
        var circle = new BMap.Circle(point, 1000, {
            fillColor: "blue",
            strokeWeight: 1,
            fillOpacity: 0.1,
            strokeOpacity: 0.1
        });
        map.addOverlay(circle);
    })

    const updateTabMarkers = (tab: ISurroundTab) => {
        console.log(tab)
    }

    useImperativeHandle(ref, () => (
        { updateTabMarkers }
    ), [])


    return (
        <View className="h5-map" id="h5mapcontainer"></View>
    )
}

export default React.memo(forwardRef(SurroundMapH5))