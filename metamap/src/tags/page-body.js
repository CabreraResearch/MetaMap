const riot = require('riot');
const pageHeader = require('./page-header');
const pageContainer = require('./page-container');
const metaDialog = require('./components/meta-dialog');
const pageFooter = require('./page-footer');

const html = `
<div id="page_body" class="page-header-fixed page-sidebar-closed-hide-logo page-sidebar-closed-hide-logo">

    <div id="meta_page_header"></div>

    <div class="clearfix">
    </div>

    <div id="meta_page_container"></div>

</div>

<div id="meta_page_dialog"></div>

<div id="meta_page_footer"></div>`;

module.exports = riot.tag('page-body', html, function(opts) {

    this.on('mount', () => {
        riot.mount(this.meta_page_header, 'page-header');
        riot.mount(this.meta_page_container, 'page-container');
        riot.mount(this.meta_page_dialog, 'meta-dialog');
        riot.mount(this.meta_page_footer, 'page-footer');
    });

});