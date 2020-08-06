import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import './index.scss'

interface IProps {
    current: number
    color: string
    background: any
    activedColor: string
    tabList: any
    callback: (name: string) => void
}

interface IState {
    currentIndex: number
}

export default class Tabbar extends Component<IProps, IState> {
    static defaultProps: IProps = {
        current: 0,
        color: '#333',
        background: '#fff',
        activedColor: '#11a43c',
        callback: () => { },
        tabList: [
            {
                icon: '\ue600',
                name: '首页',
                pathname: 'home'
            },
            {
                icon: '\ue682',
                name: '微聊',
                pathname: 'chat'
            },
            {
                icon: '\ue603',
                name: '我的',
                pathname: 'user'
            }
        ]
    }

    constructor(props) {
        super(props)
        this.state = {
            currentIndex: props.current
        }
    }

    componentWillMount() { }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() { }

    componentDidHide() { }

    updateCurrent(index, pathname) {
        this.setState({
            currentIndex: index
        });
        this.props.callback(pathname)
    }

    render() {
        let { background, tabList } = this.props
        let { currentIndex } = this.state
        return (
            <View className="fc-tabbar fc-tabbar-fixed">
                <View className="fc-tabbar-list" style={{ backgroundColor: background }}>
                    {
                        tabList.map((item, index) => (
                            <View className={classnames('fc-tabbar-item', currentIndex == index && 'actived')} key={index} onClick={this.updateCurrent.bind(this, index, item.pathname)}>
                                <View className="fc-tabbar-icon">
                                    <Text className="iconfont">{item.icon}</Text>
                                </View>
                                <Text className="fc-tabbar-name">{item.name}</Text>
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }
}
