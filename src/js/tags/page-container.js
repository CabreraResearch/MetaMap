const riot = require('riot');
const pageSidebar = require('./page-sidebar');
const chat = require('./cortex/chat')
const pageContent = require('./page-content');

const html = `
<div class="page-container">
    <div id="meta_page_sidebar"></div>
    <div id="meta_page_content"></div>
</div>
`;

module.exports = riot.tag('page-container', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.on('mount', () => {
        riot.mount(this.meta_page_sidebar, 'chat');
        riot.mount(this.meta_page_content, 'page-content');
    });
});