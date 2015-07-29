class Eventer {

    constructor(metaMap) {
        
        riot.observable(this);

        this.events = {}
    }

    every(event, reaction) {
        //let callback = reaction;
        //if (this.events[event]) {
        //    let piggyback = this.events[event];
        //    callback = (...params) => {
        //        piggyback(...params);
        //        reaction(...params);
        //    }
        //}
        this.events[event] = reaction;
        this.on(event, reaction);
    }

    forget(event) {
        delete this.events[event];
        this.off(event);
    }

    do(event, ...params) {
        this.trigger(event, ...params);
    }

}

module.exports = Eventer;