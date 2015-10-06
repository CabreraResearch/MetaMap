const riot = require('riot');
const $ = require('jquery')
require('bootstrap-hover-dropdown')
const moment = require('moment')

const CONSTANTS = require('../../constants/constants')
require('../../tools/shims')

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
                        <a if="{ allNotifications.length > 1 }" href="javascript:;">view all</a>
                    </li>
                    <li>
                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">
                            <li if="{ true != archived }"
                                each="{ val, i in notifications }"
                                onclick="{ parent.onClick }">
                                <a>
                                    <span if="{ val.photo }" class="photo">
										<img src="{ val.photo }" class="img-circle" alt="">
                                    </span>
                                    <span class="subject">
										<span class="from">{ val.from }</span>
										<span class="time" style="padding: 0;">{ parent.getTime(val.time) }</span>
                                    </span>
                                    <span class="message">{ val.event }</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
`;

riot.tag('meta-notifications', html, function (opts) {

    const MetaMap = require('../../../MetaMap.js');
    const fbPath = CONSTANTS.ROUTES.NOTIFICATIONS.format(MetaMap.User.userId)

    this.notifications = [];
    this.allNotifications = [];

    this.onClick = (event, params) => {
        let item = event.item.val
        MetaMap.MetaFire.setData(true, `${fbPath}/${item.id}/archive`)
        return true;
    }

    this.getTime = (time) => {
        return moment(new Date(time)).fromNow()
    }

    this.on('mount', () => {
        MetaMap.MetaFire.getData(fbPath)
            .then((data) => {
                if (!data) {
                    MetaMap.MetaFire.pushData({
                        event: 'You signed up for MetaMap!',
                        time: `${new Date() }`,
                        archive: false
                    }, fbPath)
                }
                MetaMap.MetaFire.on(CONSTANTS.ROUTES.NOTIFICATIONS.format(MetaMap.User.userId), (data) => {
                    this.allNotifications = _.map(data, (n, id) => { n.id = id; return n;  });
                    this.notifications = _.filter(_.sortBy(this.allNotifications, 'date'), (d) => {
                        var include = d.archive != true;
                        return include;
                    });
                    this.update();
                });
            })
    });
});