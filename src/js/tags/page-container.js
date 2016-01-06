const riot = require('riot');
const pageContent = require('./page-content');
const CONSTANTS = require('../constants/constants');

const html = `
<div class="page-container">
    <div id="meta_page_content"></div>
</div>
`;

module.exports = riot.tag('page-container', html, function(opts) {

    const Homunculus = require('../../Homunculus');

    this.on('update', () => {
        this.content = this.content || riot.mount(this.meta_page_content, 'page-content')[0];
    });
});