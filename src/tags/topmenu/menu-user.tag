<menu-user>

    <li class="dropdown dropdown-user dropdown">
        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
            <span class="username username-hide-on-mobile">
                { username }
            </span>
            <!-- DOC: Do not remove below empty space(&nbsp;) as its purposely used -->
            <img alt="" height="39" width="39" class="img-circle" src={ "picture" } />
        </a>
        <ul class="dropdown-menu dropdown-menu-default">
            <li>
                <a href="javascript:;">
                    <i class="fa fa-user"></i> My Profile
                </a>
            </li>
            <li>
                <a href="javascript:;">
                    <i class="fa fa-sign-out"></i> Log Out
                </a>
            </li>
        </ul>
    </li>

    <script>
        this.username = '';
        this.picture = '';
        var that = this;
        localforage.getItem('profile').then(function(profile){
        that.username = profile.nickname;
        that.picture = profile.picture || 'assets/admin/layout4/img/avatar.jpg';
        that.update();
        });

    </script>

</menu-user>