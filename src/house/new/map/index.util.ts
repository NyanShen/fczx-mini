export interface IFilter {
    id: string
    name: string
    value?: string
}

export interface IConditionState {
    areaList?: IFilter
    unitPrice?: IFilter
    totalPrice?: IFilter
    priceType?: string
    room?: IFilter
    propertyType?: IFilter
    fangBuildingType?: IFilter
    renovationStatus?: IFilter
    zoom: number
    swlng?: number | string
    swlat?: number | string
    nelng?: number | string
    nelat?: number | string
}

export const initial_value: IFilter = { id: '', name: '' }
export const default_value: IFilter = { id: 'all', name: '不限' }

export const INIT_CONDITION: IConditionState = {
    zoom: 11,
    priceType: '',
    areaList: default_value,
    unitPrice: default_value,
    totalPrice: initial_value,
    room: default_value,
    propertyType: initial_value,
    fangBuildingType: initial_value,
    renovationStatus: initial_value,
    swlng: '',
    swlat: '',
    nelat: '',
    nelng: '',
}

export const default_zoom = 12
export const region_zoom = 14

export const tabs: any[] = [
    {
        type: 'areaList',
        name: '区域',
        keys: ['areaList']
    },
    {
        type: 'price',
        name: '价格',
        keys: ['totalPrice', 'unitPrice']
    },
    {
        type: 'room',
        name: '户型',
        keys: ['room']
    },
    {
        type: 'more',
        name: '更多',
        keys: ['propertyType', 'fangBuildingType', 'renovationStatus']
    }
]
export const priceTabs: IFilter[] = [
    {
        id: '1',
        name: '按单价',
        value: "unitPrice"
    },
    {
        id: '2',
        name: '按总价',
        value: "totalPrice"
    }
]