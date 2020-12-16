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
    propertyType?: IFilter
    buildYear?: IFilter
}

export const initial_value: IFilter = { id: '', name: '' }
export const default_value: IFilter = { id: 'all', name: '不限' }

export const INIT_CONDITION: IConditionState = {
    currentPage: 1,
    areaList: default_value,
    circle: [default_value],
    subway: default_value,
    station: [default_value],
    propertyType: default_value,
    buildYear: default_value
}

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
        type: 'propertyType',
        name: '建筑类型',
        keys: ['propertyType'],
        subTabs: []
    },
    {
        type: 'buildYear',
        name: '房龄',
        keys: ['buildYear'],
        subTabs: []
    }
]

const keys = [
    'areaList',
    'subway',
    'propertyType',
    'buildYear'
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