const riot = require('riot');

const html = `
<div class="page-actions">
    <div class="btn-group">
        <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
            <span class="hidden-sm hidden-xs">Actions&nbsp;</span>
            <i class="fa fa-angle-down"></i>
        </button>
        <ul class="dropdown-menu" role="menu">
            <li each="{ val, i in data }" class="{ start: i == 0, active: i == 0 }">
                <a href="{ val.link }">
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
        <span if="{ mapName }"
                id="map_name"
                data-type="text"
                data-title="Enter map name">
            { mapName }
        </span>
    </span>
</div>
`;

module.exports = riot.tag('page-actions', html, function(opts) {

    const MetaMap = require('../entry.js');

    this.data = [];
    this.mapName = '';
    this.url = MetaMap.config.site.db + '.firebaseio.com';
    this.loaded = false;

    this.bindToMapName = _.once(() => {
        MetaMap.MetaFire.on(`maps/list/${this.mapId}/name`, (name) => {
            this.mapName = name;
            this.update();
        });
        this.loaded = true;
    });

    MetaMap.Eventer.every('map', (opts) => {
        if (this.loaded) {
            $(this.map_name).editable('destroy');
        }
        if (this.mapId) {
            MetaMap.MetaFire.off(`maps/list/${this.mapId}/name`);
        }
        this.mapName = opts.name;
        this.mapId = opts.id;
        this.update();
        $(this.map_name).editable().on('save', (event, params) => {
            MetaMap.MetaFire.setData(params.newValue, `maps/list/${this.mapId}/name`);
        });
        this.bindToMapName();
    });

    MetaMap.MetaFire.on('metamap/actions', (data) => {
        this.data = _.filter(_.sortBy(data, 'order'), (d) => {
            var include = d.archive != true;
            return include;
        });
        this.update();
    });

});