const riot = require('riot');
const CONSTANTS = require('../constants/constants');

const html = `
<div class="page-sidebar-wrapper" style="{ getDisplay() }">
    <div class="page-sidebar navbar-collapse collapse">
        <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">

            <li if="{ data }" onclick="{ parent.click }" each="{ data }">
                <a if="{ icon }" href="javascript:;">
                    <i class="{ icon }" style="color:#{ color };"></i>
                    <span class="title">{ title }</span>
                    <span class="{ arrow: menu.length }"></span>
                </a>
                <ul if="{ menu && menu.length }" class="sub-menu">
                    <li each="{ menu }">
                        <a href="javascript:;">
                            <i class="{ icon }"></i>
                            <span class="title">{ title }</span>
                        </a>
                    </li>
                </ul>
            </li>

        </ul>

    </div>
</div>
`;

module.exports = riot.tag('page-sidebar', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.click = function() { console.log('foo') }
    this.display = true;
    this.data = [];

    MetaMap.MetaFire.on('metamap/sidebar', (data) => {
        this.data = _.filter(_.sortBy(data, 'order'), (d) => {
            var include = d.archive != true;
            if (include && d.menu && d.menu) {
                d.menu = _.filter(_.sortBy(d.menu, 'order'), (m) => {
                    return m.archive != true;
                });
            }
            return include;
        });
        this.update();
    });
    
    this.getDisplay = () => {
        if(!this.display) {
            return 'display: none;';
        } else {
            return '';
        }
    }
    
    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        this.display = false;
        this.update();
    });
    
    
    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, () => {
        this.display = true;
        this.update();
    });
});