import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { View, Map } from '@tarojs/components'

import useNavData from '@hooks/useNavData'
import { bMapTransQQMap, qqMapTransBMap } from '@utils/map'
import { PRICE_TYPE } from '@constants/house'
import down_fill from '@assets/icons/downfill.png'

import '@styles/common/search-tab.scss'
import './index.scss'

interface IProps {
    city: any
    zoom: number
    default_zoom: number
    region_zoom: number
    updateParams: (any) => void
    updateAreaParams: (any) => void
}


const SearchMap = (props: IProps, ref: any) => {
    const { city, updateParams, updateAreaParams, default_zoom, region_zoom } = props
    const { contentHeight } = useNavData()
    const centerLocation = bMapTransQQMap(city.latitude, city.longitude)
    const [center, setCenter] = useState<any>(centerLocation)
    const [customZoom, setCustomZoom] = useState<number>(default_zoom)
    const [markers, setMarkers] = useState<any[]>([])

    useImperativeHandle(ref, () => (
        {
            setRegionData,
            setHouseLabels,
            setCenter,
            setCustomZoom
        }
    ), [])

    /**
     * 地图方法
     * @param dataList 
     */
    const setRegionData = (dataList: any[]) => {
        let totalCount = 0
        let regionLabels: any[] = []
        for (const item of dataList) {
            totalCount = totalCount + item.count
            const location = bMapTransQQMap(item.latitude, item.longitude)
            regionLabels.push({
                id: Number(item.id),
                latitude: location.latitude,
                longitude: location.longitude,
                iconPath: down_fill,
                width: 20,
                height: 30,
                callout: {
                    content: `${item.name}\n${item.count}个新盘`,
                    color: '#fff',
                    anchorX: 0,
                    anchorY: 30,
                    padding: 10,
                    borderRadius: 10,
                    borderColor: '#fff',
                    bgColor: '#11a43c',
                    textAlign: 'center',
                    display: 'ALWAYS'
                }
            })
        }
        setMarkers(regionLabels)
    }

    const setHouseLabels = (dataList: any[]) => {
        let houseLabels: any[] = []
        for (const item of dataList) {
            const location = bMapTransQQMap(item.latitude, item.longitude)
            const showPrice = item.price === '0' ? '价格待定' : `${item.price}${PRICE_TYPE[item.price_type]}`
            houseLabels.push({
                id: Number(item.id),
                latitude: location.latitude,
                longitude: location.longitude,
                iconPath: down_fill,
                width: 20,
                height: 30,
                callout: {
                    content: `${showPrice} | ${item.title}`,
                    color: '#fff',
                    anchorX: 0,
                    anchorY: 20,
                    padding: 10,
                    borderRadius: 10,
                    bgColor: '#11a43c',
                    textAlign: 'center',
                    display: 'ALWAYS'
                }
            })
        }
        setMarkers(houseLabels)
    }

    const handleRegionChangeEnd = (e: any) => {
        let causeType: string = e.causedBy
        let zoom: number = e.detail.scale
        let ne: any = e.detail.region.northeast
        let sw: any = e.detail.region.southwest
        let nepoint: any = qqMapTransBMap(ne.latitude, ne.longitude)
        let swpoint: any = qqMapTransBMap(sw.latitude, sw.longitude)
        if (causeType === 'update') {
            if (parseInt(`${props.zoom}`) === default_zoom) {
                updateParams({
                    swlat: '',
                    swlng: '',
                    nelat: '',
                    nelng: '',
                })
                return
            }
            updateParams({
                swlat: swpoint.latitude,
                swlng: swpoint.longitude,
                nelat: nepoint.latitude,
                nelng: nepoint.longitude,
            })
        } else {
            updateParams({
                zoom,
                swlat: swpoint.latitude,
                swlng: swpoint.longitude,
                nelat: nepoint.latitude,
                nelng: nepoint.longitude,
            })
        }
    }

    const handleCalloutTap = (e: any) => {
        const markerId = e.detail.markerId
        const newZoom = region_zoom + Math.random() / 1000
        updateAreaParams({ zoom: newZoom, houseId: markerId })
    }

    return (
        <View className="QQMap">
            <Map
                id="QQMapId"
                style={{ width: '100%', height: contentHeight }}
                latitude={center.latitude}
                longitude={center.longitude}
                scale={customZoom}
                markers={markers}
                onEnd={handleRegionChangeEnd}
                onCalloutTap={handleCalloutTap}
            >
            </Map>
        </View>
    )
}

export default forwardRef(SearchMap)