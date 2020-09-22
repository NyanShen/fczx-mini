export const PRICE_TYPE = {
    "1": "元/m²",
    "2": "万",
    "3": "元/月"
}

export const SALE_STATUS = {
    "1": "在售",
    "2": "待售",
    "3": "售完"
}

export interface ISurroundTab {
    name: string
    type: string
    icon: string
}

export const SURROUND_TABS: ISurroundTab[] = [
    {
        name: '交通',
        type: 'traffic',
        icon: 'icontraffic'
    },
    {
        name: '学校',
        type: 'education',
        icon: 'iconeducation'
    },
    {
        name: '银行',
        type: 'bank',
        icon: 'iconbank'
    },
    {
        name: '医院',
        type: 'hospital',
        icon: 'iconyiyuan'
    },
    {
        name: '购物',
        type: 'shopping',
        icon: 'iconShopping'
    }
]