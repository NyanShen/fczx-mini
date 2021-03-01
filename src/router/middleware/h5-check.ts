import { IMiddlware } from "tarojs-router"

interface IState {
  checkH5: boolean
}

export const IsH5Check: IMiddlware<IState> = async (ctx, next) => {
  if (ctx.route.ext?.checkH5) {
    if (IS_H5) {
        throw Error('该页面H5暂不支持：' + ctx.route.url)
    }
  }
  await next()
}