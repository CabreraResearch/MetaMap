<page-menu-navbar>
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
            <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }">
                <a if="{ val.title }" href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i>
                </a>
                <ul if="{ val.menu && val.menu.length }" 
                    class="dropdown-menu multi-level" 
                    role="menu" 
                    aria-labelledby="dropdownMenu">
                    <li each="{ val.menu }" >
                        <a href="#">
                            <i if="{ icon }" class="{ icon }"></i>
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
        CRLab.MetaFire.getData(CRLab.site + '/navbar').then( (data) => {
            that.data = data;
            that.update();
        })
    </script>
</page-menu-navbar>