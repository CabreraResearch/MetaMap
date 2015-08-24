/// <reference path="../../../../typings/riotjs/riotjs.d.ts" />

const riot = require('riot')
const ACTIONS = require('../constants/actions')

let isHidden = false;

let track = (path) => {
    if (window.ga) {
        window.ga('set', {
            page: path
        });
        window.ga('send', 'pageview');
    }
}

let toggleMain = (hide, path) => {
    track(path);
    if (hide) {
        isHidden = true;
    } else {
        isHidden = false;
    }
}

class Router {
    constructor(metaMap) {
        this.user = metaMap.User;
        this.PageFactory = metaMap.PageFactory;
        this.eventer = metaMap.Eventer;
    }

    init() {
        riot.route.start();
        riot.route((target, id = '', action = '', ...params) => {
            this.path = this.getPath(target);

            toggleMain(true, this.path);
            this.PageFactory.navigate(this.path, id, action, ...params);

            this.eventer.do('history', window.location.hash);
        });
        this.to(this.currentPage);
    }

    get currentPage() {
        let page = window.location.hash;
        if(!route.isTracked(page)) {
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

    static getPath(path) {
        if (path) {
            while (path.startsWith('!') || path.startsWith('#')) {
                path = path.substr(1);
            }
        }
        return path;
    }

    getPath(path) {
        return route.getPath(path);
    }

    static to(path) {
        path = route.getPath(path);
        if (path) {
            toggleMain(true, path);
            riot.route(`${path}`);
        }
    }

    to(path) {
        return route.to(path);
    }

    back() {
        let path = 'home';
        let pageCnt = this.user.history.length;
        if (pageCnt > 1 && (this.currentPage != 'mymaps' || this.currentPage != this.previousPage)) {
            path = this.previousPage;
            let backNo = 2;
            while (!route.isTracked(path) && this.user.history[backNo]) {
                backNo += 1;
                path = this.getPreviousPage(backNo);
            }
        }
        return this.to(path);
    }
    
    static get doNotTrack() {
        return [ACTIONS.DELETE_MAP, ACTIONS.COPY_MAP, ACTIONS.LOGOUT, ACTIONS.NEW_MAP, ACTIONS.FEEDBACK];
    }
    
    static isTracked(path) {
        let pth = route.getPath(path);
        return _.any(route.doNotTrack, (p) => {
            return !pth.startsWith(p);
        });
    }
}

const route = Router;

module.exports = Router;