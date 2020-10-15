import NavBar from '@components/navbar'
import useNavData from '@hooks/useNavData'
import { ScrollView, View } from '@tarojs/components'
import React from 'react'

import './index.scss'

const esfHouse = () => {
    const { contentHeight } = useNavData()
    return (
        <View className="esf">
            <NavBar title="二手房主页" back={true}></NavBar>
            <ScrollView style={{ maxHeight: `${contentHeight - 55}px`, backgroundColor: '#f7f7f7' }} scrollY>
                <View className="house-album">
                    
                </View>
            </ScrollView>
        </View>
    )
}

export default esfHouse