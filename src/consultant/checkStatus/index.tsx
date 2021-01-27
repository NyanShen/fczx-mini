import React, { useEffect, useState } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'
import { toUrlParam } from '@utils/urlHandler'

const user_check = 'https://static.fczx.com/www/assets/mini/user_check.png'

const CHECK_DATA: any = {
    status_1: {
        title: '您的申请已提交，请耐心等待审核结果',
        text: '工作人员正在审核中, 请稍后再来查看审核结果',
        btnText: '返回'
    },
    status_2: {
        title: '您的账户已被禁用, 无法申请入驻',
        text: '如有任何问题，请您联系官方客服',
        btnText: '返回'
    },
    status_3: {
        title: '您的申请正在审核中，请耐心等待审核结果',
        text: '工作人员正在审核中, 请稍后再来查看审核结果',
        btnText: '返回'
    },
    status_4: {
        title: '您的申请审核结果未通过',
        text: '您可以修改相关信息再重新提交申请',
        btnText: '重新申请',
        url: '/consultant/register/index'
    }
}

const ConsultantCheckStatus = () => {
    const params: any = getCurrentInstance().router?.params
    const [checkStatus, setCheckStatus] = useState<any>(CHECK_DATA.status_1)

    useEffect(() => {
        if (params.status) {
            setCheckStatus(CHECK_DATA[`status_${params.status}`])
        }
    }, [])

    const handleCheckTo = () => {
        if (checkStatus.url) {
            const paramString: any = toUrlParam({ consultant: params.consultant, apply: true })
            Taro.redirectTo({
                url: `${checkStatus.url}${paramString}`
            })
        } else {
            Taro.navigateBack({ delta: 1 })
        }
    }
    return (
        <View className="consultant-check">
            <View className="check-content">
                <View className="check-flex">
                    <View className="check-image">
                        <Image src={user_check} mode="aspectFill" />
                    </View>
                    <View className="check-title">{checkStatus.title}</View>
                    <View className="check-text">{checkStatus.text}</View>
                    <View className="check-link" onClick={handleCheckTo}>
                        <View className="btn btn-plain">{checkStatus.btnText}</View>
                    </View>
                </View>

            </View>
        </View>
    )
}


export default ConsultantCheckStatus