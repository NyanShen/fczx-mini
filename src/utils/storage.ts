import Taro from '@tarojs/taro'

const setItem = (key: string, value: any, moduleName: string = "") => {
    if (moduleName) {
        let moduleData = getItem(moduleName) || {}
        moduleData[key] = value;
        Taro.setStorageSync(moduleName, moduleData)
    } else {
        Taro.setStorageSync(key, value)
    }
}

const getItem = (key: string, moduleName: string = "") => {
    if (moduleName) {
        let value = getItem(moduleName)
        if (value) {
            return value[key]
        }
        return ''
    } else {
        return Taro.getStorageSync(key)
    }
}

const clear = (key) => {
    key ? Taro.removeStorageSync(key) : Taro.clearStorageSync()
}

export default { setItem, getItem, clear }