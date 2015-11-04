const riot = require('riot')
const pageBody = require('../tags/page-body.js')
const CONSTANTS = require('../constants/constants')
const Actions = require('../actions/Action.js')
const Metronic = require('../template/metronic')
const Layout = require('../template/layout')
const Demo = require('../template/demo')

class PageFactory {
    constructor(eventer, metaFire) {
        this.metaFire = metaFire;
        this.eventer = eventer;
        this.actions = new Actions(metaFire, eventer, this);
        this.onReady();
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                $(`#${CONSTANTS.ELEMENTS.META_PROGRESS}`).remove();
                riot.mount('*');
                window.NProgress.configure({ parent: `#${CONSTANTS.ELEMENTS.META_PROGRESS_NEXT}` });

                _.delay(() => {
                    Metronic.init(); // init metronic core componets
                    Layout.init(); // init layout
                    Demo.init(); // init demo features

                    fulfill();
                }, 250);
            });
        }
        return this._onReady;
    }

    navigate(path, id, action, ...params) {
        let act = this.actions.act(path, id, action, ...params);
        if (!act) {
            this.eventer.do(path, path, { id: id, action: action }, ...params);
        }
    }
}

module.exports = PageFactory;