<page-menu-navbar>
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
            <li class="dropdown {active: data.indexOf(this) == 1}" each={ "data" }>
                <a if={ "icon" } href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i if={ "icon" } class={ "icon" } ></i> { title } <i if={ "menu.length" } class="fa fa-angle-down" ></i>
                </a>
                <ul if={ "menu.length" } class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                    <li each={ "menu" } >
                        <a href="#">
                            <i if={ "icon" } class={ "icon" }></i>
                            <span class="title">{ title }</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <script type="es6">
        var that = this;
        that.data = [];
        that.MetaMap = MetaMap;
        that.MetaMap.MetaFire.getData('menu/sidebar').then(function(data){
        that.data = data;
        that.update();
        })
    </script>
</page-menu-navbar>