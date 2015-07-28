<page-actions>

    <div class="page-actions">
        <div class="btn-group">
            <button type="button" class="btn red-haze btn-sm dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                <span class="hidden-sm hidden-xs">Actions&nbsp;</span><i class="fa fa-angle-down"></i>
            </button>
            <ul class="dropdown-menu" role="menu">
                <li each="{ val, i in data }" class="{ start: i == 0, active: i == 0 }">
                    <a href="{ val.link }">
                        <i class="{ val.icon }"></i> { val.title }
                    </a>
                </li>
                <li class="divider"></li>
                <li>
                    <a href="#settings">
                        <i class="fa fa-gear"></i> Settings
                    </a>
                </li>
            </ul>
        </div>

        <span if="{ pageName }">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{} </span>
    </div>

    <script type="es6">

        this.data = []
        this.pageName = ''

        MetaMap.MetaFire.getData('metamap/actions').then((data) => {
            this.data = _.filter(_.sortBy(data, 'order'), (d) => {
                var include = d.archive != true
                return include;
            });
            this.update();
        })
    </script>


</page-actions>