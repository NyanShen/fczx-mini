import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { View, Map } from "@tarojs/components"
import QQMapWX from 'qqmap-wx-jssdk'
import { ISurroundTab } from '@/constants/house'
import { bMapTransQQMap, QQ_MAP_KEY } from '@utils/map'

import './index.scss'

interface IParamProps {
    title: string
    b_latitude: number
    b_longitude: number
}

const SurroundMap = (props: IParamProps, ref: any) => {
    const [markers, setMarkers] = useState<any[]>([])
    const mapsdk = new QQMapWX({ key: QQ_MAP_KEY })
    const { latitude, longitude } = bMapTransQQMap(props.b_latitude, props.b_longitude)

    const houseMarker = {
        latitude: latitude,
        longitude: longitude,
        width: 30,
        height: 30,
        iconPath: 'https://static.fczx.com/www/assets/mini/location.png',
        callout: {
            content: props.title,
            color: '#fff',
            fontSize: 14,
            borderWidth: 2,
            borderRadius: 5,
            borderColor: '#11a43c',
            bgColor: '#11a43c',
            padding: 8,
            display: 'ALWAYS',
            textAlign: 'center'
        }
    }

    useImperativeHandle(ref, () => (
        {
            updateTabMarkers: updateTabMarkers
        }
    ), [])

    const updateTabMarkers = (tab: ISurroundTab) => {
        if (tab.name) {
            mapsdk.search({
                keyword: tab.name,
                location: { latitude, longitude },
                success: (result: any) => {
                    const surroundMarkers: any[] = []
                    for (const item of result.data) {
                        surroundMarkers.push({
                            latitude: item.location.lat,
                            longitude: item.location.lng,
                            width: 24,
                            height: 36,
                            iconPath: `https://static.fczx.com/www/assets/mini/${tab.type}.png`,
                            callout: {
                                content: `${item.title}\n${item.address}`,
                                color: '#333',
                                fontSize: 14,
                                borderWidth: 2,
                                borderRadius: 5,
                                borderColor: '#fff',
                                padding: 8,
                                display: 'BYCLICK'
                            }
                        })
                    }
                    setMarkers([houseMarker, ...surroundMarkers])
                }
            })
        } else {
            setMarkers([houseMarker])
        }
    }
    return (
        <View className="mini-map">
            <Map
                id="surroundMap"
                className="surround-map"
                latitude={latitude}
                longitude={longitude}
                markers={markers}
            >
            </Map>
        </View>
    )
}

export default React.memo(forwardRef(SurroundMap))