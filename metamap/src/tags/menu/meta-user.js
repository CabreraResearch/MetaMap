const riot = require('riot');

const html = `<a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <span class="username username-hide-on-mobile">
                        { username }
                    </span>
                    <img alt="" height="39" width="39" class="img-circle" src="{ picture }" />
                </a>
                <ul class="dropdown-menu dropdown-menu-default">
                    <li if="{ menu }"
                        each="{ menu }"
                        onclick="{ parent.onClick }">
                        <a href="{ link }">
                            <i class="{ icon }"></i> { title }
                        </a>
                    </li>
                </ul>
`;

riot.tag('meta-user', html, function (opts) {

    const MetaMap = require('../../entry.js');

    this.menu = [];
    this.username = '';
    this.picture = '';

    this.logout = () => {
        MetaMap.logout();
    }

    this.linkAccount = () => {
        MetaMap.Auth0.linkAccount();
    }

    this.onClick = (event, params) => {
        switch(event.item.link) {
            case '#logout':
                this.logout();
                return false;
                break;

            case '#link-social-accounts':
                this.linkAccount();
                return false;
                break;

            default:
                console.log(event, params);
                return true;
                break;
        }
    }

    this.on('mount', () => {
        MetaMap.MetaFire.on(`metamap/user`, (data) => {
            this.username = MetaMap.User.displayName;
            this.picture = MetaMap.User.picture;
            this.menu = _.filter(_.sortBy(data, 'order'), (d) => {
                var include = d.archive != true;
                return include;
            });
            this.update();
        });
    });
});