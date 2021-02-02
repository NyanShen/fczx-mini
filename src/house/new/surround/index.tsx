import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Text, Map } from "@tarojs/components"
import classnames from 'classnames'
import QQMapWX from 'qqmap-wx-jssdk'

import useNavData from '@hooks/useNavData'
import { bMapTransQQMap, QQ_MAP_KEY } from '@utils/map'
import { SURROUND_TABS, ISurroundTab } from '@constants/house'
import './index.scss'

const houseSurround = () => {

    const params: any = getCurrentInstance().router?.params
    const currentTab = JSON.parse(params.tab)
    const title = params.title
    const b_latitude = params.latitude
    const b_longitude = params.longitude
    const { latitude, longitude } = bMapTransQQMap(b_latitude, b_longitude)
    const { contentHeight } = useNavData()
    const [tab, setTab] = useState<ISurroundTab>(currentTab)
    const [markers, setMarkers] = useState<any[]>([]);

    const mapsdk = new QQMapWX({ key: QQ_MAP_KEY })

    const houseMarker = {
        latitude: latitude,
        longitude: longitude,
        width: 30,
        height: 30,
        iconPath: 'https://static.fczx.com/www/assets/mini/location.png',
        callout: {
            content: title,
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

    useReady(() => {
        Taro.setNavigationBarTitle({title: title || '周边及配套'})
    })

    useEffect(() => {
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


    }, [tab])

    return (
        <View className="surround">
            <View className="surround-wrapper" style={{ height: contentHeight }}>
                <Map
                    id="surroundMap"
                    className="surround-map"
                    latitude={latitude}
                    longitude={longitude}
                    markers={markers}
                >
                </Map>
                <View className="surround-tabs">
                    {
                        SURROUND_TABS.map((item: any, index: number) => (
                            <View
                                key={index}
                                onClick={() => setTab(item)}
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