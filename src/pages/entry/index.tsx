import Taro, { getCurrentInstance, useReady } from "@tarojs/taro"

const Entry = () => {
    const router = getCurrentInstance().router
    const params = router?.params.scene || ''

    useReady(() => {
        const scene: string = decodeURIComponent(params)
        Taro.redirectTo({
            url: `${scene.trim()}`
        })
    })

    return null
}

export default Entry