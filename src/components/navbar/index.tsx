import React from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import useNavData from '../../hooks/useNavData'
import * as _ from 'lodash'
import classnames from 'classnames'
import './index.scss'

interface IProps {
    title: string,
    home?: boolean,
    back?: boolean,
    iconOther?: boolean,
    backgroundColor?: string,
    color?: string,
    icon?: string,
    iconClass?: string,
    iconStyle?: any,
    callback?: () => void;
}

const NavBar = (props: IProps) => {
    const defaultProps = {
        title: '',
        home: false,
        back: false,
        iconOther: false,
        backgroundColor: '#11a43c',
        color: '#fff',
        icon: '', //\ue608, home ；\ue685 ,back
        iconClass: '',
        iconStyle: null
    }
    props = _.assign({}, defaultProps, props);
    const { statusBarHeight, titleBarHeight } = useNavData();
    const style = {
        paddingTop: `${statusBarHeight}px`,
        height: `${titleBarHeight}px`,
        backgroundColor: props.backgroundColor,
        color: props.color
    }

    const handleHomeClick = () => {
        Taro.switchTab({
            url: '/pages/index/index'
        })
    }

    const handleBackClick = () => {
        Taro.navigateBack()
    }

    const { home, back, iconOther, iconClass, iconStyle, icon } = props;

    return (
        <View className="navbar" style={style}>
            {home && <Text className="iconfont iconhome" onClick={() => handleHomeClick()}></Text>}
            {back && <Text className="iconfont iconarrow-left-bold back" onClick={() => handleBackClick()}></Text>}
            {iconOther && <Text className={classnames('iconfont', iconClass)} style={iconStyle} onClick={props.callback}>{icon}</Text>}
            <Text className="navbar-title">{props.title}</Text>
        </View>
    )
}

export default NavBar
