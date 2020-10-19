import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { ScrollView, View, Text, Image } from '@tarojs/components'
import React from 'react'

import '@styles/common/house.scss'
import '@styles/common/bottom-bar.scss'
import './index.scss'

const esfHouse = () => {
    const { contentHeight } = useNavData()
    return (
        <View className="esf">
            <NavBar title="二手房主页" back={true}></NavBar>
            <ScrollView style={{ maxHeight: contentHeight - 55 }} scrollY>
                <View className="house-album">

                </View>
                <View className="esf-item">
                    <View className="header">
                        <Text>家乐福商圈 天润颐景园 大三室，边户采光好 单价低 户型规整</Text>
                    </View>
                    <View className="esf-main-info">
                        <View className="main-item">
                            <Text className="value">85</Text>
                            <Text className="unit">万</Text>
                        </View>
                        <View className="main-item">
                            <Text className="value">3</Text>
                            <Text className="unit">室</Text>
                            <Text className="value">2</Text>
                            <Text className="unit">厅</Text>
                            <Text className="value">1</Text>
                            <Text className="unit">卫</Text>
                        </View>
                        <View className="main-item">
                            <Text className="value">112</Text>
                            <Text className="unit">㎡</Text>
                        </View>
                    </View>
                    <View className="tags mt20">
                        <Text className="tags-item">精装</Text>
                        <Text className="tags-item">新上房源</Text>
                    </View>
                </View>
                <View className="esf-item">
                    <View className="header">
                        <Text className="title">房源信息</Text>
                    </View>
                    <View className="esf-info-other">
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">单价</Text>
                                <Text className="value">7760元/㎡</Text>
                            </View>
                        </View>
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">楼层</Text>
                                <Text className="value">中层/29层</Text>
                            </View>
                            <View className="subitem">
                                <Text className="label">装修</Text>
                                <Text className="value">精装</Text>
                            </View>
                        </View>
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">朝向</Text>
                                <Text className="value">南</Text>
                            </View>
                            <View className="subitem">
                                <Text className="label">年代</Text>
                                <Text className="value">2017</Text>
                            </View>
                        </View>
                        <View className="other-item">
                            <View className="subitem">
                                <Text className="label">小区</Text>
                                <Text className="value">旺达广场</Text>
                            </View>
                            <View className="subitem link">
                                <Text className="iconfont iconarrow-right-bold"></Text>
                            </View>
                        </View>
                    </View>

                    <View className="header">
                        <Text className="title">房源描述</Text>
                    </View>
                    <View className="esf-info-consultant">
                        <View className="user-photo">
                            <Image src=""></Image>
                        </View>
                        <View>
                            <View>苏家园</View>
                            <View className="small-desc">置业顾问</View>
                        </View>
                    </View>

                    <View className="esf-info-item">
                        <View className="sub-title">核心卖点</View>
                        <View className="item-content">
                            【房屋位置】：绿地中央广场斜对面，如日电器家属楼
                            【户型朝向】：南向
                            【装修情况】：简装，现房
                            【房屋信息】：2室1厅1卫，面积41.9平米
                        </View>
                    </View>
                    <View className="esf-info-item">
                        <View className="sub-title">业主心态</View>
                        <View className="item-content">
                            郑重！此房源为新盘，不会产生任何费用,预约可带看，享团购优惠,欢迎您的咨询，享受额外渠道到访优惠价
                        </View>
                    </View>
                    <View className="esf-info-item">
                        <View className="sub-title">服务介绍</View>
                        <View className="item-content">
                            本人从事房地产多年，公司有大量好房源，欢迎进入我的店铺查看，欢迎随时电话咨询，相信我的专业，为您置业安家保驾护航。
                        </View>
                    </View>
                </View>
                <View className="esf-item">
                    <View className="header">
                        <View>小区详情</View>
                        <View className="more">
                            <Text>查看</Text>
                            <Text className="iconfont iconarrow-right-bold"></Text>
                        </View>
                    </View>
                    <View className="plot-content">
                        <View className="plot-name">天润颐景园</View>
                        <View className="plot-info">
                            <View className="plot-item">
                                <View className="label">参考均价</View>
                                <View className="value price-unit">7980元/㎡</View>
                            </View>
                            <View className="plot-item">
                                <View className="label">环比上月</View>
                                <View className="value">
                                    <Text className="iconfont"></Text>
                                    <Text className="tip-color">1.78%</Text>
                                </View>
                            </View>
                            <View className="plot-item">
                                <View className="label">小区地址</View>
                                <View className="value">襄阳万达广场</View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="esf-item">
                    <Text className="small-desc">
                        免责声明：房源信息由网站用户提供，其真实性、合法性由信息提供者负责，最终以政府部门登记备案为准。本网站不声明或保证内容之正确性和可靠性，购买房屋时，请谨慎核查。请您在签订合同之前，切勿支付任何形式的费用，以免上当受骗。
                    </Text>
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

export default esfHouse