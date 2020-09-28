import React, { useState } from 'react'
import { getCurrentInstance, useReady } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar/index'
import './index.scss'
import { SALE_STATUS } from '@house/constants/house'
import { formatTimestamp } from '@utils/index'

const INIT_HOUSE_DATA = {
    id: '',
    title: '',
    fangHouseInfo: {},
    _room: [],
    _renovationStatus: [],
    _fangPropertyType: [],
    _fangBuildingType: [],
    fangHouseLicense: []
}

const HouseDetail = () => {
    const [houseData, setHouseData] = useState<any>(INIT_HOUSE_DATA)
    useReady(() => {
        let currentRouter: any = getCurrentInstance().router
        let params: any = currentRouter.params
        params.id = '1001'
        if (params.id) {
            app.request({
                url: app.testApiUrl(api.getHouseById),
                data: {
                    id: params.id
                }
            }).then((result: any) => {
                setHouseData(result)

            })
        }
    })
    const renderDetail = (value: string) => {
        return value ? value : '待更新'
    }

    return (
        <View className="house-detail">
            <NavBar title={houseData.title + '详情'} back={true} />
            <View className="house-detail-wrap">
                <View className="info">
                    <View className="info-title">基本信息</View>
                    <View className="info-item">
                        <Text className="label">物业类型：</Text>
                        <Text className="text">{houseData._fangPropertyType.join(',')}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">装修状况：</Text>
                        <Text className="text">{houseData._renovationStatus.join(',')}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">建筑类型：</Text>
                        <Text className="text">
                            {renderDetail(houseData._fangBuildingType.join(','))}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">产权年限：</Text>
                        <Text className="text address">
                            {renderDetail(houseData._fangBuildingType.property_rights)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">开发企业：</Text>
                        <Text className="text address">
                            {renderDetail(houseData._fangBuildingType.developer)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">楼盘地址：</Text>
                        <Text className="text address">
                            {renderDetail(houseData.address)}
                        </Text>
                    </View>
                </View>

                <View className="info mt20">
                    <View className="info-title">销售信息</View>

                    <View className="info-item">
                        <Text className="label">销售状态：</Text>
                        <Text className="text">{SALE_STATUS[houseData.sale_status]}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">咨询电话：</Text>
                        <Text className="text contact">{houseData.phone}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">最新开盘：</Text>
                        <Text className="text">{houseData.open_time && formatTimestamp(houseData.open_time, 'yy-MM-dd')}</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">交付时间：</Text>
                        <Text className="text">
                            {houseData.fangHouseInfo.deliver_time && formatTimestamp(houseData.fangHouseInfo.deliver_time, 'yy-MM-dd')}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">主力户型：</Text>
                        {
                            houseData._room.map((item: any, index: number) => (
                                <Text key={index} className="hx">{item}</Text>
                            ))
                        }
                    </View>
                    <View className="info-item">
                        <Text className="label">售楼地址：</Text>
                        <Text className="text address">
                            {renderDetail(houseData.fangHouseInfo.sale_address)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">预售许可证：</Text>
                    </View>
                    <View className="info-table">
                        <View className="info-table-content table-header">
                            <Text className="item no">预售证号</Text>
                            <Text className="item time">发证时间</Text>
                            <Text className="item bind">对应楼栋</Text>
                        </View>
                        {
                            houseData.fangHouseLicense.length > 0 &&
                            houseData.fangHouseLicense.map((item: any, index: number) => (
                                <View key={index} className="info-table-content">
                                    <Text className="item no">{item.name}</Text>
                                    <Text className="item time">{formatTimestamp(item.modified, 'yy-MM-dd')}</Text>
                                    <Text className="item bind">
                                        {
                                            item.fangHouseLicenseBuilding &&
                                            item.fangHouseLicenseBuilding.map((item:any) => {
                                                return item.fang_house_building_name
                                            }).join(',')
                                        }
                                    </Text>
                                </View>
                            ))
                        }
                    </View>
                </View>

                <View className="info mt20">
                    <View className="info-title">小区规划</View>
                    <View className="info-item">
                        <Text className="label">占地面积：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.land_area)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">建筑面积：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.building_area)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">容积率：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.volume_rate)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">绿化率：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.greening_rate)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">停车位：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.parking_number)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">楼栋总数：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.building_number)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">楼层状况：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.storey_height)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">物业公司：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.property_company)}
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">物业费：</Text>
                        <Text className="text">
                            {renderDetail(houseData.fangHouseInfo.property_fee)}
                        </Text>
                    </View>
                </View>
                <View className="info mt20">
                    <View className="info-title">楼盘简介</View>
                    <View className="info-item">
                        <Text className="text">{houseData.description}</Text>
                    </View>
                </View>
            </View>
        </View>
    )

}

export default HouseDetail