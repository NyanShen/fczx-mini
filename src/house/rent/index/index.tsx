import React, { useState } from 'react'
import { View, ScrollView, Text, Image, Map } from '@tarojs/components'

import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import '@styles/common/bottom-bar.scss'
import './index.scss'

const RentIndex = () => {

    const initMarker = [
        {
            latitude: 32.068105,
            longitude: 112.139804,
            width: 30,
            height: 30,
            iconPath: 'http://192.168.2.248/assets/mini/location.png',
            callout: {
                content: '小区名称',
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
    ]

    const { contentHeight } = useNavData()
    const [rentData] = useState<any>({ rentMarker: initMarker })

    return (
        <View className="rent">
            <NavBar title="租房" back={true}></NavBar>
            <ScrollView style={{ maxHeight: `${contentHeight - 55}px` }} scrollY>
                <View className="house-album">

                </View>
                <View className="rent-item">
                    <View className="rent-item-header">
                        <View className="title mb16">
                            全市低3千1平中豪旁边天然气入户层高全市低3千1平中豪旁边天然气
                        </View>
                        <View className="address mb16">樊城区-天润颐景园小区</View>
                        <View className="small-desc mb16">
                            更新时间：2020-10-16 17:14:21
                        </View>
                        <View className="tags">
                            <Text className="tags-item sale-status-2">整租</Text>
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="rent-item-info">
                        <View>
                            <Text className="price">2200</Text>
                            <Text className="price-unit">元/月</Text>
                            <Text className="small-desc">(押一付三)</Text>
                        </View>
                        <View className="info-list">
                            <View className="info-item">
                                <Text className="label">户型</Text>
                                <Text className="value">2室2厅1卫</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">面积</Text>
                                <Text className="value">60m²</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">楼层</Text>
                                <Text className="value">中层/20层</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">装修</Text>
                                <Text className="value">豪华装修</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">朝向</Text>
                                <Text className="value">南</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">电梯</Text>
                                <Text className="value">有</Text>
                            </View>
                            <View className="info-item">
                                <Text className="label">要求</Text>
                                <Text className="value">男女不限</Text>
                            </View>
                        </View>
                        <View className="facility-content">
                            <View className="label">配套设施</View>
                            <View className="facility-list">
                                <View className="facility-item">
                                    <Text className="iconfont iconcheck"></Text>
                                    <Text>床</Text>
                                </View>
                                <View className="facility-item">
                                    <Text className="iconfont iconcheck"></Text>
                                    <Text>洗衣机</Text>
                                </View>
                                <View className="facility-item">
                                    <Text className="iconfont iconcheck"></Text>
                                    <Text>宽带</Text>
                                </View>
                                <View className="facility-item">
                                    <Text className="iconfont iconcheck"></Text>
                                    <Text>空调</Text>
                                </View>
                                <View className="facility-item">
                                    <Text className="iconfont iconcheck"></Text>
                                    <Text>热水器</Text>
                                </View>
                            </View>
                        </View>
                        <View className="rent-tip">
                            <Text>郑重提示：请您在签订合同之前，切勿支付任何形式的费用，以免上当受骗。</Text>
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="rent-item-info">
                        <View className="header">
                            <Text className="title">房源描述</Text>
                        </View>
                        <View className="rent-info-consultant">
                            <View className="user-photo">
                                <Image src=""></Image>
                            </View>
                            <View>
                                <View>苏家园</View>
                                <View className="small-desc">置业顾问</View>
                            </View>
                        </View>
                        <View className="rent-desc">
                            房子位于长虹路毛纺小区站台背后，二楼大两室，家具家电齐全拎包入住，独栋独院，户型方正，南北通透，安全有保证
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="rent-item-info">
                        <View className="plot-header">
                            <View className="title">
                                <Text>小区详情：</Text>
                                <Text className="link">中豪旁边天然气小区</Text>
                            </View>
                            <View className="more">
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                        <View className="rent-map">
                            <Map
                                id="rentMap"
                                className="map"
                                latitude={32.068105}
                                longitude={112.139804}
                                enableZoom={false}
                                markers={rentData.rentMarker}
                            >
                            </Map>
                        </View>
                    </View>
                </View>
                <View className="rent-item">
                    <View className="small-desc">
                        免责声明：房源信息由网站用户提供，其真实性、合法性由信息提供者负责，最终以政府部门登记备案为准。本网站不声明或保证内容之正确性和可靠性，租赁该房屋时，请谨慎核查。
                    </View>
                </View>
            </ScrollView>
            <View className="bottom-bar">
                <View className="bar-item">
                    <View className="user-photo">
                        <Image src=""></Image>
                    </View>
                    <View>
                        <View>苏家园</View>
                        <View className="small-desc">置业顾问</View>
                    </View>
                </View>
                <View className="bar-item-btn">
                    <Text className="btn btn-yellow btn-bar">在线咨询</Text>
                </View>
                <View className="bar-item-btn">
                    <Text className="btn btn-primary btn-bar">电话咨询</Text>
                </View>
            </View>
        </View>
    )
}

export default RentIndex