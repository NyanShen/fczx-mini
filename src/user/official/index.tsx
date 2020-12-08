import React from 'react'
import { WebView } from "@tarojs/components"


const Official = () => {
    const source_url = `https://mp.weixin.qq.com/s?__biz=MzkxODE4MTgzOQ==&mid=2247483654&idx=1&sn=b48f00b1beb8c129a0da9675e3984d1e`
    return (
        <WebView src={source_url}></WebView>
    )
}

export default Official
