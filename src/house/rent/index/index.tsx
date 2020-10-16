import React from 'react'
import { View } from '@tarojs/components'

import NavBar from '@components/navbar'
import './index.scss'
const RentIndex = () => {
    return (
        <View className="rent">
            <NavBar title="租房" back={true}></NavBar>
            <View className="rent-wrapper">

            </View>
        </View>
    )
}

export default RentIndex