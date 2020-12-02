import React, { useEffect, useMemo, useState } from 'react'
import { Input, View, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'

import useNavData from '@hooks/useNavData'
import CustomPicker, { INIT_PICKER, IPicker } from '@components/picker'
import {
    equalInterestCalc,
    equalCapitalCalc,
    totalInterestCalc,
    validatePrice,
    monthlyDecreaseCalc
} from './util'
import {
    businessRates,
    calculatorCate,
    fundRates,
    ICate,
    pickerObject,
    INIT_PICKER_VALUE,
    INIT_INPUT_VALUE,
    RESULT_CATES
} from './constant'
import './index.scss'
const INIT_RESULT_SHOW = { show: false, intoView: null }

const Calculator = () => {
    const { contentHeight } = useNavData()
    const [cate, setCate] = useState<any>(calculatorCate[0])
    const [resultShow, setResultShow] = useState<any>(INIT_RESULT_SHOW)
    const [resultCate, setResultCate] = useState<any>(RESULT_CATES[0])
    const [inputValue, setInputValue] = useState<any>(INIT_INPUT_VALUE)
    const [picker, setPicker] = useState<IPicker>(INIT_PICKER)
    const [pickerValue, setPickerValue] = useState<any>(INIT_PICKER_VALUE)
    const [result, setResult] = useState<any>({})

    useEffect(() => {
        calculateHousePrice()
    }, [inputValue.housePrice, pickerValue.loadRatio])

    useEffect(() => {
        if (resultShow.show) {
            calculate()
        }
    }, [resultCate])

    const handleCateChange = (item: ICate) => {
        if (item.id !== cate.id) {
            setCate(item)
            resultShow && setResultShow(INIT_RESULT_SHOW)
        }
    }

    const handleInputChange = (e: any, key: string) => {
        const value = e.detail.value
        const { loanPrice } = inputValue
        switch (key) {
            case 'loanFund':
                if (parseFloat(value) > parseFloat(loanPrice)) {
                    setInputValue({
                        ...inputValue,
                        loanFund: loanPrice,
                        loanBusiness: 0
                    })
                } else {
                    setInputValue({
                        ...inputValue,
                        loanFund: value,
                        loanBusiness: loanPrice - value
                    })
                }
                return
            case 'loanBusiness':
                if (parseFloat(value) > parseFloat(loanPrice)) {
                    setInputValue({
                        ...inputValue,
                        loanFund: 0,
                        loanBusiness: loanPrice
                    })
                } else {
                    setInputValue({
                        ...inputValue,
                        loanFund: loanPrice - value,
                        loanBusiness: value
                    })
                }
                return
            case 'basePoint':
                setInputValue({
                    ...inputValue,
                    [key]: value,
                    rateBusiness: value * 0.01 + pickerValue.businessRateWay.value
                })
                return
            default:
                setInputValue({
                    ...inputValue,
                    [key]: value
                })
        }
    }

    const handleBlurChange = (e: any, key: string) => {
        const value = e.detail.value
        if (!value) {
            setInputValue({
                ...inputValue,
                [key]: 0
            })
        }
    }

    const calculateHousePrice = () => {
        if (!!inputValue.housePrice && !!pickerValue.loadRatio.value) {
            const loanPrice = inputValue.housePrice * pickerValue.loadRatio.value
            setInputValue({
                ...inputValue,
                loanPrice: loanPrice.toFixed(2),
                loanFund: (loanPrice / 2).toFixed(2),
                loanBusiness: (loanPrice / 2).toFixed(2)
            })
        }
    }

    const handlePickerConfirm = (item: any) => {
        if (item) {
            setPickerValue({
                ...pickerValue,
                [picker.name]: item
            })
            calculateFundRate(item)
            calculateBusinessRate(item)
        }
        setPicker({
            ...picker,
            show: false,
        })
    }

    const calculateFundRate = (item: any) => {
        if (picker.name === 'fundPeriod') {
            const rateWayValue = pickerValue.fundRateWay.value
            let rateFund = fundRates['6'] * rateWayValue
            if (item.value <= 5 * 12) {
                rateFund = fundRates['1'] * rateWayValue
            }
            setInputValue({
                ...inputValue,
                rateFund: rateFund.toFixed(2)
            })
        }
        if (picker.name === 'fundRateWay') {
            let rateFund = fundRates['6'] * item.value
            if (pickerValue.fundPeriod.value <= 5 * 12) {
                rateFund = fundRates['1'] * item.value
            }
            setInputValue({
                ...inputValue,
                rateFund: rateFund.toFixed(2)
            })
        }
    }

    const calculateBusinessRate = (item: any) => {
        const { type, value } = pickerValue.businessRateWay
        if (picker.name === 'businessPeriod' && !type) {
            let rateBusiness = businessRates['6'] * value
            if (item.value <= 5 * 12) {
                rateBusiness = businessRates['5'] * value
            }
            if (item.value <= 1 * 12) {
                rateBusiness = businessRates['1'] * value
            }
            setInputValue({
                ...inputValue,
                rateBusiness: rateBusiness.toFixed(2)
            })
        }
        if (picker.name === 'businessRateWay' && !item.type) {
            let rateBusiness = businessRates['6'] * item.value
            if (pickerValue.businessPeriod.value <= 5 * 12) {
                rateBusiness = businessRates['5'] * item.value
            }
            if (pickerValue.businessPeriod.value <= 1 * 12) {
                rateBusiness = businessRates['1'] * item.value
            }
            setInputValue({
                ...inputValue,
                rateBusiness: rateBusiness.toFixed(2)
            })
        }
        if (picker.name === 'businessRateWay' && item.type) {
            setInputValue({
                ...inputValue,
                rateBusiness: item.value
            })
        }
    }

    const selectPicker = (name: string) => {
        setPicker({
            name,
            show: true,
            list: pickerObject[name],
            item: pickerValue[name].value ? pickerValue[name] : INIT_PICKER_VALUE[name]
        })
    }

    const calculate = () => {
        if (validatePrice(inputValue.housePrice, '房屋总价')) return
        if (validatePrice(inputValue.loanPrice, '贷款比例')) return
        let loanFund: number = 0 // 贷款金额
        let loanBusiness: number = 0
        let monthlyPayFund: number = 0 // 每月|首月还款
        let monthlyPayBusiness: number = 0
        let fundPeriod = pickerValue.fundPeriod.value //贷款年限
        let businessPeriod = pickerValue.businessPeriod.value
        let monthlyRateFund = (inputValue.rateFund / 100) / 12 //月利率
        let monthlyRateBusiness = (inputValue.rateBusiness / 100) / 12
        let totalPayMoney: number = 0 //总还款金额
        let totalInterest: number = 0 //总利息
        let monthlyDecrease: number = 0
        switch (cate.type) {
            case "fund":
                loanFund = inputValue.loanPrice
                loanBusiness = 0
                break
            case "business":
                loanFund = 0
                loanBusiness = inputValue.loanPrice
                break
            case "group":
                loanFund = inputValue.loanFund
                loanBusiness = inputValue.loanBusiness
                break
            default:
        }

        if (resultCate.type === 'interest') {
            monthlyPayFund = equalInterestCalc(loanFund, monthlyRateFund, fundPeriod);
            monthlyPayBusiness = equalInterestCalc(loanBusiness, monthlyRateBusiness, businessPeriod);
            totalPayMoney = (monthlyPayFund * fundPeriod + monthlyPayBusiness * businessPeriod) / 10000
            // 总利息=还款月数×每月月供额-贷款本金
            totalInterest = totalPayMoney - inputValue.loanPrice
        } else {
            monthlyPayFund = equalCapitalCalc(loanFund, monthlyRateFund, fundPeriod);
            monthlyPayBusiness = equalCapitalCalc(loanBusiness, monthlyRateBusiness, businessPeriod);
            totalInterest = totalInterestCalc(fundPeriod, loanFund, monthlyRateFund) + totalInterestCalc(businessPeriod, loanBusiness, monthlyRateBusiness)
            monthlyDecrease = monthlyDecreaseCalc(loanFund, monthlyRateFund, fundPeriod) + monthlyDecreaseCalc(loanBusiness, monthlyRateBusiness, businessPeriod)
        }
        let result = {
            monthlyPay: (monthlyPayFund + monthlyPayBusiness).toFixed(2), //月均|首月还款
            firstPay: (inputValue.housePrice - inputValue.loanPrice).toFixed(2), // 首付
            loanPrice: inputValue.loanPrice, // 贷款金额
            interest: totalInterest.toFixed(2), // 总利息
            monthlyDecrease: monthlyDecrease.toFixed(2)
        }
        setResult(result)
        setResultShow({
            show: true,
            intoView: 'view_result'
        })
    }

    const customPicker = () => useMemo(() => {
        return (
            <CustomPicker
                item={picker.item}
                name={picker.name}
                show={picker.show}
                list={picker.list}
                onConfirm={handlePickerConfirm}
            ></CustomPicker>
        )
    }, [picker])

    const renderValue = (value: string) => {
        return value ?
            <Text className="input-text">{value}</Text> :
            <Text className="input-placeholder">请选择</Text>
    }

    const renderPicker = (name: string, text: string) => (
        <View className="calc-item" onClick={() => selectPicker(name)}>
            <View className="item-label">{text}</View>
            <View className="item-input">
                {renderValue(pickerValue[name].name)}
            </View>
            <View className="item-icon">
                <Text className="iconfont iconarrow-right-bold"></Text>
            </View>
        </View>
    )

    const renderInput = (label: string, key: string, unit: string = '万元') => (
        <View className="calc-item">
            <View className="item-label">{label}</View>
            <View className="item-input">
                <Input
                    value={inputValue[key]}
                    onInput={(e: any) => handleInputChange(e, key)}
                    onBlur={(e: any) => handleBlurChange(e, key)}
                    type="digit"
                />
            </View>
            <View className="item-unit">{unit}</View>
        </View>
    )

    const renderBusinessRatio = () => {
        const { type, value } = pickerValue.businessRateWay
        return type ?
            (
                <Text>
                    <Text className="input-placeholder">{value}% + {inputValue.basePoint}‱ =</Text>
                    <Text className="input-text">{(parseFloat(value) + inputValue.basePoint * 0.01).toFixed(2)}%</Text>
                </Text>
            ) :
            <Text className="input-text">{inputValue.rateBusiness}%</Text>
    }

    return (
        <View className="calculator">
            <ScrollView
                scrollY
                style={{ maxHeight: contentHeight }}
                scrollIntoView={resultShow.intoView}
            >
                <View className="calculator-cate">
                    {
                        calculatorCate.map((item: ICate, index: number) => (
                            <View
                                key={index}
                                onClick={() => handleCateChange(item)}
                                className={classnames('cate-item', cate.id === item.id && 'actived')}
                            >{item.name}</View>
                        ))
                    }
                </View>
                <View className="calculator-content" id="view_content">
                    {renderInput('房价总额', 'housePrice')}
                    {renderPicker('loadRatio', '贷款比例')}
                    <View className="calc-item">
                        <View className="item-label">贷款总额</View>
                        <View className="item-input">
                            <Text className="input-text">{inputValue.loanPrice}</Text>
                        </View>
                        <View className="item-unit">万元</View>
                    </View>
                    {cate.type == 'group' && renderInput('公积金贷款', 'loanFund')}
                    {
                        ['fund', 'group'].includes(cate.type) &&
                        <View>
                            {renderPicker('fundPeriod', '公积金贷年限')}

                            {renderPicker('fundRateWay', '公积金利率方式')}
                            <View className="calc-item">
                                <View className="item-label">公积金利率</View>
                                <View className="item-input">
                                    <Text className="input-text">{inputValue.rateFund}%</Text>
                                </View>
                            </View>
                        </View>
                    }
                    {cate.type == 'group' && renderInput('商业贷款', 'loanBusiness')}
                    {
                        ['business', 'group'].includes(cate.type) &&
                        <View>
                            {renderPicker('businessPeriod', '商贷年限')}
                            {renderPicker('businessRateWay', '商贷利率方式')}
                            {
                                pickerValue.businessRateWay.type &&
                                <View className="calc-item">
                                    <View className="item-label">基点(可为负数)</View>
                                    <View className="item-input">
                                        <Input
                                            value={inputValue.basePoint}
                                            type="number"
                                            onInput={(e: any) => handleInputChange(e, 'basePoint')} />
                                    </View>
                                    <View className="item-unit">BP(‱)</View>
                                </View>
                            }
                            <View className="calc-item">
                                <View className="item-label">商贷利率</View>
                                <View className="item-input">
                                    {renderBusinessRatio()}
                                </View>
                            </View>
                        </View>
                    }
                    <View className="calc-btn" onClick={calculate}>
                        <View className="btn btn-primary">开始计算</View>
                    </View>
                </View>
                {
                    resultShow.show &&
                    <View className="calculator-result view-content" id="view_result">
                        <View className="result-cates">
                            <View className="cates-tabs">
                                {
                                    RESULT_CATES.map((item: any, index: number) => (
                                        <View
                                            key={index}
                                            className={classnames('tabs-item', item.type === resultCate.type && 'actived')}
                                            onClick={() => setResultCate(item)}
                                        >
                                            {item.name}
                                        </View>
                                    ))
                                }
                            </View>
                            <View className="cates-memo">{resultCate.memo}</View>
                        </View>
                        <View className="result-content">
                            <View className="result-item">
                                <View className="label">房屋总价：</View>
                                <View className="value">{inputValue.housePrice}</View>
                                <View className="unit">万元</View>
                            </View>
                            <View className="result-item">
                                <View className="label">首付金额：</View>
                                <View className="value">{result.firstPay}</View>
                                <View className="unit">万元</View>
                            </View>
                            <View className="result-item">
                                <View className="label">贷款总额：</View>
                                <View className="value">{inputValue.loanPrice}</View>
                                <View className="unit">万元</View>
                            </View>
                            <View className="result-item">
                                <View className="label">支付利息：</View>
                                <View className="value">{result.interest}</View>
                                <View className="unit">万元</View>
                            </View>
                            <View className="result-item">
                                <View className="label">首月月供：</View>
                                <View className="value">{result.monthlyPay}</View>
                                <View className="unit">元/月</View>
                            </View>
                            {
                                resultCate.type === 'capital' &&
                                <View className="result-item">
                                    <View className="label">每月递减：</View>
                                    <View className="value">{result.monthlyDecrease}</View>
                                    <View className="unit">元/月</View>
                                </View>
                            }
                        </View>
                        <View className="result-memo">以上结果仅供参考</View>
                    </View>
                }
            </ScrollView>
            {customPicker()}
        </View>
    )
}

export default Calculator