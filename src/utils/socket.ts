import Taro from '@tarojs/taro'
import storage from './storage'

class CustomSocket {
    public socketOpen: boolean = false
    public socketMsgQueue: string[] = []
    private lockReConnect: boolean = false
    private timer: any = null
    private limit: number = 0
    private token = storage.getItem('token')
    constructor() {
        this.connectSocket()
        console.log('init CustomSocket')
    }
    connectSocket() {
        const _this = this
        Taro.connectSocket({
            url: `wss://api.fczx.com/wss?userToken=${_this.token}`,
            success: (response: any) => {
                console.log('connectSocket success:', response)
                _this.initSocketEvent()
            },
            fail: (e: any) => {
                console.log('connectSocket fail:', e)
            }
        })
    }

    initSocketEvent() {
        const _this = this
        Taro.onSocketOpen(() => {
            console.log('onSocketOpen')
            _this.socketOpen = true
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
            if (_this.token) {
                _this.reconnectSocket()
            }
        })
    }

    reconnectSocket() {
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

    public onSocketMessage(callback: (string) => void) {
        Taro.onSocketMessage((response: any) => {
            const message: any = JSON.parse(response.data)
            if (message.type === 'chat') {
                callback(message)
            }
            console.log('onSocketMessage:', message)
        })
    }

    public closeSocket() {
        if (this.socketOpen) {
            Taro.closeSocket()
        }
    }

}

export default new CustomSocket()