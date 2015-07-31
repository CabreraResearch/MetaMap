const riot = require('riot');

const html = `
<div class ="page-logo">
    <a href="index.html">
        <img src="metamap/assets/img/metamap_cloud.png" alt="logo" class ="logo-default" />
    </a>
    <div class ="menu-toggler sidebar-toggler">
        <!--DOC: Remove the above "hide" to enable the sidebar toggler button on header-->
    </div>
</div>
<a href="javascript:;" class ="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
</a>
`;

module.exports = riot.tag('page-logo', html, function(opts) {

    const MetaMap = require('../entry.js');

    
});