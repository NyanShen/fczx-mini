import find from 'lodash/find'
import api from '@services/api'
import app from '@services/request'

export interface IFilter {
    id: string
    name: string
    value?: string
}

export interface IConditionState {
    currentPage: number
    areaList?: IFilter
    circle?: IFilter[]
    subway?: IFilter
    station?: IFilter[]
    unitPrice?: IFilter
    totalPrice?: IFilter
    priceType?: string
    room?: IFilter
    propertyType?: IFilter
    fangBuildingType?: IFilter
    saleStatus?: IFilter
    renovationStatus?: IFilter
    projectFeature?: IFilter
    __discount?: IFilter
}

export const initial_value: IFilter = { id: '', name: '' }
export const default_value: IFilter = { id: 'all', name: '不限' }

export const INIT_CONDITION: IConditionState = {
    currentPage: 1,
    priceType: '',
    areaList: default_value,
    circle: [default_value],
    subway: default_value,
    station: [default_value],
    unitPrice: default_value,
    totalPrice: initial_value,
    room: default_value,
    propertyType: initial_value,
    fangBuildingType: initial_value,
    saleStatus: initial_value,
    renovationStatus: initial_value,
    projectFeature: initial_value,
    __discount: initial_value
}

export const SALE_STATUS_ATTR: IFilter[] = [
    {
        id: '1',
        name: '在售'
    },
    {
        id: '2',
        name: '待售'
    },
    {
        id: '3',
        name: '售罄'
    }
]

export const filterParam = (id: any) => {
    return id === 'all' ? '' : id
}

export const filterArrParam = (params: any) => {
    const result: string[] = []
    if (params && params.length > 0) {
        for (const item of params) {
            if (item.id !== 'all') {
                result.push(item.id)
            }
        }
    }
    return result
}


export const findTarget = (list: IFilter[], item: IFilter) => {
    return find(list, { id: item.id })
}


export const tabs: any[] = [
    {
        type: 'location',
        name: '位置',
        keys: ['areaList', 'circle', 'subway', 'station'],
        subTabs: [
            {
                name: '区域',
                type: 'areaList',
                subType: 'circle',
                actived: true
            },
            {
                name: '地铁',
                type: 'subway',
                subType: 'station',
                actived: false
            }
        ]
    },
    {
        type: 'price',
        name: '价格',
        keys: ['totalPrice', 'unitPrice'],
        subTabs: [
            {
                id: '1',
                name: '按单价',
                type: 'unitPrice',
                subType: '',
                actived: true
            },
            {
                id: '2',
                name: '按总价',
                type: 'totalPrice',
                subType: '',
                actived: false
            }
        ]
    },
    {
        type: 'room',
        name: '户型',
        keys: ['room'],
        subTabs: []
    },
    {
        type: 'more',
        name: '更多',
        keys: ['propertyType', 'fangBuildingType', 'renovationStatus', 'saleStatus'],
        subTabs: []
    }
]

const keys = [
    'areaList',
    'subway',
    'propertyType',
    'totalPrice',
    'unitPrice',
    'room',
    'fangBuildingType',
    'renovationStatus',
    'projectFeature'
]


export const fetchCondition = (callback: (any) => void) => {
    app.request({
        url: app.areaApiUrl(api.getHouseAttr),
        data: {
            key: keys.join(',')
        }
    }).then((result: any) => {
        callback(result)
    })
}