<page-sidebar>

    <div class="page-sidebar-wrapper">
        <!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
        <!-- DOC: Change data-auto-speed="200" to adjust the sub menu slide up/down speed -->
        <div class="page-sidebar navbar-collapse collapse">
            <!-- BEGIN SIDEBAR MENU -->
            <!-- DOC: Apply "page-sidebar-menu-light" class right after "page-sidebar-menu" to enable light sidebar menu style(without borders) -->
            <!-- DOC: Apply "page-sidebar-menu-hover-submenu" class right after "page-sidebar-menu" to enable hoverable(hover vs accordion) sub menu mode -->
            <!-- DOC: Apply "page-sidebar-menu-closed" class right after "page-sidebar-menu" to collapse("page-sidebar-closed" class must be applied to the body element) the sidebar sub menu mode -->
            <!-- DOC: Set data-auto-scroll="false" to disable the sidebar from auto scrolling/focusing -->
            <!-- DOC: Set data-keep-expand="true" to keep the submenues expanded -->
            <!-- DOC: Set data-auto-speed="200" to adjust the sub menu slide up/down speed -->
            <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">

                <li each={ data }  onclick={ parent.once }>
                    <a if={ icon } href="javascript:;">
                        <i class={ icon } style="color:#{ color };"></i>
                        <span class="title">{ title }</span>
                        <span class={ arrow: menu.length }></span>
                    </a>
                    <ul if={ menu.length } class="sub-menu">
                        <li each={ menu }>
                            <a href="javascript:;">
                                <i class={ icon }></i>
                                <span class="title">{ title }</span>
                            </a>
                        </li>
                    </ul>
                </li>

            </ul>

        </div>
    </div>

    <script>
        this.data = [];
        this.MetaMap = require('MetaMap');
        this.MetaMap.MetaFire.getData('menu/sidebar').then( (data) => {
            this.data = data;
            this.update();
        } )
        //this.data = [{
        //    icon: 'fa fa-adjust',
        //    color: 'eb4a3b',
        //    title: 'Distinctions Layout',
        //    hasMenu: true,
        //    menu: [
        //        {
        //            icon: 'icon-Dtag',
        //            title: 'D-Tag'
        //        }, {
        //            icon: 'icon-Dclone',
        //            title: 'Clone'
        //        }, {
        //            icon: 'fa fa-cubes',
        //            title: 'Advanced D-Editor'
        //        }
        //    ]
        //}, {
        //    icon: 'icon-Smain',
        //    color: '95c83d',
        //    title: 'System Layout',
        //    hasMenu: true,
        //    menu: [{
        //        icon: 'icon-Sleft',
        //        title: 'Left'
        //    }, {
        //        icon: 'icon-Sright',
        //        title: 'Right'
        //    }, {
        //        icon: 'icon-Sstack',
        //        title: 'Stack'
        //    }, {
        //        icon: 'icon-Sfreehand',
        //        title: 'Freehand'
        //    }
        //    ]
        //}, {
        //    icon: 'fa fa-share-alt-square',
        //    color: '4bbdc2',
        //    title: 'Relationship Layout',
        //    hasMenu: true,
        //    menu: [{
        //        icon: 'fa fa-minus',
        //        title: 'None'
        //    }, {
        //        icon: 'fa fa-long-arrow-left',
        //        title: 'Left'
        //    }, {
        //        icon: 'fa fa-long-arrow-right',
        //        title: 'Right'
        //    }, {
        //        icon: 'fa fa-arrows-h',
        //        title: 'Bi-directional'
        //    }
        //    ]
        //}, {
        //    icon: 'icon-Pmain',
        //    color: 'faaa35',
        //    title: 'Perspectives Layout',
        //    hasMenu: true,
        //    menu: [{
        //        icon: 'fa fa-eye',
        //        title: 'P-editor'
        //    }, {
        //        icon: 'icon-Plines',
        //        title: 'Left'
        //    }, {
        //        icon: 'fa fa-long-arrow-right',
        //        title: 'Lines'
        //    }, {
        //        icon: 'icon-Pspotlight',
        //        title: 'Spotlight'
        //    }, {
        //        icon: 'icon-Pboth',
        //        title: 'Both'
        //    }
        //    ]
        //}, {
        //    icon: 'fa fa-picture-o',
        //    color: '',
        //    title: 'Insert Attachments',
        //    hasMenu: false,
        //    menu: []
        //}, {
        //    icon: 'fa fa-wrench',
        //    color: '',
        //    title: 'Tools',
        //    hasMenu: true,
        //    menu: [{
        //        icon: 'fa fa-question-circle',
        //        title: 'ThinkQuery'
        //    }, {
        //        icon: 'fa fa-comments',
        //        title: 'Comments'
        //    }, {
        //        icon: 'fa fa-desktop',
        //        title: 'Presenter'
        //    }, {
        //        icon: 'fa fa-magic',
        //        title: 'Course Builder'
        //    }, {
        //        icon: 'icon-jig',
        //        title: 'Jig Creator'
        //    }, {
        //        icon: 'fa fa-tags',
        //        title: 'K-12'
        //    }
        //    ]
        //}, {
        //    icon: 'fa fa-flask',
        //    color: '',
        //    title: 'Analytics',
        //    hasMenu: true,
        //    menu: [{
        //        icon: 'fa fa-square',
        //        title: 'Thing'
        //    }, {
        //        icon: 'fa fa-share-alt-square',
        //        title: 'Relationship'
        //    }, {
        //        icon: 'fa fa-bar-chart-o',
        //        title: 'Map'
        //    }
        //    ]
        //}];

        once() {
            _.once(window.Layout.init);
        }

    </script>
</page-sidebar>