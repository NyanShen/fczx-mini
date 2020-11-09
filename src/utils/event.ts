import api from '@services/api'
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

    public emit(eventName: string, params: any = {}) {
        if (this.events[eventName]) {
            this.timer = setInterval(() => {
                app.request({
                    url: app.apiUrl(api.getUnread)
                }, { loading: false }).then((result: any) => {
                    this.events[eventName].map((callBack) => {
                        callBack(result, params);
                    })
                })
            }, 3000)
        }
    }

    public clearTimer() {
        clearInterval(this.timer)
    }

}

export default new ChatEvent()