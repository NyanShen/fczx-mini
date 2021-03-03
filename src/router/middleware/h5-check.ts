import Taro from '@tarojs/taro'
import { IMiddlware } from "tarojs-router"

interface IState {
  checkH5: boolean
}

export const IsH5Check: IMiddlware<IState> = async (ctx, next) => {
  if (ctx.route.ext?.checkH5) {
    if (IS_H5) {
      Taro.showModal({
        title: '提示',
        content: '微信搜索“房产在线”小程序，再继续访问该页面吧',
        showCancel: false
      })
      throw Error('该页面H5暂不支持：' + ctx.route.url)
    }
  }
  await next()
}