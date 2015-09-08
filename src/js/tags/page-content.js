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

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        let width = window.innerWidth;
        $(this['app-container']).css({ width: `${width - 46}px` });
    });

    $(window).on('resize', () => {
        $(this['app-container']).css({ width: `100%` });
    });

    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, () => {
        $(this['app-container']).css({ width: `100%` });
    });

});