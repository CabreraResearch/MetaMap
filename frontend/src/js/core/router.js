const staticRoutes = {
    'contact': true,
    'home': true,
    'explore': true
}

let isHidden = false;
let toggleMain = (hide) => {
    if (hide) {
        isHidden = true;
        $('#main').hide();
        $('#at4-share').parent().show();
        
    } else {
        isHidden = false;
        $('#at4-share').parent().hide();
        $('#main').show();
        $('dynamic-page').empty();
    }
}

class Router {

    constructor() {
        riot.route.start();
        riot.route((target, ...params) => {
            let path = this.getPath(target);
            if (!staticRoutes[path]) {
                toggleMain(true);
                riot.mount('dynamic-page', { id: path });
            } else {
                toggleMain(false);
            }
        });
        this.to(window.location.hash || 'home');
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
                toggleMain(false);
                riot.route(path);
            } else {
                toggleMain(true);
                riot.route(`!${path}`);
            }
        }
    }

    to(path) {
        return route.to(path);
    }
}

const route = Router;

module.exports = Router;