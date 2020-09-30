import React, { useState } from 'react'
import { getCurrentInstance } from '@tarojs/taro'
import { Textarea, View } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import NavBar from '@components/navbar'
import './index.scss'

interface ITextData {
    count?: number,
    value: string
}

const INIT_TEXT_DATA = {
    value: '',
    count: 0
}

const HouseAskForm = () => {
    const textCount = 35
    const router = getCurrentInstance().router
    const [textData, setTextData] = useState<ITextData>(INIT_TEXT_DATA)

    const handleInputChange = (e: any) => {
        const { cursor, value } = e.detail
        setTextData({
            value,
            count: cursor
        })
    }

    const submitAsk = () => {
        app.request({
            url: app.areaApiUrl(api.postHouseAsk),
            method: 'POST',
            data: {
                fang_house_id: router?.params.id,
                content: textData.value
            }
        })
    }

    return (
        <View className="ask-form">
            <NavBar title="提问" back={true}></NavBar>
            <View className="ask-wrapper">
                <View className="ask-title">
                    写下对楼盘【{router?.params.title}】的疑问
                </View>
                <View className="ask-input">
                    <Textarea
                        autoFocus
                        autoHeight
                        maxlength={textCount}
                        placeholderClass="small-desc"
                        className="ask-input-text"
                        placeholder="对本楼盘有任何疑问？都可以写下来。"
                        onInput={handleInputChange}
                    />
                    <View className="ask-input-count">{textData.count}/{textCount}</View>
                </View>
                <View className="ask-action">
                    <View className="btn btn-primary" onClick={submitAsk}>提交问题</View>
                </View>
            </View>
        </View>
    )
}

export default HouseAskForm