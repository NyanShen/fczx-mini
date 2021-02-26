import React, { useState } from 'react'
import Taro, { useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Image, Swiper, SwiperItem } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import CustomSocket from '@utils/socket'
import { PROJECT_NAME } from '@constants/global'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import {
  esfPath,
  housePath,
  house_menu,
  house_sub_menu,
  esf_menu,
  esf_sub_menu,
  news_menu, calc_menu, house_group_menu
} from './index.util'
import '@styles/common/house.scss'
import './index.scss'

const Index = () => {
  const [city, setCity] = useState<any>({})
  const [houseList, setHouseList] = useState<any[]>([])
  const [esfList, setEsfList] = useState<any[]>([])
  const [activity, setActivity] = useState<string[]>([])
  const [homeData, setHomeData] = useState<any>({})

  useShareTimeline(() => {
    return {
      title: PROJECT_NAME,
      path: '/pages/index/index'
    }
  })

  useShareAppMessage(() => {
    return {
      title: PROJECT_NAME,
      path: '/pages/index/index'
    }
  })

  useDidShow(() => {
    CustomSocket.onChatUnread()
    const currentCity = storage.getItem('city')
    if (!currentCity) {
      app.setLocation((result: any) => {
        setCity(result)
        fetchHomeData()
      })
      return
    }
    if (currentCity.id !== city.id) {
      setCity(currentCity)
      fetchHomeData()
    }

  })

  const isShow = (param: any) => {
    return param == 1
  }

  const fetchHomeData = () => {
    app.request({
      url: app.areaApiUrl(api.getHomeApplet),
    }).then((result: any) => {
      let menuContent: any[] = []
      let esf_menus: any[] = []
      let house_menus: any[] = []
      if (isShow(result.navSetting.is_show_house)) {
        menuContent = [...menuContent, ...house_menu]
        house_menus = house_sub_menu
        fetchHouseList()
      }
      if (isShow(result.navSetting.is_show_house_group)) {
        menuContent = [...menuContent, ...house_group_menu]
      }
      if (isShow(result.navSetting.is_show_esf)) {
        menuContent = [...menuContent, ...esf_menu]
        esf_menus = esf_sub_menu
        fetchEsfList()
      }
      if (isShow(result.navSetting.is_show_news)) {
        menuContent = [...menuContent, ...news_menu]
      }
      if (isShow(result.navSetting.is_show_calculator)) {
        menuContent = [...menuContent, ...calc_menu]
      }
      setHomeData({ ...result, menuContent, house_menus, esf_menus })
      storage.setItem('navSetting', result.navSetting)
    })
  }

  const fetchHouseList = () => {
    app.request({
      url: app.areaApiUrl(api.getHouseList),
      data: {
        page: 1,
        limit: 10
      }
    }, { loading: false }).then((result: any) => {
      setHouseList(result.data)
    })
  }

  const fetchEsfList = () => {
    app.request({
      url: app.areaApiUrl(api.getEsfList),
      data: {
        page: 1,
        limit: 10
      }
    }, { loading: false }).then((result: any) => {
      setEsfList(result.data)
    })
  }

  const toHouseSearch = () => {
    Taro.navigateTo({
      url: '/house/search/index'
    })
  }

  const handleMenuClick = (path: string) => {
    if (path) {
      Taro.navigateTo({
        url: path
      })
    }
  }

  const toCityList = () => {
    Taro.navigateTo({
      url: '/house/city/index'
    })
  }

  const toHouseItem = (item: any, name: string) => {
    Taro.navigateTo({
      url: `/house/${name}/index/index?id=${item.id}`
    })
  }

  const handleActivity = (houseId: string) => {
    if (activity.includes(houseId)) {
      activity.splice(activity.findIndex((item: string) => item === houseId), 1)
      setActivity([...activity])
    } else {
      setActivity([...activity, houseId])
    }
  }

  const renderPrice = (price: string, price_type: string) => {
    if (price === '0') {
      return <Text className="price">待定</Text>
    } else {
      return <Text className="price">{price}<Text className="price-unit">{PRICE_TYPE[price_type]}</Text></Text>
    }
  }

  const renderActivity = (houseItem: any) => {
    let activities: any[] = []
    if (houseItem.is_discount == '1') {
      activities.push({
        icon: 'iconcoupon',
        title: houseItem.fangHouseDiscount.title
      })
    }
    if (houseItem.is_group == '1') {
      activities.push({
        icon: 'iconstars',
        title: houseItem.fangHouseGroup.title
      })
    }

    return (
      <View className="house-activity" onClick={() => handleActivity(houseItem.id)}>
        <View className="activity-content">
          {
            activities.map((item: any, index: number) => {
              if (index === 0) {
                return (
                  <View className="activity-item" key={index}>
                    <Text className={classnames('iconfont', item.icon)}></Text>
                    <Text className="text">{item.title}</Text>
                  </View>
                )
              }
              if (index > 0 && activity.includes(houseItem.id)) {
                return (
                  <View className="activity-item" key={index}>
                    <Text className={classnames('iconfont', item.icon)}></Text>
                    <Text className="text">{item.title}</Text>
                  </View>
                )
              }
            })
          }
        </View>
        {
          activities.length > 1 &&
          <View className="activity-icon">
            <Text className={classnames('iconfont', activity.includes(houseItem.id) ? 'iconarrow-up-bold' : 'iconarrow-down-bold')}></Text>
          </View>
        }
      </View>
    )
  }

  return (
    <View className="index">
      <View className="index-header">
        {
          homeData['ad-rotation-top'] &&
          homeData['ad-rotation-top'].length > 0 &&
          <Swiper
            className="swiper"
            circular
            autoplay
            indicatorDots
            indicatorActiveColor="#ffffff"
          >
            {
              homeData['ad-rotation-top'].map((item: any, index: number) => (
                <SwiperItem key={index} className="swiper-item">
                  <Image className="taro-image" src={item.image_path} mode="aspectFill"></Image>
                </SwiperItem>
              ))
            }
          </Swiper>
        }

        <View className="index-search">
          <View className="index-search-content clearfix">
            <View className="iconfont iconsearch"></View>
            <View className="index-search-content-desc" onClick={toHouseSearch}>输入楼盘、小区名</View>
            <View className="index-search-content-text" onClick={toCityList}>
              <Text className="iconfont iconmap"></Text>
              <Text className="city-name">{city.short_name}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="index-menu">
        <View className="index-menu-content">
          {
            homeData.menuContent &&
            homeData.menuContent.map((item: any, index: number) => {
              return (
                <View className="index-menu-item" key={index} onClick={() => handleMenuClick(item.path)}>
                  <View className="index-menu-icon">
                    <Image className="taro-image" src={item.icon} mode="aspectFill"></Image>
                  </View>
                  <View className="index-menu-name">
                    <Text>{item.name}</Text>
                  </View>
                </View>
              )
            })
          }
        </View>
      </View>
      <View className="index-price">
        <View className="index-title">
          <View className="title-item">{city.short_name}房价</View>
        </View>
        <View className="price-content">
          <View className="price-item">
            <View>
              <Text className="price">{homeData.housePrice}</Text>
              <Text className="unit">元/㎡</Text>
            </View>
            <View className="desc">新房均价</View>
          </View>
          <View className="line-split"></View>
          <View className="price-item">
            <View>
              <Text className="price">{homeData.esfPrice}</Text>
              <Text className="unit">元/㎡</Text>
            </View>
            <View className="desc">二手房均价</View>
          </View>
        </View>
      </View>
      {
        homeData.house_menus &&
        <View className="house-list">
          <View className="index-title">
            {
              homeData.house_menus.map((item: any, index: number) => (
                <View
                  key={index}
                  className="title-item"
                  onClick={() => handleMenuClick(item.path)}
                >{item.name}</View>
              ))
            }
          </View>
          {
            houseList.length > 0 &&
            <View className="house-list-ul">
              {
                houseList.map((item: any) => (
                  <View key={item.id} className="house-list-li">
                    <View className="house-content" onClick={() => toHouseItem(item, 'new')}>
                      <View className="house-image">
                        <Image className="taro-image" src={item.image_path} mode="aspectFill"></Image>
                      </View>
                      <View className="house-text">
                        <View className="text-item title mb8">
                          <Text className={classnames('sale-status', `sale-status-${item.sale_status}`)}>{SALE_STATUS[item.sale_status]}</Text>
                          <Text>{item.title}</Text>
                        </View>
                        <View className="text-item small-desc mb8">
                          <Text>{item.area && item.area.name}</Text>
                          <Text className="line-split"></Text>
                          <Text>{item.comment_num}条评论</Text>
                        </View>
                        <View className="text-item mb12">
                          {renderPrice(item.price, item.price_type)}
                        </View>
                        <View className="text-item tags">
                          {
                            item.tags && item.tags.map((tag: string, index: number) => (
                              <Text key={index} className="tags-item">{tag}</Text>
                            ))
                          }
                        </View>
                      </View>
                    </View>
                    {renderActivity(item)}
                  </View>
                ))
              }
            </View>
          }
          <View className="house-more" onClick={() => handleMenuClick(housePath)}>
            更多房源
        </View>
        </View>
      }

      {
        homeData.esf_menus &&
        <View className="house-list mt20">
          <View className="index-title">
            {
              homeData.esf_menus.map((item: any, index: number) => (
                <View
                  key={index}
                  className="title-item"
                  onClick={() => handleMenuClick(item.path)}
                >{item.name}</View>
              ))
            }
          </View>
          {
            esfList.length > 0 &&
            <View className="house-list-ul">
              {
                esfList.map((item: any, index: number) => (
                  <View key={index} className="house-list-li">
                    <View className="house-content" onClick={() => toHouseItem(item, 'esf')}>
                      <View className="house-image">
                        <Image className="taro-image" src={item.image_path} mode="aspectFill"></Image>
                      </View>
                      <View className="house-text">
                        <View className="text-item title row2">
                          <Text>{item.title}</Text>
                        </View>
                        <View className="text-item text-item-small">
                          <Text>{item.room}室{item.office}厅{item.toilet}卫</Text>
                          <Text className="line-split"></Text>
                          <Text>{item.building_area}m²</Text>
                          <Text className="ml20">{item.community}</Text>
                        </View>
                        <View className="text-item mb12">
                          <Text className="price">{item.price_total}</Text>
                          <Text className="price-unit">万</Text>
                          <Text className="small-desc ml20">{item.price_unit}元/m²</Text>
                        </View>
                        <View className="text-item tags">
                          {
                            item.tags.map((item: string, index: number) => (
                              <Text key={index} className="tags-item">{item}</Text>
                            ))
                          }
                        </View>
                      </View>
                    </View>
                  </View>
                ))
              }
            </View>
          }
          <View className="house-more" onClick={() => handleMenuClick(esfPath)}>
            更多房源
        </View>
        </View>
      }


    </View>
  )
}
export default Index