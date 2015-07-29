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
        let events = event.split(' ');
        _.each(events, () => {
            this.events[event] = reaction;
            this.on(event, reaction);
        });
    }

    forget(event) {
        let events = event.split(' ');
        _.each(events, () => {
            delete this.events[event];
            this.off(event);
        });
    }
    do(event, ...params) {
        let events = event.split(' ');
        _.each(events, () => {
            this.trigger(event, ...params);
        });
    }

}

module.exports = Eventer;