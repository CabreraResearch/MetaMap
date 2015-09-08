const riot = require('riot');

const html = `
<div class="page-footer" style="position: fixed; bottom: 0;">
    <div class="page-footer-inner">
        <a href="#terms">&copy;2015</a>
    </div>
</div>
`;

module.exports = riot.tag('page-footer', html, function(opts) {

    const MetaMap = require('../../MetaMap');
});