<page-news>
    <div class="container">

        <div class="row">
            <div class="col-md-12">
                <h3 class="heading">Latest News</h3>
                <div id="news_carousel" class="owl-carousel owl-spaced">
                    <div each="{ data }">
                        <!--<a href="#">
                            <div class="item-img-wrap">
                                <img src="../../dist/img/img-8.jpg" class="img-responsive" alt="workimg"/>
                                <div class="item-img-overlay">
                                    <span></span>
                                </div>
                            </div>
                        </a>-->
                        <!--news link-->
                        <div class="news-desc">
                            <h5>
                                <a href="{ by ? link : 'javascript:;' }" target="_blank">{ Humanize.truncate(title, 125) }</a>
                            </h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="es6">
        this.data = [];

        CRLab.MetaFire.getData('crlab/news').then( (data) => {
            this.data = _.toArray(data);
            this.update();
            $(this.news_carousel).owlCarousel({
                // Most important owl features
                items: 4,
                itemsCustom: false,
                itemsDesktop: [1199, 4],
                itemsDesktopSmall: [980, 2],
                itemsTablet: [768, 2],
                itemsTabletSmall: false,
                itemsMobile: [479, 1],
                singleItem: false,
                startDragging: true,
                autoPlay: 4000
                });
        })
    </script>
    
</page-news>