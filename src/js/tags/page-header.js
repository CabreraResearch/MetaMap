const riot = require('riot');
const pageLogo = require('./page-logo.js');
const pageActions = require('./page-actions.js');
const pageSearch = require('./page-search.js');
const pageTopMenu = require('./page-topmenu');

const html = `
<div id="header-top" class="page-header navbar navbar-fixed-top">
    <div id="meta_progress_next" style="overflow: inherit;"></div>
    <div id="header-content" class="page-header-inner">

        <div id="meta_page_logo"></div>

        <div id="meta_page_actions"></div>

        <div id="meta_page_top" class="page-top">
            <div id="meta_page_search"></div>

            <div id="meta_page_topmenu"></div>
        </div>

    </div>

</div>
`;

module.exports = riot.tag('page-header', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.on('update', () => {
        this.logo = this.logo || riot.mount(this.meta_page_logo, 'page-logo')[0];
        this.actions = this.actions || riot.mount(this.meta_page_actions, 'page-actions')[0];
        this.search = this.search || riot.mount(this.meta_page_top, 'page-search')[0];
        this.topmenu = this.topmenu || riot.mount(this.meta_page_top, 'page-topmenu')[0];
    });

});