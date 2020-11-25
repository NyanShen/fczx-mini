import Taro, { getCurrentInstance, useReady } from "@tarojs/taro"
import { transferUrlParam } from "@utils/urlHandler"

const Entry = () => {
    const router = getCurrentInstance().router
    const params = router?.params.scene || ''

    const urlMapper = {
        'chat': '/chat/room/index'
    }

    useReady(() => {
        const scene: string = decodeURIComponent(params)
        const paramObj: any = transferUrlParam(scene)
        Taro.redirectTo({
            url: `${urlMapper[paramObj.t]}?id=${paramObj.id}&entry=true`
        })
    })

    return null
}

export default Entry