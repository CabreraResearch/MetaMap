<page-navbar>
    <div class="navbar navbar-default navbar-static-top yamm sticky" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div>
                    <img if="{ data }" 
                         style="margin-top: 7px; margin-right: 15px;"
                         src="{ url }site/{ data.img }" 
                         alt="{ data.alt }" />
                </div>
            </div>
            <page-menu-navbar></page-menu-navbar>
        </div>
    </div>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();
        
        FrontEnd.MetaFire.getData(FrontEnd.site + '/logo').then( (data) => {
            this.data = data;
            this.update();
        })
    </script>
</page-navbar>