let isFunction = function(obj) {
    return typeof obj === 'function' || false;
}

class EventEmitter {  
    constructor() {
      this.listeners = new Map();
    }
    addListener(label, callback) { 
        this.listeners.has(label) || this.listeners.set(label, []);
        this.listeners.get(label).push(callback);
    }
    removeListener(label, callback) { 
        let callbackArr = this.listeners.get(label),
            index;
        if(callbackArr && callbackArr.length) {
            index = callbackArr.reduce((i, item, index) => {
                return (isFunction(item) && item === callback)?
                i = index:i
            })
            if(index > -1) {
                callbackArr.splice(index, 1);
                this.listeners.set(lable, callbackArr)
                return true;
            }
        }
        return false;
    }
    emit(label, ...args) { 
        let callbackArr = this.listeners.get(label);
        if(callbackArr && callbackArr.length) {
            callbackArr.forEach((callback) => {
                callback(...args)
            })
            return true;
        }
        return false;
    }
  }

class Observer {
    constructor(id, emitter) {
        this.id = id;
        this.emitter = emitter;
        this.emitter.addListener('change', data => this.onChange(data));
    }
    onChange(data) {
        console.log(`${this.id} notified of change:`, data);
    }
}

let observable = new EventEmitter();

let[observer1, observer2] = [
    new Observer(1, observable),
    new Observer(2, observable)
]

observable.emit('change', {a:1})