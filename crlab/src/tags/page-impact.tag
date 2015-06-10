<page-impact>
    <section id="impact_carousel">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="center-heading">
                        <h2 if="{ header }">{ header.title }</h2>
                        <span class="center-line"></span>
                        <p if="{ header }" class="lead">
                            { header.text }
                        </p>
                    </div>
                </div>
            </div>
            
            <div id="impact_slider">
                <div class="item" each="{ items }">
                    <a href="javascript:;">
                        <img width="200px" height="125px" src="{ parent.url }impact/{ img }" alt="{ title }"/>
                    </a>
                </div>
            </div>
        </div>
    </section>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();

        CRLab.MetaFire.getData(CRLab.site + '/impact').then( (data) => {
            this.header = data.header;
            this.items = data.items;
            this.update();

            $(this.impact_slider).owlCarousel({
                autoPlay: 3000,
                pagination: false,
                items: 4,
                itemsDesktop: [1199, 3],
                itemsDesktopSmall: [991, 2]
            });
        })

    </script>
</page-impact>