<page-countmein>
    <section style="background: rgb(212, 214, 215);">

        <div class="divide50"></div>

        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="center-heading">
                        <h2>{ header.title }</h2>
                        <span class="center-line"></span>
                        <p class="lead">{ header.text }</p>
                    </div>
                </div>
            </div>
            <div class="divide30"></div>
            <div class="row">
                <div class="col-md-6">
                    <div id="impact_img"  class="row">
                        <img class="img-responsive" alt="7 billion thinkers" src="{ url+impact.img }"></img>
                    </div>
                    <div class="row">
                        <h4 style="color: #f06e1e;">{ impact.text }</h4>
                    </div>
                </div>
                <!--collapse col-->
                <div class="col-md-6">
                    <div class="facts-in">
                        <h3 style="color: #f06e1e;">
                            <span id="counter" class="counter">{ data.total }</span>+
                        </h3>
                        <h4 style="color: #f06e1e;">{ engage.subtext }</h4>
                        <br/>
                        <div class="center-heading" style="margin-bottom: 0px;">
                            <p style="font-size: 26px; color: #f06e1e;"
                               class="pill">{ engage.hashtag }</p>
                        </div>
                    </div>
                    <div class="no-padding-inner gray">
                        <h3 class="wow animated fadeInDownfadeInRight animated" style="visibility: visible; text-align: center;">
                            <span class="colored-text">Six</span> things you can do
                        </h3>
                        <div each="{ val, i in _.sortBy(engage.options, 'order') }" class="services-box margin30 wow animated fadeInRight animated" style="visibility: visible; animation-name: fadeInRight; -webkit-animation-name: fadeInRight;">
                            <div class="services-box-icon">
                                <i class="{ val.icon }"></i>
                            </div>
                            <div class="services-box-info">
                                <h4>{ val.title }</h4>
                                <p>{ val.text }</p>
                                <div if="{ val.buttons }" each="{ _.sortBy(val.buttons, 'order') }">
                                    <a href="{ link || '' }"
                                        target="{ target || ''}"
                                        class="btn btn-lg btn-theme-dark">{ title }</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--<div class="row">
                        <div class="col-md-8 col-md-offset-2">
                            <div class="panel-group" id="count_me_in">
                                <div each="{ val, i in _.sortBy(engage.options, 'order') }" class="panel panel-default">
                                    <div class="panel-heading" style="background: rgb(212, 214, 215);">
                                        <h4 class="panel-title">
                                            <a style="text-align: left;" data-toggle="collapse" data-parent="#count_me_in" href="#count_me_in_{ i }">
                                                { i + '. ' + val.text }
                                            </a>
                                        </h4>
                                    </div>
                                    <div id="count_me_in_{ i }" class="panel-collapse collapse { in: i == 0 }">
                                        <div class="panel-body">
                                            { val.text }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>-->
                </div>
            </div>
        </div>
    </section>
    
    <script>
        this.mixin('config'); 
        this.url = this.pathImg('site');
        
        FrontEnd.MetaFire.getData(`${FrontEnd.site}/count-me-in`).then( (data) => {
            this.data = data;
            this.impact = data.impact;
            this.engage = data.engage;
            this.header = data.header;
            
            this.update()
            
            $(this.counter).counterUp({
                delay: 100,
                time: 800
            });
        });

    </script>
</page-countmein>