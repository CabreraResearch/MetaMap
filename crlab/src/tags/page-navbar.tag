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
                <a class="navbar-brand" href="#">
                    <img if="{ data }" 
                         height="21px" 
                         width="21px" 
                         src="{ url }site/{ data.img }" 
                         alt="{ data.alt }" />
                </a>
            </div>
            <page-menu-navbar></page-menu-navbar>
        </div>
    </div>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();
        
        CRLab.MetaFire.getData(CRLab.site + '/logo').then( (data) => {
            this.data = data;
            this.update();
        })
    </script>
</page-navbar>