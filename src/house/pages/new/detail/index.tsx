import React from 'react'
import { ScrollView, View, Text } from '@tarojs/components'

import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import './index.scss'

const HouseDetail = () => {
    const { contentHeight } = useNavData()
    return (
        <View className="house-detail">
            <NavBar title='襄阳恒大翡翠珑庭楼盘详情' back={true} />
            <ScrollView className="house-detail-wrap" style={{ height: `${contentHeight}px` }} scrollY>
                <View className="info">
                    <View className="info-title">基本信息</View>
                    <View className="info-item">
                        <Text className="label">物业类别：</Text>
                        <Text className="text">普通住宅,商业</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">装修状况：</Text>
                        <Text className="text">简装修</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">建筑类别：</Text>
                        <Text className="text">小高层 高层 小公寓 商铺</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">产权年限：</Text>
                        <Text className="text address"> 住宅70年 公寓40年 商铺40年</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">开发企业：</Text>
                        <Text className="text address">襄阳新城亿博房地产开发有限公司</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">环线位置：</Text>
                        <Text className="text address">长虹北路与邓城大道交汇处</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">楼盘地址：</Text>
                        <Text className="text address">长虹北路与邓城大道交汇处</Text>
                    </View>
                </View>

                <View className="info mt20">
                    <View className="info-title">销售信息</View>
                    <View className="info-item">
                        <Text className="label">预售许可证：</Text>
                        <Text className="text">
                            <Text>鄂襄审批预售字（2020）32号</Text>
                            <Text className="more">查看更多</Text>
                        </Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">销售状态：</Text>
                        <Text className="text">在售</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">咨询电话：</Text>
                        <Text className="text contact">400-819-0876转4247</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">最新开盘：</Text>
                        <Text className="text">已于2019年12月31日开盘</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">交房时间：</Text>
                        <Text className="text">预计2020年12月31日交房</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">主力户型：</Text>
                        <Text className="hx">三居室（2）</Text>
                        <Text className="hx">四居室（1）</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">售楼地址：</Text>
                        <Text className="text address">[东津新区]东津新区东西轴线与南山路交汇处东津新区东西轴线与南山路交汇处</Text>
                    </View>
                </View>

                <View className="info mt20">
                    <View className="info-title">小区规划</View>
                    <View className="info-item">
                        <Text className="label">占地面积：</Text>
                        <Text className="text">54538平方米</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">建筑面积：</Text>
                        <Text className="text">248514平方米</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">容积率：</Text>
                        <Text className="text">2.80</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">绿化率：</Text>
                        <Text className="text">40%</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">停车位：</Text>
                        <Text className="text">1433个停车位，车位配比约为1:1.3</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">楼栋总数：</Text>
                        <Text className="text">11栋</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">楼层状况：</Text>
                        <Text className="text">12-20层</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">物业公司：</Text>
                        <Text className="text">华发物业</Text>
                    </View>
                    <View className="info-item">
                        <Text className="label">物业费：</Text>
                        <Text className="text">3.80元/㎡·月</Text>
                    </View>
                </View>
                <View className="info mt20">
                    <View className="info-title">楼盘简介</View>
                    <View className="info-item">
                        <Text className="text">襄阳吾悦广场是集团布局全国的第81座吾悦广场，总建筑面积超67万方，将打造襄阳首座汉水文化体验式综合体！</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default HouseDetail