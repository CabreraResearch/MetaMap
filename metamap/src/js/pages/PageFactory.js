const riot = window.riot;
const NProgress = window.NProgress;
const pageBody = require('../../tags/page-body.js');
const ELEMENTS = require('../constants/elements.js');
const Actions = require('../actions/Action.js');

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
                $(`#${ELEMENTS.META_PROGRESS}`).remove();
                riot.mount('*');
                NProgress.configure({ parent: `#${ELEMENTS.META_PROGRESS_NEXT}` });

                _.delay(() => {
                    Metronic.init(); // init metronic core componets
                    Layout.init(); // init layout
                    Demo.init(); // init demo features
                    Index.init(); // init index page
                    Tasks.initDashboardWidget(); // init tash dashboard widget
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