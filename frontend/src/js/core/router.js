const staticRoutes = {
    'footer': true,
    'home': true,
    'explore': true
}

class Router {

    constructor() {
        riot.route.start();
        riot.route((target, ...params) => {
            let path = this.getPath(target);
            if (!staticRoutes[path]) {
                riot.mount('modal-dialog', { id: path });
            }
        });
        this.to(window.location.hash || 'home');
    }

    static getPath(path) {
        if (path) {
            if (path.startsWith('#')) {
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
            riot.route(path);
        }
    }

    to(path) {
        return route.to(path);
    }
}

const route = Router;

module.exports = Router;