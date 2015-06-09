<page-menu-navbar>
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
            <li class={ dropdown: true, active: data && data.indexOf(this) == 1} each={ data }>
                <a if={ title } href="#" class="dropdown-toggle" data-toggle="dropdown">
                    <i if={ icon } class={ icon } ></i> { title } <i if={ menu && menu.length } class="fa fa-angle-down" ></i>
                </a>
                <ul if={ menu && menu.length } class="dropdown-menu multi-level" role="menu" aria-labelledby="dropdownMenu">
                    <li each={ menu } >
                        <a href="#">
                            <i if={ icon } class={ icon }></i>
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
        CRLab.MetaFire.getData('crlab/navbar').then( (data) => {
            that.data = data;
            that.update();
        })
    </script>
</page-menu-navbar>