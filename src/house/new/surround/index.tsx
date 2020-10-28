import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Map } from "@tarojs/components"
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import { bMapTransQQMap } from '@utils/map'
import { SURROUND_TABS, ISurroundTab } from '@constants/house'
import './index.scss'

const houseSurround = () => {

    const router: any = getCurrentInstance().router
    const currentTab = JSON.parse(router?.params.tab)
    const title = router?.params.title
    const b_latitude = router?.params.latitude
    const b_longitude = router?.params.longitude
    const { latitude, longitude } = bMapTransQQMap(b_latitude, b_longitude)
    const { contentHeight } = useNavData()
    const [tab, setTab] = useState<ISurroundTab>(currentTab)
    const [markers, setMarkers] = useState<any[]>([]);

    const houseMarker = {
        latitude: latitude,
        longitude: longitude,
        width: 30,
        height: 30,
        iconPath: 'http://192.168.2.248/assets/mini/location.png',
        callout: {
            content: title,
            color: '#fff',
            fontSize: 14,
            borderWidth: 2,
            borderRadius: 5,
            borderColor: '#11a43c',
            bgColor: '#11a43c',
            padding: 5,
            display: 'ALWAYS',
            textAlign: 'center'
        }
    }

    useEffect(() => {
        app.request({
            url: app.testApiUrl(api.getHouseSurround),
            data: {
                type: tab.name
            }
        }).then((result: any) => {
            const surroundMarkers: any[] = []
            for (const item of result) {
                const { latitude, longitude } = bMapTransQQMap(item.latitude, item.longitude)
                surroundMarkers.push({
                    latitude,
                    longitude,
                    width: 24,
                    height: 36,
                    iconPath: `http://192.168.2.248/assets/mini/${tab.type}.png`,
                    callout: {
                        content: `${item.title}\n${item.address}`,
                        color: '#333',
                        fontSize: 12,
                        borderWidth: 2,
                        borderRadius: 5,
                        borderColor: '#fff',
                        padding: 5,
                        display: 'BYCLICK'
                    }
                })
            }
            setMarkers([houseMarker, ...surroundMarkers])
        })
    }, [tab])

    return (
        <View className="surround">
            <NavBar title={title || '周边及配套'} back={true} />
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