import Taro from '@tarojs/taro'
// 等额本息每月还款金额计算
export const equalInterestCalc = (loanMoney: number, monthRatio: number, loanPeriod: number) => {
    // 等额本息每月还款金额 =〔贷款本金*月利率*(月利率+1)^还款月数〕÷〔(1+月利率)^还款月数-1〕。
    return 10000 * loanMoney * monthRatio * (Math.pow((1 + monthRatio), loanPeriod)) / (Math.pow((1 + monthRatio), loanPeriod) - 1);
}

// 等额本金每月还款金额计算
export const equalCapitalCalc = (loanMoney: number, monthRatio: number, loanPeriod: number, payMonth: number = 0) => {
    // 万元转元计算
    let loanMoneyUnit = loanMoney * 10000
    // 累计已还款本金=（贷款本金/总还款月数）*已还款月数
    let addPayMoney = (loanMoneyUnit / loanPeriod) * payMonth
    // 每月还款额=（贷款本金/总还款月数）+(贷款本金-累计已还款本金)*月利率
    return (loanMoneyUnit / loanPeriod) + (loanMoneyUnit - addPayMoney) * monthRatio
}

export const monthlyDecreaseCalc = (loanMoney: number, monthRatio: number, loanPeriod: number) => {
    return equalCapitalCalc(loanMoney, monthRatio, loanPeriod) - equalCapitalCalc(loanMoney, monthRatio, loanPeriod, 1)
}

// 等额本金总利息
export const totalInterestCalc = (loanPeriod: number, loanMoney: number, monthRatio: number) => {
    // 总利息=(还款月数+1)*总贷款额*月利率÷2)
    return (loanPeriod + 1) * loanMoney * monthRatio / 2
}

export const validatePrice = (filedValue: string | number, name: string) => {
    if (filedValue === '0' || !filedValue) {
        Taro.showToast({
            title: `请输入${name}`,
            icon: 'none'
        })
        return true
    }
}