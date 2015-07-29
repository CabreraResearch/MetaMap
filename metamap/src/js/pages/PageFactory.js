const riot = window.riot;
const NProgress = window.NProgress;

class PageFactory {
    constructor(eventer) {
        this.eventer = eventer;
        eventer.every('nav', (type, obj) => {
            this.navigate(type, obj);
        });
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

    navigate(type, obj) {
        let tag = '';
        switch (type) {
            case 'map':
                tag = 'meta-canvas';
                break;
        }

        if (tag) {
            $('#app-container').empty();
            riot.mount(document.getElementById('app-container'), tag);
            this.eventer.do(type, obj);
        }
    }
}

module.exports = PageFactory;