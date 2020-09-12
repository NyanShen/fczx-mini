import React, { useState } from 'react'
import { View, Text, ScrollView, Input, Image } from '@tarojs/components'
import classnames from 'classnames'
import { find, remove } from 'lodash'

import NavBar from '@components/navbar/index'
import useNavData from '@hooks/useNavData'
import '@styles/common/house-list.scss'
import '@styles/common/search-tab.scss'
import './index.scss'

interface IFilter {
    id: string
    name: string
    value?: string
}

interface IConditionState {
    region?: IFilter
    unit_price?: IFilter
    total_price?: IFilter
    house_type?: IFilter
    house_property?: IFilter
    sale_status?: IFilter
    renovation?: IFilter
    feature?: IFilter

}

const initial_value = { id: '', name: '', value: '' }

const INIT_CONDITION = {
    region: { id: 'all000', name: '不限', value: '' },
    unit_price: { id: 'all000', name: '不限', value: '' },
    total_price: initial_value,
    house_type: { id: 'all000', name: '不限', value: '' },
    house_property: initial_value,
    sale_status: initial_value,
    renovation: initial_value,
    feature: initial_value
}

const NewHouse = () => {
    const { appHeaderHeight, contentHeight } = useNavData()
    const scrollHeight = contentHeight * 0.5 - 60
    const scrollMoreHeight = contentHeight * 0.6 - 60
    const [tab, setTab] = useState<string>('')
    const [priceType, setPriceType] = useState<string>('unit_price')
    const [selected, setSelected] = useState<IConditionState>(INIT_CONDITION)
    const tabs = [
        {
            type: 'region',
            name: '区域',
            keys: ['region']
        },
        {
            type: 'price',
            name: '价格',
            keys: ['unit_price', 'total_price']
        },
        {
            type: 'house_type',
            name: '户型',
            keys: ['house_type']
        },
        {
            type: 'more',
            name: '更多',
            keys: ['house_property', 'sale_status', 'renovation', 'feature']
        }]
    const priceTabs = [
        {
            id: 'id_01',
            name: '按单价',
            value: "unit_price"
        },
        {
            id: 'id_02',
            name: '按总价',
            value: "total_price"
        }
    ]
    const conditions = {
        region: [
            {
                id: 'all000',
                name: '不限',
                value: ''
            },
            {
                id: '1001',
                name: '樊城区',
                value: '1001'
            },
            {
                id: '1002',
                name: '襄城区',
                value: '1002'
            },
            {
                id: '1003',
                name: '襄州区',
                value: '1003'
            },
            {
                id: '1004',
                name: '谷城县',
                value: '1004'
            },
            {
                id: '1005',
                name: '老河口',
                value: '1005'
            },
            {
                id: '1006',
                name: '宜城',
                value: '1006'
            },
            {
                id: '1007',
                name: '万达广场测试',
                value: '1007'
            }
        ],
        unit_price: [
            {
                id: 'all000',
                name: '不限',
                value: ''
            },
            {
                id: '001',
                name: '4000元/m²以下',
                value: '4000'
            },
            {
                id: '002',
                name: '4000-5000元/m²',
                value: '4000-5000'
            },
            {
                id: '003',
                name: '5000-6000元/m²',
                value: '5000-6000'
            },
            {
                id: '004',
                name: '6000-7000元/m²',
                value: '6000-7000'
            },
            {
                id: '005',
                name: '7000-8000元/m²',
                value: '7000-8000'
            },
            {
                id: '006',
                name: '8000-9000元/m²',
                value: '8000-9000'
            },
            {
                id: '007',
                name: '9000-10000元/m²',
                value: '9000-10000'
            },
            {
                id: '008',
                name: '10000元/m²',
                value: '10000'
            },
        ],
        total_price: [
            {
                id: 'all000',
                name: '不限',
                value: ''
            },
            {
                id: '001',
                name: '20万以下',
                value: '20'
            },
            {
                id: '002',
                name: '20-50万',
                value: '20-50'
            },
            {
                id: '003',
                name: '50-100万',
                value: '50-100'
            },
            {
                id: '004',
                name: '100万以上',
                value: '100'
            }
        ],
        house_type: [
            {
                id: 'all000',
                name: '不限',
                value: ''
            },
            {
                id: '001',
                name: '一居',
                value: '1'
            },
            {
                id: '002',
                name: '二居',
                value: '2'
            },
            {
                id: '003',
                name: '三居',
                value: '3'
            },
            {
                id: '004',
                name: '四居',
                value: '4'
            },
            {
                id: '005',
                name: '五居',
                value: '5'
            },
            {
                id: '006',
                name: '五居以上',
                value: '6'
            }
        ],
        house_property: [
            {
                id: '001',
                name: '住宅',
                value: '住宅'
            },
            {
                id: '002',
                name: '别墅',
                value: '别墅'
            },
            {
                id: '003',
                name: '写字楼',
                value: '写字楼'
            },
            {
                id: '004',
                name: '商住',
                value: '商住'
            },
            {
                id: '005',
                name: '商铺',
                value: '商铺'
            },
        ],
        sale_status: [
            {
                id: '001',
                name: '待售',
                value: '待售'
            },
            {
                id: '002',
                name: '在售',
                value: '在售'
            },
            {
                id: '003',
                name: '售完',
                value: '售完'
            },
        ],
        renovation: [
            {
                id: '001',
                name: '毛坯',
                value: '毛坯'
            },
            {
                id: '002',
                name: '普通装修',
                value: '普通装修'
            },
            {
                id: '003',
                name: '精装修',
                value: '精装修'
            },
            {
                id: '004',
                name: '豪华装修',
                value: '豪华装修'
            }
        ],
        feature: [
            {
                id: '001',
                name: '小戶型',
                value: '小戶型'
            },
            {
                id: '002',
                name: '低总价',
                value: '低总价'
            }
        ]
    }

    const switchCondition = (item) => {
        if (tab === item.type) {
            setTab('')
            return
        }
        setTab(item.type)
    }

    const handleSingleClick = (key: string, item: any) => {
        setTab('')
        if (key === 'unit_price') {
            setSelected({
                ...selected,
                total_price: initial_value,
                [key]: item
            })
        } else if (key === 'total_price') {
            setSelected({
                ...selected,
                unit_price: initial_value,
                [key]: item
            })
        } else {
            setSelected({
                ...selected,
                [key]: item
            })
        }
    }
    const handleMultiClick = (key: string, item: any) => {
        let selectedValue = selected[key]
        if (selectedValue instanceof Object) {
            if (selectedValue.id === item.id) {
                setSelected({
                    ...selected,
                    [key]: initial_value
                })
            } else {
                setSelected({
                    ...selected,
                    [key]: item
                })
            }
        }

        if (selectedValue instanceof Array) {
            let target = find(selectedValue, { id: item.id })
            if (target) {
                remove(selectedValue, { id: item.id })
                setSelected({
                    ...selected,
                    [key]: selectedValue
                })
            } else {
                setSelected({
                    ...selected,
                    [key]: [...selectedValue, item]
                })
            }
        }
    }

    const handleReset = () => {
        setSelected({
            ...selected,
            house_property: initial_value,
            renovation: initial_value,
            sale_status: initial_value,
            feature: initial_value
        })
    }

    const handleConfirm = () => {
        setTab('')
    }

    const renderSplitItem = (key: string) => {
        return (
            <ScrollView className="split-list flex-item" scrollY style={{ height: scrollHeight }}>
                {
                    conditions[key].map((item: any, index: number) => (
                        <View
                            key={index}
                            className={classnames("split-item", selected[key].id === item.id && 'actived')}
                            onClick={() => handleSingleClick(key, item)}
                        >{item.name}
                        </View>
                    ))
                }
            </ScrollView>
        )
    }

    const renderMultiItem = (key: string, title: string = '') => {
        return (
            <View className="search-multi-item">
                {title && <View className="title">{title}</View>}
                <View className="options">
                    {
                        conditions[key].map((item: any, index: number) => (
                            <View
                                key={index}
                                className={classnames("options-item", selected[key].id === item.id && 'actived')}
                                onClick={() => handleMultiClick(key, item)}
                            >
                                {item.name}
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

    const renderShowName = (item: any) => {
        let showList: string[] = []
        for (const key of item.keys) {
            if (selected[key] instanceof Object) {
                let showName: string = selected[key].name
                if (!showName || ['不限', '全部'].includes(showName)) {
                    continue
                }
                showList.push(showName)
            }
        }

        if (showList.length > 1) {
            showList = ['多选']
        }

        return showList.join(',')
    }
    return (
        <View className="newhouse">
            <NavBar title="新房" back={true} />
            <View className="fixed-top" style={{ top: appHeaderHeight }}>
                <View className="newhouse-header view-content">
                    <View className="newhouse-search">
                        <Text className="iconfont iconsearch"></Text>
                        <Text className="newhouse-search-text placeholder">请输入楼盘名称或地址</Text>
                    </View>
                    <View className="newhouse-nav-right">
                        <Text className="iconfont iconmap"></Text>
                        <Text className="text">地图找房</Text>
                    </View>
                </View>
                <View className="search-tab">
                    {

                        tabs.map((item: any, index: number) => {
                            let showName = renderShowName(item)
                            return (
                                <View
                                    key={index}
                                    className={classnames('search-tab-item', showName && 'actived')}
                                    onClick={() => switchCondition(item)}
                                >
                                    <Text className="text">{showName ? showName : item.name}</Text>
                                    <Text className="iconfont iconarrow-down-bold"></Text>
                                </View>
                            )
                        })
                    }
                </View>
                <View className={classnames('search-container', tab === 'region' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            <View className="split-type flex-item">
                                <View className="split-item actived">区域</View>
                            </View>
                            {renderSplitItem('region')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', tab === 'price' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            <View className="split-type flex-item">
                                {
                                    priceTabs.map((item: any) => (
                                        <View
                                            key={item.id}
                                            className={classnames("split-item", item.value === priceType && 'actived')}
                                            onClick={() => setPriceType(item.value)}>
                                            {item.name}
                                        </View>
                                    ))
                                }
                            </View>
                            {renderSplitItem(priceType)}
                        </View>
                    </View>
                    {/* <View className="search-footer">
                        <Input className="search-input" placeholder="最低价" />-
                        <Input className="search-input" placeholder="最高价" />
                        <View className="btn confirm-btn single-btn">确定</View>
                    </View> */}
                </View>
                <View className={classnames('search-container', tab === 'house_type' && 'actived')}>
                    <View className="search-content">
                        <View className="search-split">
                            {renderSplitItem('house_type')}
                        </View>
                    </View>
                </View>
                <View className={classnames('search-container', 'search-multi-container', tab === 'more' && 'actived')}>
                    <ScrollView className="search-content search-content-scroll" scrollY style={{ maxHeight: scrollMoreHeight }}>
                        {renderMultiItem('house_property', '类型')}
                        {renderMultiItem('renovation', '装修')}
                        {renderMultiItem('sale_status', '状态')}
                        {renderMultiItem('feature', '特色')}
                    </ScrollView>
                    <View className="search-footer">
                        <View className="btn reset-btn" onClick={handleReset}>重置</View>
                        <View className="btn confirm-btn" onClick={handleConfirm}>确定</View>
                    </View>
                </View>
            </View>
            <View className={classnames('mask', tab && 'show')} onClick={() => setTab('')}></View>

            <View className="newhouse-content">
                <View className="house-list view-content">
                    <ScrollView className="house-list-ul">
                        <View className="house-list-li">
                            <View className="li-image">
                                <Image src="//static.fczx.com/www/assets/images/1400x933_1.jpg"></Image>
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
                                <Image src="//static.fczx.com/www/assets/images/1400x933_1.jpg"></Image>
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
                    </ScrollView>
                </View>
            </View>
        </View>
    )
}
export default NewHousek