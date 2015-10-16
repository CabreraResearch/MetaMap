const riot = require('riot');
const pageHeader = require('./page-header');
const pageContainer = require('./page-container');
const pageFooter = require('./page-footer');
const CONSTANTS = require('../constants/constants');

const html = `
<div id="page_body" class="page-header-fixed page-sidebar-reversed">

    <div id="meta_page_header"></div>

    <div class="clearfix">
    </div>

    <div id="meta_page_container"></div>

</div>`;

module.exports = riot.tag('page-body', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.on('mount', () => {
        riot.mount(this.meta_page_header, 'page-header');
        riot.mount(this.meta_page_container, 'page-container');
    });

});