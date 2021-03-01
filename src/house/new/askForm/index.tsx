import React, { useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { Textarea, View } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
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
    const houseId = router?.params.id
    const houseTitle = decodeURIComponent(router?.params.title || '')
    const [textData, setTextData] = useState<ITextData>(INIT_TEXT_DATA)

    const handleInputChange = (e: any) => {
        const { cursor, value } = e.detail
        setTextData({
            value,
            count: cursor
        })
    }

    const submitAsk = () => {
        if (!textData.value) {
            Taro.showToast({
                title: '标题不能为空',
                icon: "none"
            })
            return
        }
        app.request({
            url: app.areaApiUrl(api.postHouseAsk),
            method: 'POST',
            data: {
                fang_house_id: houseId,
                title: textData.value
            }
        }).then(() => {
            Taro.redirectTo({ url: `/house/new/ask/index?id=${houseId}&title=${houseTitle}` })
        })
    }

    return (
        <View className="ask-form">
            <View className="ask-wrapper">
                <View className="ask-title">
                    写下对楼盘【{houseTitle}】的疑问
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