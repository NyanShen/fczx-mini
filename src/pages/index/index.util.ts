import HOUSE_ICON from '@assets/icons/house.png'
import ESF_ICON from '@assets/icons/esf.png'
import RENT_ICON from '@assets/icons/rent.png'
import COMMUNITY from '@assets/icons/community.png'
import CALC_ICON from '@assets/icons/calc.png'
import BUS from '@assets/icons/bus.png'
import news from '@assets/icons/news.png'

export const esfPath = '/house/esf/list/index'
export const housePath = '/house/new/list/index'

export const house_menu = [
    {
        name: '新盘',
        icon: HOUSE_ICON,
        path: housePath
    }
]

export const house_group_menu = [
    {
        name: '看房团',
        icon: BUS,
        path: `/house/group/index`
    }
]

export const house_sub_menu = [
    {
        name: '热门楼盘',
    },
    {
        name: '优惠楼盘',
        path: `${housePath}?is_recommend=1`
    },
    {
        name: '看房团',
        path: `/house/group/index`
    },
    {
        name: '地图找房',
        path: '/house/new/map/index'
    },
    {
        name: '更多',
        path: housePath
    }
]

export const esf_menu = [
    {
        name: '二手房',
        icon: ESF_ICON,
        path: esfPath
    },
    {
        name: '租房',
        icon: RENT_ICON,
        path: '/house/rent/list/index'
    },
    {
        name: '小区',
        icon: COMMUNITY,
        path: '/house/community/list/index'
    }
]

export const esf_sub_menu = [
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
        path: esfPath
    }
]

export const news_menu = [
    {
        name: '资讯',
        icon: news,
        path: '/news/list/index'
    }
]

export const calc_menu = [
    {
        name: '房贷计算',
        icon: CALC_ICON,
        path: '/calculator/index'
    }
]