const riot = require('riot')
const _ = require('lodash')

class Eventer {

    constructor(Homunculus) {
        
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

    forget(event, callback) {
        let events = event.split(' ');
        _.each(events, () => {
            if (!callback) {
                delete this.events[event];
                this.off(event);
            } else {
                this.off(event, callback);
            }
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