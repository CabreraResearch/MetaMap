const riot = require('riot');

const html = `
<div class="page-sidebar-wrapper">
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

    const MetaMap = require('../entry.js');

    this.click = function() { console.log('foo') }

    this.data = [];

    MetaMap.MetaFire.getData('metamap/sidebar').then((data) => {
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
});