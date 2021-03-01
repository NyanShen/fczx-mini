import { Router, NavigateType } from 'tarojs-router'

import { routes } from './routes'

export const toLogin = (params: any = {}, type: string = '') => {
    let url: string = ''
    if (IS_H5) {
        url = `/login/phone/index`
    } else {
        url = `/login/index`
    }
    if (type) {
        Router.navigate(
            { url },
            {
                params,
                type: NavigateType.navigateTo
            }
        )
    } else {
        Router.navigate(
            { url },
            { type: NavigateType.redirectTo }
        )
    }
}

export const toHouseNew = (module: string, params: any = {}, data: any = {}) => {
    return Router.navigate(routes[`house${module}`], { params, data })
}

export const toChatRoom = (params: any = {}) => {
    return Router.navigate(routes.chatRoom, { params })
}