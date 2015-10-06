const riot = require('riot');
const $ = require('jquery')
require('bootstrap-hover-dropdown')

const CONSTANTS = require('../constants/constants')
require('../tools/shims');

const html = `
<div class="page-actions">
    <div class="btn-group">
        <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
            <span class="hidden-sm hidden-xs">Actions&nbsp;</span>
            <i class="fa fa-angle-down"></i>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li each="{ val, i in data }" class="{ start: i == 0, active: i == 0 }">
                <a if="{ parent.getLinkAllowed(val) }" href="{ parent.getActionLink(val) }">
                    <i class="{ val.icon }"></i> { val.title }
                </a>
            </li>
            <li class="divider"></li>
            <li>
                <a href="#settings">
                    <i class="fa fa-gear"></i> Settings
                </a>
            </li>
        </ul>
    </div>

    <span style="padding-left: 5px;">
        <span if="{ pageName }"
                id="map_name"
                data-type="text"
                data-title="Enter map name">
            { pageName }
        </span>
    </span>
</div>
`;

module.exports = riot.tag('page-actions', html, function (opts) {

    const MetaMap = require('../../MetaMap');

    this.data = [];
    this.pageName = 'Home';
    this.url = MetaMap.config.site.db + '.firebaseio.com';
    this.loaded = false;

    this.getActionLink = (obj) => {
        let ret = obj.link;
        if (obj.url_params) {
            let args = [];
            _.each(obj.url_params, (prm) => {
                args.push(this[prm.name]);
            });
            ret = obj.link.format.call(obj.link, args);
        }
        return ret;
    }

    this.getLinkAllowed = (obj) => {
        let ret = true == obj['allowed-on']['*'];
        if (!ret) {
            let currentPage = MetaMap.Router.currentPath;
            ret = true == obj['allowed-on'][currentPage];
        }
        return ret;
    }

    this.bindTopageName = _.once(() => {
        if (this.mapId) {
            MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}/name`, (name) => {
                this.pageName = name || '';
                this.update();
            });
        }
        this.loaded = true;
    });

    MetaMap.Eventer.every('pageName', (opts) => {
        if (this.loaded) {
            $(this.map_name).editable('destroy');
        }
        if (this.mapId) {
            MetaMap.MetaFire.off(`${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}/name`);
            if (opts.id) {
                MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.MAPS_LIST}/${opts.id}/name`, (name) => {
                    this.pageName = name;
                    this.update();
                });
            }
        }
        this.pageName = opts.name || 'Home';
        this.mapId = opts.id;
        this.update();
        if (this.mapId) {
            $(this.map_name).editable({ unsavedclass: null }).on('save', (event, params) => {
                MetaMap.MetaFire.setData(params.newValue, `${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}/name`);
            });
            this.bindTopageName();
        }
    });

    MetaMap.MetaFire.on('metamap/actions', (data) => {
        this.data = _.filter(_.sortBy(data, 'order'), (d) => {
            var include = d.archive != true;
            return include;
        });
        this.update();
    });

});