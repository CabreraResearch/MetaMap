const riot = require('riot');
const $ = require('jquery')
require('bootstrap-hover-dropdown')
const _ = require('lodash')

const CONSTANTS = require('../constants/constants')
require('../tools/shims');
const Permissions = require('../app/Permissions')

const html = `
<div id="page_actions" class="page-actions">
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
                data-title="Enter map name"
                style="vertical-align: middle;">
            { pageName }
        </span>
    </span>
</div>
`;

module.exports = riot.tag('page-actions', html, function (opts) {

    const MetaMap = require('../../MetaMap');

    this.data = [];
    this.pageName = 'Home';
    this.url = MetaMap.config.site;
    this.loaded = false;

    let permissions = null;

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
        if (ret && this.map && permissions) {
            switch (obj.title) {
                case 'Share Map':
                case 'Delete Map':
                    ret = permissions.isMapOwner()
                    break;
            }
        }
        return ret;
    }

    this.updatePageName = (map) => {
        permissions = new Permissions(map)
        this.map = map || {}
        if (permissions.isMapOwner()) {
            this.pageName = map.name || ''
        } else {
            this.pageName = map.name + ' (Shared by ' + map.owner.name + ')'
        }
        if (permissions && permissions.isMapOwner()) {
            $(this.map_name).editable({ unsavedclass: null }).on('save', (event, params) => {
                MetaMap.MetaFire.setData(params.newValue, `${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}/name`);
            });
            this.loaded = true;
        }
        this.update()
    }

    MetaMap.Eventer.every('pageName', (opts) => {
        if (this.loaded) {
            $(this.map_name).editable('destroy');
        }
        if (this.mapId) {
            MetaMap.MetaFire.off(`${CONSTANTS.ROUTES.MAPS_LIST}/${this.mapId}`);
            this.mapId = null
            this.map = null
        }
        if (opts.id) {
            this.mapId = opts.id;
            MetaMap.MetaFire.on(`${CONSTANTS.ROUTES.MAPS_LIST}/${opts.id}`, (map) => {
                this.updatePageName(map)
            });
        }
        this.pageName = opts.name || 'Home';
        this.update();
    });

    MetaMap.MetaFire.on('metamap/actions', (data) => {
        this.data = _.filter(_.sortBy(data, 'order'), (d) => {
            var include = d.archive != true;
            return include;
        });
        this.update();
    });

});