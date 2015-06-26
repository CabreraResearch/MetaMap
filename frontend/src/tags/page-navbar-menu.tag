<page-menu-navbar>
    <div class="navbar-collapse collapse">
        <ul class="nav navbar-nav navbar-right">
            <li class="{ dropdown: true, active: i == 0 }" each="{ val, i in data }">
                <a if="{ val.title }" 
                   onclick="{ parent.onClick }" 
                   href="{ val.link || '#' }" 
                   class="dropdown-toggle" 
                   data-toggle="dropdown">
                    <i if="{ val.icon }" class="{ val.icon }" ></i> { val.title } <i if="{ val.menu && val.menu.length }" class="fa fa-angle-down" ></i>
                </a>
                <ul if="{ val.menu && val.menu.length }" 
                    class="dropdown-menu multi-level" 
                    role="menu" 
                    aria-labelledby="dropdownMenu">
                    <li each="{ val.menu }" >
                        <a onclick="parent.onclick" href="{ link || '#' }">
                            <i if="{ icon }" class="{ icon }"></i>
                            <span class="title">{ title }</span>
                        </a>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
    <script type="es6">
        this.data = []
        
        this.onClick = (e,tag) => {
            if(e.item && e.item.val.link) {
                FrontEnd.Router.to(e.item.val.link)
            }
            else if(e.item && e.item.val.action) {
                console.log(e.item.val.action)
            }
        };
        
        FrontEnd.MetaFire.getData(FrontEnd.site + '/navbar').then( (data) => {
            this.data = data;
            this.update();
        })
    </script>
</page-menu-navbar>