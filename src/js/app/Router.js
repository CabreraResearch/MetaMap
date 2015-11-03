const riot = require('riot')
const CONSTANTS = require('../constants/constants');

class Router {
    constructor(metaMap) {
        this.integrations = metaMap.Integrations;
        this.user = metaMap.User;
        this.PageFactory = metaMap.PageFactory;
        this.eventer = metaMap.Eventer;
        this.isHidden = false;
    }

    init() {
        riot.route.start();
        riot.route((target, id = '', action = '', ...params) => {
            if (!target.startsWith('!')) {
                this.to('!' + target)
            } else {
                this.path = this.getPath(target);

                this.toggleMain(true, this.path);
                this.PageFactory.navigate(this.path, id, action, ...params);

                this.eventer.do('history', window.location.hash);
            }
        });
        if (window.location.href.indexOf('?') > 0) {
            console.warn('location had a ?')
            let loc = window.location.href.split('?').join('')
            window.location.href = loc
        }
        this.to(this.currentPage);
    }

    get currentPage() {
        let page = window.location.hash || 'home';
        if (!this.isTracked(page)) {
            let pageCnt = this.user.history.length;
            if (pageCnt > 0) {
                page = this.getPath(this.user.history[pageCnt - 1]);
            }
        }
        return page;
    }

    get currentPath() {
        return this.path;
    }

    getPreviousPage(pageNo = 2) {
        let page = 'home';
        let pageCnt = this.user.history.length;
        if (pageCnt > 0) {
            page = this.getPath(this.user.history[pageCnt - pageNo]);
        }
        return page;
    }

    get previousPage() {
        return this.getPreviousPage(2);
    }

    track(path) {
        this.integrations.updatePath(`/${path}.html`);
    }

    toggleMain(hide, path) {
        this.track(path);
        if (hide) {
            this.isHidden = true;
        } else {
            this.isHidden = false;
        }
    }

    getPath(path) {
        if (path) {
            while (path.startsWith('!') || path.startsWith('#') || path.startsWith('?')) {
                path = path.substr(1);
            }
        }
        return path;
    }

    to(path) {
        path = this.getPath(path);
        if (path) {
            riot.route(`!${path}`);
        }
    }

    back() {
        let path = 'home';
        let pageCnt = this.user.history.length;
        if (pageCnt > 1 && (this.currentPage != 'mymaps' || this.currentPage != this.previousPage)) {
            path = this.previousPage;
            let backNo = 2;
            while (!this.isTracked(path) && this.user.history[backNo]) {
                backNo += 1;
                path = this.getPreviousPage(backNo);
            }
        }
        return this.to(path);
    }

    get doNotTrack() {
        if (!this._doNotTrack) {
            this._doNotTrack = [CONSTANTS.ACTIONS.DELETE_MAP, CONSTANTS.ACTIONS.COPY_MAP, CONSTANTS.ACTIONS.LOGOUT, CONSTANTS.ACTIONS.NEW_MAP, CONSTANTS.ACTIONS.FEEDBACK, CONSTANTS.ACTIONS.SHARE_MAP];
        }
        return this._doNotTrack;
    }

    isTracked(path) {
        let pth = this.getPath(path);
        return _.any(this.doNotTrack, (p) => {
            return !pth.startsWith(p);
        });
    }
}

module.exports = Router;