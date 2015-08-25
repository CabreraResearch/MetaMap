const riot = require('riot');
const pageHeader = require('./page-header');
const pageContainer = require('./page-container');
const pageFooter = require('./page-footer');
const CONSTANTS = require('../constants/constants');

const html = `
<div id="page_body" class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo">

    <div id="meta_page_header"></div>

    <div class="clearfix">
    </div>

    <div id="meta_page_container"></div>

</div>

<div id="meta_page_footer"></div>`;

module.exports = riot.tag('page-body', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.on('mount', () => {
        riot.mount(this.meta_page_header, 'page-header');
        riot.mount(this.meta_page_container, 'page-container');
//        riot.mount(this.meta_page_dialog, 'meta-dialog');
        riot.mount(this.meta_page_footer, 'page-footer');
    });
    
    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_CLOSE, () => {
        $(this.page_body).addClass('page-sidebar-reversed');
    });
    
    
    MetaMap.Eventer.on(CONSTANTS.EVENTS.SIDEBAR_OPEN, () => {
        $(this.page_body).removeClass('page-sidebar-reversed');
    });

});