const riot = require('riot');

const html = `<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i class="fa fa-bell-o"></i>
                    <span class="badge badge-success">
                        { notifications.length }
                    </span>
                </a>
                <ul class="dropdown-menu">
                    <li class="external">
                        <h3>
                            <span class ="bold">{ notifications.length } pending</span> notification{ s: notifications.length == 0 || notifications.length > 1 }
                        </h3>
                        <a href="javascript:;">view all</a>
                    </li>
                    <li>
                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">
                            <li if="{ notifications }"
                                each="{ notifications }"
                                onclick="{ parent.onClick }">
                                <a href="javascript:;">
                                    <span class="time">{ time }</span>
                                    <span class="details">
                                        <span class="label label-sm label-icon label-success">
                                            <i class="fa fa-plus"></i>
                                        </span>
                                        { event }
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
`;

riot.tag('meta-notifications', html, function (opts) {

    const MetaMap = require('../../MetaMap.js');

    this.notifications = [];

    this.onClick = (event, params) => {
        console.log(event, params);
        return true;
    }
        
    this.on('mount', () => {
        MetaMap.MetaFire.on('metamap/notifications', (data) => {
            this.notifications = _.filter(_.sortBy(data, 'order'), (d) => {
                var include = d.archive != true;
                return include;
            });
            this.update();
        });
    });
});