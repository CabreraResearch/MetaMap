class Common {

    static splitLines(text) {
        return text.split(/\n/);
    }

    static getEventTime(t, now) {
        let time = moment(t, 'YYYY-MM-DD HH:mm:ss.SSS');
        let nowtime = moment(now, 'YYYY-MM-DD HH:mm:ss.SSS');
        // console.log('t:       ' + t);
        // console.log('now:     ' + now);
        // console.log('time:    ' + time.format()); // + ' ' + time.isValid());
        // console.log('nowtime: ' + nowtime.format()); // + ' ' + nowtime.isValid());
        return time.from(nowtime);
    }

    static classIf(klass, b) {
        //console.log('classIf: ' + klass + ', ' + b);
        return (b ? klass : '');
    }

    // avoid '$apply already in progress' error (source: https://coderwall.com/p/ngisma)
    static safeApply(fn) {
        if (fn && (typeof (fn) === 'function')) {
            fn();
        }
    }

    // source: http://ctrlq.org/code/19616-detect-touch-screen-javascript
    static isTouchDevice() {
        return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }

}

module.exports = Common;