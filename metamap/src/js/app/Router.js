const staticRoutes = {
    'contact': true,
    'home': true,
    'explore': true
}

let isHidden = false;
let toggleMain = (hide, path) => {
    track(path);
    if (hide) {
        isHidden = true;
        

    } else {
        isHidden = false;
        
        
    }
}

let track = (path) => {
    if (window.ga) {
        window.ga('set', {
            page: path
        });
        window.ga('send', 'pageview');
    }
}

class Router {
    constructor(metaMap) {
        this.history = metaMap.User.history;
        this.PageFactory = metaMap.PageFactory;
        riot.route.start();
        riot.route((target, id = '', action = '', ...params) => {
            let path = this.getPath(target);
           
            if (!staticRoutes[path]) {
                toggleMain(true, path);
                this.PageFactory.navigate(path, id, action, ...params);
            } else {
                toggleMain(false, path);
            }
            metaMap.Eventer.do('history', window.location.hash);
        });
        this.to(this.currentPage);
    }
    
    get currentPage() {
        let page = 'home';
        let pageCnt = this.history.length;
        if (pageCnt > 0) {
            page = this.getPath(this.history[pageCnt - 1]);
        }
        return page;
    }

    get previousPage() {
        let page = 'home';
        let pageCnt = this.history.length;
        if (pageCnt > 0) {
            page = this.getPath(this.history[pageCnt - 2]);
        }
        return page;
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
            if (staticRoutes[path]) {
                toggleMain(false, path);
                riot.route(path);
            } else {
                toggleMain(true, path);
                riot.route(`!${path}`);
            }
        }
    }

    to(path) {
        return route.to(path);
    }

    back() {
        let path = 'home';
        let pageCnt = this.history.length;
        if (pageCnt > 1 && (this.currentPage != 'mymaps' || this.currentPage != this.previousPage)) {
            path = this.previousPage;
        }
        return this.to(path);
    }
}

const route = Router;

module.exports = Router;