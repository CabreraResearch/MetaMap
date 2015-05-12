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

                <!-- Distinctions -->

                <li each={ data }>
                    <a if={ icon } href="javascript:;">
                        <i class={ icon } style="color:#{ color };"></i>
                        <span class="title">{ title }</span>
                        <span class="arrow "></span>
                    </a>
                    <ul if={hasMenu} class="sub-menu">
                        <li each={menu}>
                            <a href="javascript:;">
                                <i class={ icon }></i>
                                <span class="title">{ title }</span>
                            </a>
                        </li>
                    </ul>
                </li>

            </ul>
            <!-- END SIDEBAR MENU -->
        </div>
    </div>

    <script>
        this.data = [{
            icon: 'fa fa-adjust',
            color: 'eb4a3b',
            title: 'Distinctions Layout',
            hasMenu: true,
            menu: [
                {
                    icon: 'icon-Dtag',
                    title: 'D-Tag'
                }, {
                    icon: 'icon-Dclone',
                    title: 'Clone'
                }, {
                    icon: 'fa fa-cubes',
                    title: 'Advanced D-Editor'
                }
            ]
        }, {

        }];

    </script>
</page-sidebar>