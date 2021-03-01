import storage from '@/utils/storage'
import { toUrlParam } from '@/utils/urlHandler'
import { IMiddlware } from "tarojs-router"
import { toLogin } from '../router'

interface ILoginBack {
  checkLogin: boolean
  type: string
}

export const HasLoginBack: IMiddlware<ILoginBack> = async (ctx, next) => {
  if (ctx.route.ext?.checkLogin) {
    const token = storage.getItem('token')
    if (!token) {
      const isTab = ctx.params.isTab || ''
      const backUrl = `${ctx.route.url}${toUrlParam(ctx.params)}`
      toLogin({ backUrl: encodeURIComponent(backUrl), isTab }, ctx.route.ext?.type)
      throw Error('该页面必须要登陆：' + ctx.route.url)
    }
  }
  await next()
}