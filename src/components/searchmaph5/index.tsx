import React, { forwardRef, useImperativeHandle } from 'react'
import { useReady } from '@tarojs/taro'
import { View } from '@tarojs/components'

import useNavData from '@hooks/useNavData'
import { PRICE_TYPE } from '@constants/house'
import { toHouseNew } from '@/router/router'

import '@styles/common/search-tab.scss'
import './index.scss'

interface IProps {
    city: any
    default_zoom: number
    region_zoom: number
    updateParams: (any) => void
}

let map: any = null
let point: any = null

const SearchMapH5 = (props: IProps, ref: any) => {
    const { city, default_zoom, region_zoom } = props
    const { contentHeight } = useNavData()

    /**初始化地图参数 */
    const { BMap } = window as any

    useReady(() => {
        map = new BMap.Map("h5housemapcontainer", { enableMapClick: false })
        setMapCenter(default_zoom)
        // map.addEventListener('zoomend', getMapParams)
        // map.addEventListener('moveend', getMapParams)
        // map.addEventListener('dragend', getMapParams)
        // map.addEventListener('resize', getMapParams)
    })

    useImperativeHandle(ref, () => (
        {
            setRegionData,
            setHouseLabels,
            setMapCenter
        }
    ), [])

    /**
     * 地图方法
     * @param dataList 
     */

    // const getMapParams = () => {
    //     let param: any = {}
    //     let bounds: any = map.getBounds()
    //     let sw: any = bounds.getSouthWest()
    //     let ne: any = bounds.getNorthEast()
    //     param.zoom = map.getZoom()
    //     param.swlng = sw.lng
    //     param.swlat = sw.lat
    //     param.nelng = ne.lng
    //     param.nelat = ne.lat
    //     if (param.zoom !== default_zoom) {
    //         props.updateParams(param)
    //     }
    // }

    const setMapCenter = (zoom: number, position: any = city) => {
        point = new BMap.Point(position.longitude, position.latitude)
        map.centerAndZoom(point, zoom)
    }

    const setRegionData = (dataList: any[]) => {
        map.clearOverlays()
        for (const item of dataList) {
            let position: any = new BMap.Point(item.longitude, item.latitude)
            let offset: any = new BMap.Size(-65, -45)
            let template: string = '<div class="circle-bubble" data-areaid="' + item.id + '">' +
                '<p class="name">' + item.name + '</p>' +
                '<p class="count"><span>' + item.count + '</span>个楼盘</p>' +
                '</div>'
            let style: any = {
                width: "78px",  //宽
                height: "78px", //高度
                border: "0",  //边
                background: "rgba(17,164,60,.9)",    //背景颜色
                borderRadius: "50%",
                cursor: "pointer"
            }
            let label: any = new BMap.Label(template, { position, offset })
            label.setStyle(style)
            label.setTitle(item.title)
            map.addOverlay(label)
            setRegionLabelEvent(label, item)
        }
    }

    const setRegionLabelEvent = (label: any, labelData: any) => {
        label.addEventListener("click", function () {
            props.updateParams({
                areaList: labelData,
                zoom: region_zoom
            })
            const { latitude, longitude } = labelData
            setMapCenter(region_zoom, { latitude, longitude })
        })
    }

    const setHouseLabels = (dataList: any[]) => {
        map.clearOverlays()
        for (const item of dataList) {
            let position = new BMap.Point(item.longitude, item.latitude)
            let offset = new BMap.Size(-65, -45)
            let template = '<div class="house-bubble">' +
                '<p>' +
                '<span class="house-price">' + item.price + '</span>' +
                '<span class="unit">' + PRICE_TYPE[item.price_type] + '</span>' +
                '<em>|</em>' +
                '<span class="name">' + item.title + '</span>' +
                '</p>' +
                '<div class="triangle-down"></div>' +
                '</div>'
            let style = {
                height: "30px", //高度
                border: "0",  //边
                padding: "0",  //边
                backgroundColor: "rgba(17,164,60,.9)",
                borderRadius: "4px",
                cursor: "pointer"
            }
            let label = new BMap.Label(template, { position, offset })
            label.setStyle(style)
            label.setTitle(item.title)
            map.addOverlay(label)
            setHouseLabelEvent(label, item)
        }
    }

    const setHouseLabelEvent = (label: any, labelData: any) => {
        label.addEventListener("click", function () {
            toHouseNew('Index', { id: labelData.id })
        })
    }


    return (
        <View
            id="h5housemapcontainer"
            style={{ height: `${contentHeight}px` }}
            className="h5-house-map"
        ></View>
    )
}

export default forwardRef(SearchMapH5)