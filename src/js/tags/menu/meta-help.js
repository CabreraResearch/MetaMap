const riot = require('riot');

const html = `<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
            <i class="fa fa-graduation-cap"></i>
        </a>
        <ul class="dropdown-menu">
            <li>
                <ul class="dropdown-menu-list scroller" style="height: 270px;" data-handle-color="#637283">
                    <li if="{ help }"
                        each="{ help }"
                        onclick="{ parent.onClick }">
                        <a href="{ link }">
                            <i class="{ icon }"></i>
                            <span class="title">{ title }</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
`;

riot.tag('meta-help', html, function (opts) {

    const MetaMap = require('../../../MetaMap');

    this.onClick = (event, params) => {
        console.log(event, params);
        return true;
    }
        
    this.help = null;
    this.on('mount', () => {
        MetaMap.MetaFire.on('metamap/help', (data) => {
            this.help = _.filter(_.sortBy(data, 'order'), (d) => {
                var include = d.archive != true;
                return include;
            });
            this.update();
        });
    });
});