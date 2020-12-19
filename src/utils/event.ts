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

    public emit(eventName: string, params: any = {}) {
        let _this = this
        if (_this.events[eventName]) {
            _this.events[eventName].map((callBack) => {
                callBack(params);
            })
        }
    }

    public clearTimer() {
        clearInterval(this.timer)
    }
}

export default new ChatEvent()