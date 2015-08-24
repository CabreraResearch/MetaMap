const riot = require('riot');

const html = `
<!-- DOC: Apply "search-form-expanded" right after the "search-form" class to have half expanded search box -->
<form class="search-form" action="extra_search.html" method="GET">
    <div class="input-group">
        <input type="text" class="form-control input-sm" placeholder="Search..." name="query">
            <span class="input-group-btn">
                <a href="javascript:;" class="btn submit">
                    <i class="fa fa-search"></i>
                </a>
            </span>
        </div>
</form>
`;

module.exports = riot.tag('page-search', html, function(opts) {

    const MetaMap = require('../../MetaMap');

    
});