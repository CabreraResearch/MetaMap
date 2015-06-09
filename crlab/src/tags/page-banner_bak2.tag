<page-banner>

    <div if="{ data && data.length > 0 }"
        id="myCarousel"
        class="carousel slide"
        data-ride="carousel">
        <!-- Carousel indicators -->
        <ol class="carousel-indicators">
            <li each="{ name, i in data }" data-target="#myCarousel"
                data-slide-to="{ i }"
                class="{ i == 0 }">
            </li>
        </ol>
        <div class="carousel-inner">
            <div each="{ data }"
                 class="item item-c-slide {active: parent.data.indexOf(this) <= 0}"
                 style="background-size: 620px 510px; background-repeat: no-repeat; background-position: right 10px top; background-image: url(crlab/dist/img/{ img }); background-color: rgb(240, 110, 30);"
                     >
                     <div class="container">
                    <div class="row">
                        <div class="col-sm-12 text-left slide-text">
                            <h1 class="animated slideInLeft delay-1">
                                <div>{ title }</div>
                            </h1>
                            <div class="divide15"></div>
                            <p class="animated slideInLeft delay-2">{ subtext }</p>
                            <div class="divide15"></div>
                            <p class="animated slideInLeft delay-3">
                                <a each="{ buttons }" href="#" class="btn btn-lg btn-theme-bg"> { title }</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>
    <script type="es6">
        var that = this;
        that.data = [];
        CRLab.MetaFire.getData('crlab/banner').then( (data) => {
        that.data = data;
        that.update();
        
        })
    </script>
</page-banner>