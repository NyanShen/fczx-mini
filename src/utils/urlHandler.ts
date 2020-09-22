
// url参数转对象 ?name="nyan" => {name: "nyan"}
export const transferUrlParam = (urlParam: string) => {
    let param = {};
    if (!urlParam) {
        return param;
    }
    if (urlParam.indexOf("?") !== -1) {
        urlParam = urlParam.substring(1);
    }
    const urlParams = urlParam.split("&");
    urlParams.forEach(item => {
        if (item) {
            const itemArr = item.split("=");
            param[itemArr[0]] = itemArr[1];
        }
    });
    return param
}
// 对象转url参数 {name: "nyan"} => ?name="nyan"
export const toUrlParam = (param: {}) => {
    if (!param) return;
    if (typeof param !== "object") return;
    let urlParam = "";
    for (const key in param) {
        if (param.hasOwnProperty(key)) {
            if (urlParam) {
                urlParam = urlParam + `&${key}=${param[key]}`;
            } else {
                urlParam = urlParam + `?${key}=${param[key]}`;
            }
        }
    }
    return urlParam;
}