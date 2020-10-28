export const getStaticMap = (lng: number, lat: number, zoom: number = 16) => {
    return `http://api.map.baidu.com/staticimage?center=${lng},${lat}&markerStyles=l&zoom=${zoom}`
}

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
