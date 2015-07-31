const riot = require('riot');
const pageSidebar = require('./page-sidebar.js');
const pageContent = require('./page-content.js');

const html = `
<div class="page-container">
    <div id="meta_page_sidebar"></div>
    <div id="meta_page_content"></div>
</div>
`;

module.exports = riot.tag('page-container', html, function(opts) {

    const MetaMap = require('../entry.js');

    this.on('mount', () => {
        riot.mount(this.meta_page_sidebar, 'page-sidebar');
        riot.mount(this.meta_page_content, 'page-content');
    });
});