const riot = require('riot');
const CONSTANTS = require('../constants/constants');
const _ = require('lodash');

const html = `
<div class="page-content-wrapper">
    <div id="page-content" class="page-content">

        <div class="page-head">

        </div>


        <div id="app-container">

        </div>
    </div>
</div>
`;

module.exports = riot.tag('page-content', html, function (opts) {

    const MetaMap = require('../../MetaMap');

    this.hasSidebar = true;

    this.resize = () => {
        if (this.hasSidebar) {
            $(this['app-container']).css({ width: `100%` });
        } else {
            let width = `${window.innerWidth - 40}px`;
            $(this['app-container']).css({ width: width });
        }
    }

    $(window).on('resize', () => {
        this.resize()
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, () => {
        this.hasSidebar = true;
        this.resize()
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        this.hasSidebar = false;
        this.resize()
    });


});