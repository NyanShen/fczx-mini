import React, { useEffect, useState } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import NavBar from '@components/navbar/index'
import new_house from '@assets/icons/new_house.png'
import second_house from '@assets/icons/house.png'
import rent_house from '@assets/icons/rent_house.png'
import news from '@assets/icons/news.png'
import '@styles/common/house.scss'
import './index.scss'

const Index = () => {

  const [city, setCity] = useState<any>({})

  useEffect(() => {
  }, [])

  useDidShow(() => {
    const currentCity = storage.getItem('city')
    if (!currentCity) {
      Taro.showModal({
        title: '提示',
        content: '请先选择一个的城市',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/pages/city/index'
            })
          }
        }
      })
      return
    } 
    if (currentCity.id !== city.id) {
      setCity(currentCity)
      fetchHouseList()
    }
  })

  const fetchHouseList = () => {
    app.request({
      url: app.testApiUrl(api.getHouseList)
    }).then((result: any) => {
      console.log(result)
    })
  }

  const menuContent = [{
    children: [
      {
        name: '新盘',
        icon: new_house,
        path: '/house/pages/new/list/index'
      },
      {
        name: '二手房',
        icon: second_house,
        path: '/house/pages/esf/index'
      },
      {
        name: '租房',
        icon: rent_house,
        path: '/house/pages/rent/index'
      },
      {
        name: '资讯',
        icon: news,
        path: '/pages/news/index'
      }
    ]
  }]

  const clickHandler = () => {
    Taro.navigateTo({
      url: '/house/pages/search/index'
    })
  }

  const handleMenuClick = (path) => {
    Taro.navigateTo({
      url: path
    })
  }

  const toCityList = () => {
    Taro.navigateTo({
      url: '/pages/city/index'
    })
  }

  return (
    <View className="index">
      <NavBar title="房产在线" />
      <View className="index-search">
        <View className="index-search-content clearfix">
          <View className="iconfont iconsearch"></View>
          <View className="index-search-content-desc" onClick={clickHandler}>输入区县、小区名</View>
          <View className="index-search-content-text" onClick={toCityList}>
            <Text className="iconfont iconmapcity"></Text>
            <Text className="city-name">{city.short_name}</Text>
          </View>
        </View>
      </View>
      <View className="index-menu">
        {
          menuContent.map((item: any, index: number) => {
            return (
              <View className="index-menu-content" key={index}>
                {
                  item.children.map((childItem: any, childIndex: number) => {
                    return (
                      <View className="index-menu-item" key={childIndex} onClick={() => handleMenuClick(childItem.path)}>
                        <View className="index-menu-icon">
                          <Image src={childItem.icon}></Image>
                        </View>
                        <View className="index-menu-name">
                          <Text>{childItem.name}</Text>
                        </View>
                      </View>
                    )
                  })
                }
              </View>
            )
          })
        }
      </View>
      <View className="house-list view-content">
        <View className="house-list-ul">
          <View className="house-list-li">
            <View className="li-image">
              <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
            </View>
            <View className="li-text">
              <View className="title mb10">
                <Text>襄阳吾悦广场</Text>
              </View>
              <View className="small-desc mb10">
                <Text>樊城区-樊城区</Text>
                <Text className="line-split"></Text>
                <Text>建面85-0139平米</Text>
              </View>
              <View className="mb10">
                <Text className="price">1200</Text>
                <Text className="price-unit">元/m²</Text>
              </View>
              <View className="tags">
                <Text className="tags-item sale-status-1">在售</Text>
              </View>
            </View>
          </View>
          <View className="house-list-li">
            <View className="li-image">
              <Image src="http://192.168.2.248/assets/images/1400x933_1.jpg"></Image>
            </View>
            <View className="li-text">
              <View className="title mb10">
                <Text>襄阳吾悦广场</Text>
              </View>
              <View className="small-desc mb10">
                <Text>樊城区-樊城区</Text>
                <Text className="line-split"></Text>
                <Text>建面85-0139平米</Text>
              </View>
              <View className="mb10">
                <Text className="price">1200</Text>
                <Text className="price-unit">元/m²</Text>
              </View>
              <View className="tags">
                <Text className="tags-item sale-status-1">在售</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
export default Index