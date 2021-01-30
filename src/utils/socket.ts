import Taro, { eventCenter } from '@tarojs/taro'
import find from 'lodash/find'

import api from '@services/api'
import app from '@services/request'
import storage from './storage'

class CustomSocket {
    public socketOpen: boolean = false
    public socketMsgQueue: string[] = []
    private lockReConnect: boolean = false
    private timer: any = null
    private limit: number = 0
    constructor() {
        if (this.getToken()) {
            this.connectSocket()
            console.log('init CustomSocket')
        }
    }

    private getToken = () => {
        return storage.getItem('token')
    }

    private initSocketEvent() {
        const _this = this
        Taro.onSocketOpen(() => {
            console.log('onSocketOpen')
            _this.socketOpen = true
            const loginMsg = `{"type":"login","token":"${_this.getToken()}"}`
            _this.sendSocketMessage(loginMsg)

            for (const item of _this.socketMsgQueue) {
                _this.sendSocketMessage(item)
            }
            _this.socketMsgQueue = []
        })
        Taro.onSocketError((e: any) => {
            console.log("WebSocket error", e)
        })
        Taro.onSocketClose(() => {
            console.log('WebSocket close！')
            if (_this.getToken()) {
                _this.reconnectSocket()
            }
        })
    }

    private reconnectSocket() {
        const _this = this
        if (_this.lockReConnect) {
            return
        }
        _this.lockReConnect = true
        clearTimeout(_this.timer)
        if (_this.limit < 10) {
            _this.timer = setTimeout(() => {
                _this.connectSocket()
                _this.lockReConnect = false
            }, 5000)
            _this.limit = _this.limit + 1
        }
    }

    public connectSocket() {
        const _this = this
        Taro.connectSocket({
            url: `wss://api.fczx.com:7272`,
            success: (response: any) => {
                console.log('connectSocket success:', response)
                _this.initSocketEvent()
                _this.limit = 0
            },
            fail: (e: any) => {
                console.log('connectSocket fail:', e)
            }
        })
    }

    public sendSocketMessage(messgage: string, errorCallback: (any) => void = () => { }) {
        const _this = this
        if (_this.socketOpen) {
            Taro.sendSocketMessage({
                data: messgage,
                success: () => {
                    console.log('sendSocketMessage succ', messgage)
                },
                fail: (e: any) => {
                    console.log('sendSocketMessage fail', e)
                    errorCallback && errorCallback(true)
                }
            })
        } else {
            _this.socketMsgQueue = []
        }
    }

    public onSocketMessage(callback: (...any) => void) {
        const _this = this
        Taro.onSocketMessage((response: any) => {
            const message: any = JSON.parse(response.data)
            if (message.type === 'receiveChat') {
                let unreadList: any[] = storage.getItem('chat_unread') || []
                unreadList = [...unreadList, message.data]
                storage.setItem('chat_unread', unreadList)
                callback(message.data, unreadList)
            }
            if (message.type === 'ping') {
                _this.sendSocketMessage('{"type":"pong"}')
            }
            if (message.type === 'subscribeWxAccount') {
                storage.setItem('is_subscribe_wx', true)
            }
            console.log('customSocket onSocketMessage:', message)
        })
    }

    public closeSocket() {
        if (this.socketOpen) {
            Taro.closeSocket()
        }
    }

    public onChatUnread() {
        if (this.getToken()) {
            const chat_unread: any[] = storage.getItem('chat_unread') || []
            eventCenter.trigger('chat_unread', chat_unread)
        }
    }

    public syncChatUnreadInLogout(userId: string) { //同步登陆之前未读的信息
        const _this = this
        app.request({
            url: app.apiUrl(api.getChatDialog)
        }, { loading: false }).then((result: any) => {
            _this.getUnreadStatus(result, userId)
        })
    }

    private getUnreadStatus(result: any[], userId: number | string) {
        let new_chat_unread: any[] = []
        let chat_unread: any[] = storage.getItem('chat_unread') || []
        for (const item of result) {
            if (item.status == '1' && item.to_user_id == userId) {
                const target = find(chat_unread, { modified: item.modified })
                if (!target) {
                    new_chat_unread.push({
                        modified: item.modified,
                        to_user_id: item.to_user_id,
                        from_user_id: item.from_user_id,
                        content: item.last_content,
                        message_type: item.message_type
                    })
                }
            }
        }
        chat_unread = [...chat_unread, ...new_chat_unread]
        storage.setItem('chat_unread', chat_unread)
        eventCenter.trigger('chat_unread', chat_unread)
    }

}

export default new CustomSocket()