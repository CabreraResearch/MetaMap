const riot = require('riot');
const CONSTANTS = require('../constants/constants');

const html = `
<div class ="page-logo">
    <a id="meta_logo" href="#home">
        <img src="src/images/metamap_cloud.png" alt="logo" class ="logo-default" />
    </a>

    <div id="meta_menu_toggle" class="menu-toggler sidebar-toggler quick-sidebar-toggler" onclick="{ onClick }" style="visibility:{ getDisplay() };">
        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->
    </div>
</div>
<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
</a>
`;

module.exports = riot.tag('page-logo', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.isSidebarOpen = false;

    var toggle = (state) => {
        if(this.isSidebarOpen != state) {
            this.isSidebarOpen = state
            $(this.meta_menu_toggle).click()
        }
    };

    this.onClick = () => {
       // MetaMap.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
    }

    this.getDisplay = (el) => {
        if(MetaMap && MetaMap.Router && MetaMap.Router.currentPath == CONSTANTS.PAGES.TRAININGS) {
            toggle(true)
            return 'visible'
        } else {
            return 'hidden'
        }
    }

    MetaMap.Eventer.every('pageName', (opts) => {
        this.update()
    })
});