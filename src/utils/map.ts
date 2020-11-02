export const bMapTransQQMap = (lat, lng) => {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lng_new = z * Math.cos(theta);
    let lat_new = z * Math.sin(theta);
    return {
        latitude: lat_new,
        longitude: lng_new
    }
}

export const qqMapTransBMap = (lat, lng) =>{
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng;
    let y = lat;
    let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
    let lat_new = z * Math.sin(theta) + 0.006;
    let lng_new = z * Math.cos(theta) + 0.0065;
    return {
        latitude: lat_new,
        longitude: lng_new
    }
}

export const QQ_MAP_KEY = "LCCBZ-3MO6G-YORQJ-IGG74-EASA7-E4BPD"

export const getStaticMap = (lat: number, lng: number, zoom: number = 16) => {
    const location = bMapTransQQMap(lat, lng)
    const center = `${location.latitude},${location.longitude}`
    return `https://apis.map.qq.com/ws/staticmap/v2/?center=${center}&zoom=${zoom}&size=600*300&key=${QQ_MAP_KEY}`
}
