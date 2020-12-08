import React, { useState } from 'react'
import Taro, { useDidShow, useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import classnames from 'classnames'

import api from '@services/api'
import app from '@services/request'
import storage from '@utils/storage'
import new_house from '@assets/icons/new_house.png'
import second_house from '@assets/icons/house.png'
import rent_house from '@assets/icons/rent_house.png'
import community from '@assets/icons/community.png'
import house_calc from '@assets/icons/house_calc.png'
import news from '@assets/icons/news.png'
import { PROJECT_NAME } from '@constants/global'
import { PRICE_TYPE, SALE_STATUS } from '@constants/house'
import '@styles/common/house.scss'
import './index.scss'

const menuContent = [{
  children: [
    {
      name: '新盘',
      icon: new_house,
      path: '/house/new/list/index'
    },
    {
      name: '二手房',
      icon: second_house,
      path: '/house/esf/list/index'
    },
    {
      name: '租房',
      icon: rent_house,
      path: '/house/rent/list/index'
    },
    {
      name: '小区',
      icon: community,
      path: '/house/community/list/index'
    },
    {
      name: '资讯',
      icon: news,
      path: '/news/list/index'
    },
    {
      name: '房贷计算',
      icon: house_calc,
      path: '/calculator/index'
    }
  ]
}]

const house_menus = [
  {
    name: '热门楼盘',
  },
  {
    name: '精选楼盘',
    path: '/house/new/list/index'
  },
  {
    name: '看房团',
    path: ''
  },
  {
    name: '地图找房',
    path: '/house/new/map/index'
  },
  {
    name: '更多',
    path: '/house/new/list/index'
  }
]

const esf_menus = [
  {
    name: '二手房',
  },
  {
    name: '小区',
    path: '/house/community/list/index'
  },
  {
    name: '租房',
    path: '/house/rent/list/index'
  },
  {
    name: '更多',
    path: '/house/esf/list/index'
  }
]


const Index = () => {

  const [city, setCity] = useState<any>({})
  const [houseList, setHouseList] = useState<any[]>([])
  const [esfList, setEsfList] = useState<any[]>([])
  const [activity, setActivity] = useState<string[]>([])


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
    const currentCity = storage.getItem('city')
    if (!currentCity) {
      Taro.showModal({
        title: '提示',
        content: '请先选择一个的城市',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            Taro.navigateTo({
              url: '/house/city/index'
            })
          }
        }
      })
      return
    }
    if (currentCity.id !== city.id) {
      setCity(currentCity)
      fetchHouseList()
      fetchEsfList()
    }
  })

  const fetchHouseList = () => {
    app.request({
      url: app.areaApiUrl(api.getHouseList),
      data: {
        page: 1,
        limit: 20
      }
    }).then((result: any) => {
      setHouseList(result.data)
    })
  }
  const fetchEsfList = () => {
    app.request({
      url: app.areaApiUrl(api.getEsfList),
      data: {
        page: 1,
        limit: 20
      }
    }).then((result: any) => {
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

  return (
    <View className="index">
      <View className="index-search">
        <View className="index-search-content clearfix">
          <View className="iconfont iconsearch"></View>
          <View className="index-search-content-desc" onClick={toHouseSearch}>输入区县、小区名</View>
          <View className="index-search-content-text" onClick={toCityList}>
            <Text className="iconfont iconmap"></Text>
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
      <View className="house-list">
        <View className="index-header">
          {
            house_menus.map((item: any, index: number) => (
              <View
                key={index}
                className="header-item"
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
                      <Image src={item.image_path} mode="aspectFill"></Image>
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
                      <View className="mb12">
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
                  <View className="house-activity" onClick={() => handleActivity(item.id)}>
                    <View className="activity-content">
                      {
                        item.is_discount == '1' &&
                        <View className="activity-item">
                          <Text className="iconfont iconcoupon"></Text>
                          <Text className="text">{item.fangHouseDiscount.title}</Text>
                        </View>
                      }
                      {
                        item.is_group == '1' && activity.includes(item.id) &&
                        <View className="activity-item">
                          <Text className="iconfont iconstars"></Text>
                          <Text className="text">{item.fangHouseGroup.title}</Text>
                        </View>
                      }
                    </View>
                    {
                      item.is_discount == '1' &&
                      item.is_group == '1' &&
                      <View className="activity-icon">
                        <Text className={classnames('iconfont', activity.includes(item.id) ? 'iconarrow-up-bold':'iconarrow-down-bold')}></Text>
                      </View>
                    }
                  </View>
                </View>
              ))
            }
          </View>
        }
        <View className="house-more">
          更多房源
        </View>
      </View>

      <View className="house-list">
        <View className="index-header">
          {
            esf_menus.map((item: any, index: number) => (
              <View
                key={index}
                className="header-item"
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
                      <Image src={item.image_path} mode="aspectFill"></Image>
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
        <View className="house-more">
          更多房源
        </View>
      </View>
    </View>
  )
}
export default Index