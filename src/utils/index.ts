export const formatPhoneCall = (number: string) => {
    return number.replace(/[转]/ig, ',').replace(/[^0-9|,]/ig, "")
}

export const keywordcolorful = (str, key) => {
    let reg = new RegExp(`(${key})`, 'g')
    let newstr = str.replace(reg, '<span style="color: #11a43c">$1</span>')
    return newstr
}

export const formatTimestamp = (timestamp: string, fmt = 'yy-MM-dd hh:mm:ss') => {
    const date = new Date(Number(timestamp) * 1000)
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

// 格式化时间段
const toTimeSolt = (h: number) => {
    let bt = '';
    if (0 <= h && h <= 3)
        bt = '凌晨';
    if (4 <= h && h <= 8)
        bt = '早上';
    if (9 <= h && h <= 11)
        bt = '上午';
    if (12 == h)
        bt = '中午';
    if (13 <= h && h <= 17)
        bt = '下午';
    if (18 <= h && h <= 23)
        bt = '晚上';

    return bt;
}

// 格式星期
const toWeek = (w: number) => {
    let week = '';
    switch (w) {
        case 0:
            week = '星期日';
            break;
        case 1:
            week = '星期一';
            break;
        case 2:
            week = '星期二';
            break;
        case 3:
            week = '星期三';
            break;
        case 4:
            week = '星期四';
            break;
        case 5:
            week = '星期五';
            break;
        case 6:
            week = '星期六';
            break;
    }
    return week;
}

export const formatChatListTime = (timestamp: string, type: number = 1) => {
    let oldtime = new Date(Number(timestamp) * 1000);
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); //今天凌晨
    let yestday = new Date(today - 24 * 3600 * 1000).getTime();
    // let beforeYestday = new Date(today - 24 * 3600 * 1000 * 2).getTime();
    let beforeWeek = new Date(today - 24 * 3600 * 1000 * 7).getTime();
    let Y = oldtime.getFullYear(); //年份
    let M = oldtime.getMonth() + 1; //月份         
    let d = oldtime.getDate(); //日         
    // let h = oldtime.getHours() % 12 == 0 ? 12 : oldtime.getHours() % 12; //12小时         
    let H = oldtime.getHours(); //24小时         
    let m = oldtime.getMinutes(); //分 
    let w = toWeek(oldtime.getUTCDay()); //星期
    let timesolt = toTimeSolt(oldtime.getHours()); //时间段 

    let timeStr = '';

    //当天
    if (oldtime.getTime() > yestday) {
        timeStr = H + ':' + m;
    }
    //昨天
    if (oldtime.getTime() < today && yestday <= oldtime.getTime()) {
        timeStr = '昨天 ' + (type == 1 ? H + ':' + m : '');
    }
    // 一周内
    if (oldtime.getTime() < yestday && beforeWeek <= oldtime.getTime()) {
        timeStr = w + (type == 1 ? ' ' + H + ':' + m : '');
    }
    // 一周前
    if (oldtime.getTime() < beforeWeek) {
        timeStr = type == 1 ? Y + '年' + M + '月' + d + '日 ' + timesolt + ' ' + H + ':' + m : Y + '/' + M + '/' + d;
    }
    // 比当前时间晚
    if (oldtime.getTime() > date.getTime()) {
        timeStr = '手动修改';
    }

    return timeStr;
}
