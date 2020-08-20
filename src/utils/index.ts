export const keywordcolorful = (str, key) => {
    let reg = new RegExp(`(${key})`, 'g')
    let newstr = str.replace(reg, '<span style="color: #11a43c">$1</span>')
    return newstr
}