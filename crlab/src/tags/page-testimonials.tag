<page-testimonials>
    <div id="testimonials-carousel" class="testimonials-v-2 wow animated fadeInUp" data-wow-duration="700ms" data-wow-delay="100ms">
        <div class="container">
            <div class="row">
                <div class="col-sm-8 col-sm-offset-2">
                    <div class="center-heading">
                        <h2>{ header.title }</h2>
                        <span class="center-line"></span>

                    </div>
                </div>
            </div>
            <!--center heading end-->

            <div class="row">
                <div class="col-sm-8 col-sm-offset-2">
                    <div id="testimonial_slide" class="testi-slide">
                        <ul class="slides">
                            <li each="{ items }">
                                <img src="{ parent.url + img }" alt="{ user }" />
                                    <p>
                                        <i class="ion-quote"></i>
                                        { text}
                                    </p>
                                    <h4 class="test-author">
                                        { user } - <em>{ subtext }</em>
                                    </h4>
                                </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="divide30"></div>

        </div>
    </div>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg('testimonials');

        CRLab.MetaFire.getData(CRLab.site + '/testimonials').then( (data) => {
        this.header = data.header;
        this.items = data.items;
        this.update();

        $(this.testimonial_slide).flexslider({
        slideshowSpeed: 5000,
        directionNav: false,
        animation: "fade"
        });

        })

    </script>
</page-testimonials>