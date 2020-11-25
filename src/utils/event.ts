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

    public on(eventName: string, callBack: (any) => void) {
        if (this.events[eventName]) {
            this.events[eventName].push(callBack);
        } else {
            this.events[eventName] = [callBack];
        }
    }

    public emit(eventName: string, params: any = {}) {
        let _this = this
        hasLogin().then((result) => {
            if (result && _this.events[eventName]) {
                _this.fetchChatUnread(eventName, params)
                _this.timer = setInterval(() => {
                    _this.fetchChatUnread(eventName, params)
                }, 5000)
            }
        })
    }

    public clearTimer() {
        clearInterval(this.timer)
    }

    fetchChatUnread(eventName: string, params: any = {}) {
        app.request({
            url: app.apiUrl(api.getUnread)
        }, { loading: false }).then((result: string) => {
            storage.setItem('chat_unread', result)
            this.events[eventName].map((callBack) => {
                callBack(result, params);
            })
        })
    }

}

export default new ChatEvent()