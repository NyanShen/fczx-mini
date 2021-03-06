
export interface ICate {
    id: number
    type: string
    name: string
}
export const calculatorCate: ICate[] = [
    {
        id: 1,
        type: 'business',
        name: '商业贷'
    },
    {
        id: 2,
        type: 'fund',
        name: '公积金贷'
    },
    {
        id: 3,
        type: 'group',
        name: '组合贷'
    }
]

const loadRatio = [
    {
        name: '20%',
        value: '0.2'
    },
    {
        name: '25%',
        value: '0.25'
    },
    {
        name: '30%',
        value: '0.3'
    },
    {
        name: '35%',
        value: '0.35'
    },
    {
        name: '40%',
        value: '0.4'
    },
    {
        name: '45%',
        value: '0.45'
    },
    {
        name: '50%',
        value: '0.5'
    },
    {
        name: '55%',
        value: '0.55'
    },
    {
        name: '60%',
        value: '0.6'
    },
    {
        name: '65%',
        value: '0.65'
    },
    {
        name: '70%',
        value: '0.7'
    },
    {
        name: '75%',
        value: '0.75'
    },
    {
        name: '80%',
        value: '0.8'
    }
]

const loadPeriod = [
    {
        name: '1年(12期)',
        value: 12
    },
    {
        name: '2年(24期)',
        value: 24
    },
    {
        name: '3年(36期)',
        value: 36
    },
    {
        name: '4年(48期)',
        value: 48
    },
    {
        name: '5年(60期)',
        value: 60
    },
    {
        name: '6年(72期)',
        value: 72
    },
    {
        name: '7年(84期)',
        value: 84
    },
    {
        name: '8年(96期)',
        value: 96
    },
    {
        name: '9年(108期)',
        value: 108
    },
    {
        name: '10年(120期)',
        value: 120
    },
    {
        name: '11年(132期)',
        value: 132
    },
    {
        name: '12年(144期)',
        value: 144
    },
    {
        name: '13年(156期)',
        value: 156
    },
    {
        name: '14年(168期)',
        value: 168
    },
    {
        name: '15年(180期)',
        value: 180
    },
    {
        name: '16年(192期)',
        value: 192
    },
    {
        name: '17年(204期)',
        value: 204
    },
    {
        name: '18年(216期)',
        value: 216
    },
    {
        name: '19年(228期)',
        value: 228
    },
    {
        name: '20年(240期)',
        value: 240
    },
    {
        name: '25年(300期)',
        value: 300
    },
    {
        name: '30年(360期)',
        value: 360
    }
]

const businessRateWay = [
    {
        type: 'latest',
        name: '最新报价利率（LPR）',
        value: 4.65
    },
    {
        name: '基准利率',
        value: 1
    },
    {
        name: '基准利率7折',
        value: 0.7
    },
    {
        name: '基准利率8折',
        value: 0.8
    },
    {
        name: '基准利率9折',
        value: 0.9
    },
    {
        name: '基准利率1.1倍',
        value: 1.1
    },
    {
        name: '基准利率1.2倍',
        value: 1.2
    },
    {
        name: '基准利率1.3倍',
        value: 1.3
    }
]

const fundRateWay = [
    {
        name: '基准利率',
        value: 1
    },
    {
        name: '基准利率1.1倍',
        value: 1.1
    },
    {
        name: '基准利率1.2倍',
        value: 1.2
    },
    {
        name: '基准利率1.3倍',
        value: 1.3
    }
]

export const pickerObject = {
    loadRatio,
    fundPeriod: loadPeriod,
    businessPeriod: loadPeriod,
    businessRateWay,
    fundRateWay
}

export const fundRates = {
    '1': 2.75,
    '6': 3.25
}

export const businessRates = {
    '1': 4.35,
    '5': 4.75,
    '6': 4.90
}


export const INIT_PICKER_VALUE = {
    loadRatio: {},
    fundPeriod: {
        name: '20年(240期)',
        value: 240
    },
    fundRateWay: {
        name: '基准利率',
        value: 1
    },
    businessPeriod: {
        name: '20年(240期)',
        value: 240
    },
    businessRateWay: {
        type: 'latest',
        name: '最新报价利率（LPR）',
        value: 4.65
    }
}
export const INIT_INPUT_VALUE = {
    housePrice: '',
    loanPrice: '',
    loanFund: '',
    loanBusiness: '',
    basePoint: '',
    rateBusiness: 4.65,
    rateFund: 3.25
}

export const RESULT_CATES = [
    {
        type: 'interest',
        name: '等额本息',
        memo: '每月还款额固定，所还总利息较多，适合收入稳定者。'
    },
    {
        type: 'capital',
        name: '等额本金',
        memo: '每月还款额递减，所还总利息较低，前期还款额较大。'
    }
]