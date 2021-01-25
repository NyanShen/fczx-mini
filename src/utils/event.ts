import api from '@services/api'
import { hasLogin } from '@services/login'
import app from '@services/request'
import storage from './storage'

class ChatEvent {

    public timer: any
    private events: any

    constructor() {
        this.events = {}
    }

    public on(eventName: string, callBack: (...any) => void) {
        this.events[eventName] = callBack
    }

    public emitStatus(eventName: string, params: any = {}) {
        if (this.events[eventName]) {
            this.events[eventName](params)
        }
    }

    public emit(eventName: string, params: any = {}, timer: number = 30000) {
        let _this = this
        hasLogin().then((result) => {
            if (result && _this.events[eventName]) {
                _this.fetchChatUnread(eventName, params)
                _this.timer = setInterval(() => {
                    _this.fetchChatUnread(eventName, params)
                }, timer)
            }
        })
    }

    public clearTimer() {
        clearInterval(this.timer)
        this.events = {}
    }

    fetchChatUnread(eventName: string, params: any = {}) {
        let _this = this
        app.request({
            url: app.testApiUrl(api.getUnread)
        }, { loading: false })
            .then((result: any) => {
                let unreadList = storage.getItem('chat_unread') || []
                if (result) {
                    unreadList = [...unreadList, result]
                    storage.setItem('chat_unread', unreadList)
                }
                _this.events[eventName](unreadList, result, params);
            })
    }
}

export default new ChatEvent()