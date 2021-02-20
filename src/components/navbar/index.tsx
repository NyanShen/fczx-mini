import React from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import assign from 'lodash/assign'
import classnames from 'classnames'
import './index.scss'

interface IProps {
    title?: string,
    showIcon?: boolean,
    primary?: boolean,
    backgroundColor?: string,
    color?: string,
    icon?: string,
    iconClass?: string,
    iconStyle?: any,
    height?: number,
    callback?: () => void;
}

const NavBar = (props: IProps) => {
    const lastPage = Taro.getCurrentPages().length <= 0
    const primaryClass = {
        backgroundColor: '#11a43c',
        color: '#fff',
    }
    const defalutClass = {
        backgroundColor: '#fff',
        color: '#000',
    }
    const defaultProps = {
        title: '',
        primary: false,
        showIcon: true,
        icon: '', //\ue608, home ；\ue685 ,back
        iconClass: '',
        iconStyle: null,
        height: 40,
    }
    props = assign({}, defaultProps, props)
    const style = props.primary ? primaryClass : defalutClass

    const handleHomeClick = () => {
        Taro.switchTab({
            url: '/pages/index/index'
        })
    }

    const handleBackClick = () => {
        Taro.navigateBack({ delta: 1 })
    }

    const { iconClass, iconStyle, showIcon, callback } = props;

    const renderIcon = () => {
        if (showIcon) {
            return lastPage ?
                <View className="iconfont iconhome" style={iconStyle} onClick={() => handleHomeClick()}></View> :
                <View className="iconfont iconarrow-left-bold" style={iconStyle} onClick={() => handleBackClick()}></View>

        } else {
            return null
        }
    }

    return IS_H5 ? (
        <View className="navbar" style={{ height: `${props.height}px` }}>
            <View className="navbar-content" style={style}>
                {renderIcon()}
                <View className="navbar-title">{props.title}</View>
                {iconClass && <View className={classnames('iconfont', iconClass)} style={iconStyle} onClick={callback}></View>}
            </View>
        </View>
    ) : null
}

export default NavBar