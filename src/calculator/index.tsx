import React, { useEffect, useMemo, useState } from 'react'
import { Input, View, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'

import useNavData from '@hooks/useNavData'
import CustomPicker, { INIT_PICKER, IPicker } from '@components/picker'
import { calculatorCate, ICate, pickerObject } from './constant'
import './index.scss'

const INIT_PICKER_VALUE = {
    loadRatio: {},
    fundPeriod: {
        name: '30年(360期)',
        value: 360
    },
    businessPeriod: {
        name: '30年(360期)',
        value: 360
    },
    businessRateWay: {
        type: 'latest',
        name: '最新报价利率（LPR）',
        value: '4.65'
    },
    fundRateWay: {
        name: '基准利率(3.25%)',
        value: '3.25'
    }
}

const INIT_INPUT_VALUE = {
    housePrice: 0,
    loadPrice: 0,
    fundPrice: 0,
    basePoint: 0,
    businessRatio: '4.65'
}

const Calculator = () => {
    const { contentHeight } = useNavData()
    const [cate, setCate] = useState<any>(calculatorCate[0])
    const [inputValue, setInputValue] = useState<any>(INIT_INPUT_VALUE)
    const [picker, setPicker] = useState<IPicker>(INIT_PICKER)
    const [pickerValue, setPickerValue] = useState<any>(INIT_PICKER_VALUE)

    useEffect(() => {
        calculateHousePrice()
    }, [inputValue.housePrice, pickerValue.loadRatio])

    const handleCateChange = (item: ICate) => {
        setCate(item)
    }

    const handleInputChange = (e: any, key: string) => {
        const value = e.detail.value
        const { loadPrice } = inputValue
        switch (key) {
            case 'fundPrice':
                if (parseFloat(value) > parseFloat(loadPrice)) {
                    setInputValue({
                        ...inputValue,
                        fundPrice: loadPrice,
                        businessPrice: 0
                    })
                } else {
                    setInputValue({
                        ...inputValue,
                        fundPrice: value,
                        businessPrice: loadPrice - value
                    })
                }
                return
            case 'businessPrice':
                if (parseFloat(value) > parseFloat(loadPrice)) {
                    setInputValue({
                        ...inputValue,
                        fundPrice: 0,
                        businessPrice: loadPrice
                    })
                } else {
                    setInputValue({
                        ...inputValue,
                        fundPrice: loadPrice - value,
                        businessPrice: value
                    })
                }
                return
            default:
                setInputValue({
                    ...inputValue,
                    [key]: e.detail.value
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
            const loadPrice = inputValue.housePrice * pickerValue.loadRatio.value
            setInputValue({
                ...inputValue,
                loadPrice: loadPrice.toFixed(2),
                fundPrice: (loadPrice / 2).toFixed(2),
                businessPrice: (loadPrice / 2).toFixed(2)
            })
        }
    }

    const handlePickerConfirm = (item: any) => {
        if (item) {
            setPickerValue({
                ...pickerValue,
                [picker.name]: item
            })
        }
        setPicker({
            ...picker,
            show: false,
        })
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
            <Text className="input-text">{value}%</Text>
    }

    return (
        <View className="calculator">
            <ScrollView scrollY style={{ maxHeight: contentHeight }}>
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
                            <Text className="input-text">{inputValue.loadPrice}</Text>
                        </View>
                        <View className="item-unit">万元</View>
                    </View>

                    {cate.type == 'group' && renderInput('公积金贷款', 'fundPrice')}
                    {
                        ['fund', 'group'].includes(cate.type) &&
                        <View>
                            {renderPicker('fundPeriod', '公积金贷年限')}

                            {renderPicker('fundRateWay', '公积金利率')}
                        </View>
                    }

                    {cate.type == 'group' && renderInput('商业贷款', 'businessPrice')}
                    {
                        ['business', 'group'].includes(cate.type) &&
                        <View>
                            {renderPicker('businessPeriod', '商贷年限')}
                            {renderPicker('businessRateWay', '利率方式')}
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
                <View className="calculator-result" id="view_result">

                </View>
            </ScrollView>
            {customPicker()}
        </View>
    )
}

export default Calculator