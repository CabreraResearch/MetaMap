<page-news>
    <div class="container">

        <div class="row">
            <div class="col-md-12">
                <h3 class="heading">Latest News</h3>
                <div id="news_carousel" class="owl-carousel owl-spaced">
                    <div each="{ data }">
                        <!--<a href="#">
                            <div class="item-img-wrap">
                                <img src="crlab/dist/img/img-8.jpg" class="img-responsive" alt="workimg"/>
                                <div class="item-img-overlay">
                                    <span></span>
                                </div>
                            </div>
                        </a>-->
                        <!--news link-->
                        <div class="news-desc">
                            <span>{ category || 'News' }</span>
                            <h4>
                                <a href="javascript:;">{ Humanize.truncate(title, 125) }</a>
                            </h4>
                            <span>
                                By <a href="{ by ? by.link : 'javascript:;' }">{ by ? by.title : 'CRL' }</a> on { moment(date).format('MM/DD/YY') }
                            </span>
                            <span>
                                <a href="{ link }">Read more...</a>
                            </span>
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