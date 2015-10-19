const riot = require('riot');
const pageContent = require('./page-content');

const html = `
<div class="page-container">

    <div id="meta_page_content"></div>
</div>
`;

module.exports = riot.tag('page-container', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    this.on('update', () => {
        this.content = this.content || riot.mount(this.meta_page_content, 'page-content')[0];
    });
});