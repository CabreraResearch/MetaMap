const riot = require('riot');
const CONSTANTS = require('../constants/constants');

const html = `
<div class ="page-logo">
    <a id="meta_logo" href="#home">
        <img src="src/images/Homunculus_cloud.png" alt="logo" class ="logo-default" />
    </a>
</div>
`;

module.exports = riot.tag('page-logo', html, function(opts) {

    const Homunculus = require('../../Homunculus');

    this.isSidebarOpen = false;

    var toggle = (state) => {
        if(this.isSidebarOpen != state) {
            this.isSidebarOpen = state
            $(this.meta_menu_toggle).click()
        }
    };

    this.onClick = () => {
       // Homunculus.Eventer.do(CONSTANTS.EVENTS.SIDEBAR_TOGGLE);
    }

    this.getDisplay = (el) => {
        if(Homunculus && Homunculus.Router && Homunculus.Router.currentPath == CONSTANTS.PAGES.TRAININGS) {
            toggle(true)
            return 'visible'
        } else {
            return 'hidden'
        }
    }

    Homunculus.Eventer.every('pageName', (opts) => {
        this.update()
    })
});