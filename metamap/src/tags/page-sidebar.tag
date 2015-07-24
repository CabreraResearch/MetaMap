<page-sidebar>

    <div class="page-sidebar-wrapper">
        <div class="page-sidebar navbar-collapse collapse">
            <ul class="page-sidebar-menu " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">

                <li onclick="{ parent.click }" each="{ data }">
                    <a if="{ icon }" href="javascript:;">
                        <i class="{ icon }" style="color:#{ color };"></i>
                        <span class="title">{ title }</span>
                        <span class="{ arrow: menu.length }"></span>
                    </a>
                    <ul if="{ menu.length }" class="sub-menu">
                        <li each="{ menu }">
                            <a href="javascript:;">
                                <i class="{ icon }"></i>
                                <span class="title">{ title }</span>
                            </a>
                        </li>
                    </ul>
                </li>

            </ul>

        </div>
    </div>

    <script>
       
       this.click = function() {console.log('foo')}
       
        var that = this;
        that.data = [];
        that.MetaMap = MetaMap;
        that.MetaMap.MetaFire.getData('metamap/sidebar').then(function(data){
            that.data = _.filter(_.sortBy(data, 'order'), (d) => { 
                var include = d.archive != true
                if(include && d.menu && d.menu) {
                    d.menu = _.filter(_.sortBy(d.menu, 'order'), (m) => { 
                        return m.archive != true
                    });
                }
                return include;  
            });
            that.update();
        })

    </script>
</page-sidebar>