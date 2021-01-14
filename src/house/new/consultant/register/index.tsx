import React from 'react'
import { View, Text, Input, Textarea } from '@tarojs/components'

import './index.scss'

const HouseConsultant = () => {

    return (
        <View className="consultant-register">
            <View className="consultant-form">
                <View className="form-item flex-item">
                    <View className="item-label"><Text className="required">*</Text>姓名</View>
                    <View className="item-input">
                        <Input placeholder="请输入" />
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">微信号</View>
                    <View className="item-input">
                        <Input placeholder="请输入" />
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">楼盘信息</View>
                    <View className="item-select">
                        <Text className="select-text">请搜索选择楼盘信息</Text>
                        <Text className="iconfont iconarrow-right-bold"></Text>
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label"><Text className="required">*</Text>手机号</View>
                    <View className="item-input">
                        <Input placeholder="请输入" />
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label"><Text className="required">*</Text>验证码</View>
                    <View className="item-input">
                        <Input placeholder="请输入验证码" />
                        <View className="btn btn-plain">获取验证码</View>
                    </View>
                </View>
                <View className="form-item flex-item">
                    <View className="item-label">邀请码</View>
                    <View className="item-input">
                        <Input placeholder="请输入" />
                    </View>
                </View>
                <View className="form-item">
                    <View className="item-label">个人简介</View>
                    <View className="item-input">
                        <Textarea placeholder="请输入个人简介" maxlength={300} />
                    </View>
                </View>
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传头像</View>
                    <View className="item-image">
                        <Text className="iconfont iconphotograph"></Text>
                        <Text className="image-tip">点击上传</Text>
                    </View>
                </View>
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传微信二维码</View>
                    <View className="item-image">
                        <Text className="iconfont iconphotograph"></Text>
                        <Text className="image-tip">点击上传</Text>
                    </View>
                </View>
                <View className="form-item">
                    <View className="item-label"><Text className="required">*</Text>上传工作证（名片）</View>
                    <View className="item-image">
                        <Text className="iconfont iconphotograph"></Text>
                        <Text className="image-tip">点击上传</Text>
                    </View>
                </View>
                <View className="form-submit">
                    <View className="btn btn-primary">立即入驻</View>
                </View>
                <View className="form-submit">
                    <View className="tip-text">注：为了避免他人冒充置业顾问/经纪人我们需要验证您的名片或者工牌 谢谢您的配合</View>
                    <View className="tip-text">如果遇到图片无法上传或者其他的问题请联系客服，我们将及时为您解决</View>
                    <View className="tip-text">
                        客服微信：<Text style={{ color: '#f90' }}>1234444</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HouseConsultant