export const keywordcolorful = (str, key) => {
    let reg = new RegExp(`(${key})`, 'g')
    let newstr = str.replace(reg, '<span style="color: #11a43c">$1</span>')
    return newstr
}

export const formatTimestamp = (timestamp, fmt = 'yy-MM-dd hh:mm:ss') => {
    const date = new Date(timestamp * 1000)
    const o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "h+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        "S": date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + ""));
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
        }
    }
    return fmt
}