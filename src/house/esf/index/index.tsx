import NavBar from '@components/navbar'
import { View } from '@tarojs/components'
import React from 'react'

import './index.scss'

const esfHouse = () => {
    return (
        <View className="esf">
            <NavBar title="二手房主页" back={true}></NavBar>
        </View>
    )
}

export default esfHouse