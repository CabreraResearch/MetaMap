<page-topmenu>
    <div class="top-menu">
        <ul class="nav navbar-nav pull-right">
            <li class="separator hide"></li>

            <!-- BEGIN NOTIFICATION DROPDOWN -->

            <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_notification_bar">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i class="fa fa-bell-o"></i>
                    <span class="badge badge-success">
                        1
                    </span>
                </a>
                <ul class="dropdown-menu">
                    <li class="external">
                        <h3>
                            <span class="bold">1 pending</span> notification
                        </h3>
                        <a href="javascript:;">view all</a>
                    </li>
                    <li>
                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">
                            <li>
                                <a href="javascript:;">
                                    <span class="time">just now</span>
                                    <span class="details">
                                        <span class="label label-sm label-icon label-success">
                                            <i class="fa fa-plus"></i>
                                        </span>
                                        New user registered.
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="separator hide"></li>

            <!-- BEGIN POINTS DROPDOWN -->

            <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_points_bar">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i class="fa fa-trophy"></i>
                    <span class="badge badge-success">
                        3
                    </span>
                </a>
                <ul class="dropdown-menu">
                    <li class="external">
                        <h3>
                            <span class="bold">3 new</span> achievements
                        </h3>
                        <a href="javascript:;">view all</a>
                    </li>
                    <li>
                        <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">
                            <li>
                                <a href="javascript:;">
                                    <span class="time">just now</span>
                                    <span class="details">
                                        <span class="label label-sm label-icon label-success">
                                            <i class="fa fa-plus"></i>
                                        </span>
                                        Created a perspective circle!
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <!-- END POINTS DROPDOWN -->
            <li class="separator hide"></li>
            <!-- BEGIN HOME -->

            <li class="dropdown" id="header_dashboard_bar">
                <a class="dropdown-toggle" href="javascript:;">
                    <i class="fa fa-home"></i>
                </a>
            </li>
            <li class="separator hide"></li>

            <!-- BEGIN HELP DROPDOWN -->
            <li class="dropdown dropdown-extended dropdown-notification dropdown" id="header_help_bar">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i class="fa fa-graduation-cap"></i>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <ul class="dropdown-menu-list scroller" style="height: 270px;" data-handle-color="#637283">
                            <li>
                                <a href="javascript:;">
                                    <i class="fa fa-lightbulb-o"></i>
                                    <span class="title">Tutorial</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <i class="fa fa-question"></i>
                                    <span class="title">FAQ</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <i class="fa fa-life-ring"></i>
                                    <span class="title">Support</span>
                                </a>
                            </li>
                            <li onclick="UserSnap.openReportWindow();">
                                <a href="javascript:;" >
                                    <i class="fa fa-frown-o"></i>
                                    <span class="title">Feedback</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <i class="fa fa-bullseye"></i>
                                    <span class="title">Inline Training</span>
                                </a>
                            </li>
                            <li>
                                <a href="javascript:;">
                                    <i class="fa fa-laptop"></i>
                                    <span class="title">Online Training</span>
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li class="separator hide">
            </li>

            <li class="dropdown dropdown-user dropdown">
                <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <span class="username username-hide-on-mobile">
                        { username }
                    </span>
                    <img alt="" height="39" width="39" class="img-circle" src="{ picture }" />
                </a>
                <ul class="dropdown-menu dropdown-menu-default">
                    <li>
                        <a href="javascript:;">
                            <i class="fa fa-user"></i> My Profile
                        </a>
                    </li>
                    <li onclick="{ linkAccount }">
                        <a href="javascript:;">
                            <i class="fa fa-compress"></i> Link Account
                        </a>
                    </li>
                    <li onclick="{ logout }">
                        <a href="javascript:;">
                            <i class="fa fa-sign-out"></i> Log Out
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <script type="es6">
        this.username = '';
        this.picture = '';

        var that = this;
        localforage.getItem('profile').then((profile) => {
            that.username = profile.nickname;
            that.picture = profile.picture || 'assets/admin/layout4/img/avatar.jpg';
            that.update();
        });

        this.logout = () => {
            MetaMap.Auth0.logout();
        }
        
        this.linkAccount = () => {
            MetaMap.Auth0.linkAccount();
        }
        
    </script>
</page-topmenu>