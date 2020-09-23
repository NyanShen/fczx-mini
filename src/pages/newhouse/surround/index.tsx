import React, { useEffect, useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Map } from "@tarojs/components"
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import { SURROUND_TABS, ISurroundTab } from '@constants/house'
import './index.scss'

const houseSurround = () => {
    let currentRouter: any = getCurrentInstance().router
    let params: any = currentRouter.params
    const currentTab = JSON.parse(params.tab)
    const houseMarker = JSON.parse(params.houseMarker)
    const { contentHeight } = useNavData()
    const [tab, setTab] = useState<ISurroundTab>(currentTab)
    const [markers, setMarkers] = useState<any[]>([houseMarker]);

    useEffect(() => {
        app.request({
            url: api.getHouseSurround,
            data: { type: tab.name }
        }, { isMock: true })
            .then((result: any) => {
                const surroundMarkers: any[] = []
                for (const item of result) {
                    surroundMarkers.push({
                        latitude: item.lat,
                        longitude: item.lng,
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
            <NavBar title="楼盘周边" back={true} />
            <View className="surround-wrapper" style={{ height: contentHeight }}>
                <Map
                    id="surroundMap"
                    className="surround-map"
                    latitude={houseMarker.latitude}
                    longitude={houseMarker.longitude}
                    markers={markers}
                    enableZoom={false}
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