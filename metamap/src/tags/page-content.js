const riot = require('riot');

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

module.exports = riot.tag('page-content', html, function(opts) {

    const MetaMap = require('../entry.js');

  
});