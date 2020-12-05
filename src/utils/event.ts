import api from '@services/api'
import { hasLogin } from '@services/login'
import app from '@services/request'

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

    public emitStatus(eventName: string, params: any = {}) {
        if (this.events[eventName]) {
            this.events[eventName].map((callBack) => {
                callBack(params);
            })
        }
    }

    public emit(eventName: string, params: any = {}, timer: number = 5000) {
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
    }

    fetchChatUnread(eventName: string, params: any = {}) {
        let _this = this
        app.request({
            url: app.apiUrl(api.getUnread)
        }, { loading: false }).then((result: any) => {
            _this.events[eventName].map((callBack) => {
                callBack(result.message, params);
            })
        })
    }

}

export default new ChatEvent()