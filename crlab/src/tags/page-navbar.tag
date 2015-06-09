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
                    <img height="21px" width="21px" src="crlab/dist/img/{ data.img }" alt={ data.alt } />
                </a>
            </div>
            <page-menu-navbar></page-menu-navbar>
        </div>
    </div>
    <script type="es6">
        var that = this;
        that.data = [];
        CRLab.MetaFire.getData('crlab/logo').then( (data) => {
            that.data = data;
            that.update();
        })
    </script>
</page-navbar>