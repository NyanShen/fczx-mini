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
let map: any = null
let local: any = null
let circle: any = null
let point: any = null
let options: any = {}
let icon_path: string = ''
let searchResult: any[] = []

const SurroundMapH5 = (props: IProps, ref: any) => {
    const { BMap } = window as any
    const { title, latitude, longitude } = props

    /**初始化地图参数 */
    useReady(() => {
        map = new BMap.Map("h5mapcontainer")
        point = new BMap.Point(longitude, latitude)
        map.centerAndZoom(point, 15)
        // 设定1000米圆形范围
        circle = new BMap.Circle(point, 1000, {
            fillColor: "blue",
            strokeWeight: 1,
            fillOpacity: 0.1,
            strokeOpacity: 0.1
        })
        map.addOverlay(circle)
        options.pageCapacity = 10
        options.renderOptions = { map, autoViewport: false, selectFirstResult: false }
        options.onSearchComplete = (results: any) => {
            searchResult = results && results.Hr
        }
        /**这里添加Marker覆盖LocalSearch默认的icon */
        options.onMarkersSet = () => {
            map.clearOverlays()
            map.addOverlay(circle)
            const myIcon: any = new BMap.Icon(icon_path, new BMap.Size(48, 72))
            myIcon.setImageSize(new BMap.Size(36,54))
            let marker: any = null
            searchResult.forEach(function (item: any) {
                marker = new BMap.Marker(item.point)
                marker.setIcon(myIcon)
                map.addOverlay(marker)
            })
            setCenterLabel()
        }
        local = new BMap.LocalSearch(map, options)
        setCenterLabel()
    })

    const updateTabMarkers = (tab: ISurroundTab) => {
        icon_path = `https://static.fczx.com/www/assets/mini/${tab.type}.png`
        searchLocalNearby(tab.name)
    }

    useImperativeHandle(ref, () => (
        { updateTabMarkers }
    ), [])

    /**设置地图中心点标签 */
    const setCenterLabel = () => {
        const labelTemplate = '<div class="surround-bubble">' +
            '<p>' + title + '</p>' +
            '<div class="triangle-down"></div>' +
            '</div>'
        const centerLabel = new BMap.Label(labelTemplate, {
            position: point,
            offset: new BMap.Size(-45, -40)
        })
        centerLabel.setStyle({
            height: "35px", //高度
            border: "0",  //边
            backgroundColor: "rgba(17, 164, 60, .9)",
            borderRadius: "4px",
            cursor: "pointer"
        })
        map.addOverlay(centerLabel)
    }

    const searchLocalNearby = (keymaps: string) => {
        local && local.searchNearby(keymaps, point, 1000)
    }

    return (
        <View className="h5-map" id="h5mapcontainer"></View>
    )
}

export default React.memo(forwardRef(SurroundMapH5))