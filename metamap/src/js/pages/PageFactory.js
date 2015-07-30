const riot = window.riot;
const NProgress = window.NProgress;

class PageFactory {
    constructor(eventer) {
        this.eventer = eventer;
        this.onReady();
    }

    onReady() {
        if (!this._onReady) {
            this._onReady = new Promise((fulfill, reject) => {
                $('#meta_progress').remove();
                riot.mount('*');
                NProgress.configure({ parent: '#meta_progress_next' });

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
        let tag = '';

        switch (path) {
        case 'mymaps':
            this.eventer.do(path, { id: id, action: action }, ...params);
            break;

        case 'map':
            tag = 'meta-canvas';
            $('#app-container').empty();
            riot.mount(document.getElementById('app-container'), tag);
            MetaMap.MetaFire.getData(`maps/list/${id}`).then((map) => {
                map.id = id;
                this.eventer.do('nav', path, map, ...params);
                this.eventer.do('map', map, ...params);
            });
            break;

        default:
            this.eventer.do(path, path, { id: id, action: action }, ...params);
            break;
        }
    }
}

module.exports = PageFactory;