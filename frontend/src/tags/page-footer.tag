<page-footer>
    <footer id="footer">
        <div class="container">

            <div class="row">
                <div class="col-md-3 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>{ data.about.title }</h3>
                        <p style="color: #fff;">{ data.about.text }</p>
                        <ul class="list-inline social-1">
                            <li each="{ data.about.social }">
                                <a href="{ link }" alt="{ title }">
                                    <i class="{ icon }"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--footer col-->
                <div class="col-md-3 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>Contact Us</h3>

                        <ul class="list-unstyled contact">
                            <li each="{ data.contact }">
                                <p style="color: #fff;">
                                    <strong>
                                        <i class="{ icon }"></i> { title }:
                                    </strong> { text }
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--footer col-->
                <div class="col-md-3 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>Recent</h3>
                        <ul class="list-inline f2-work">
                            <li each="{ data.recent }">
                                <a href="{ link }">
                                    <img src="{ url + img }" class="img-responsive" alt="{ title }"/>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--footer col-->
                <div class="col-md-3 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>Newsletter</h3>
                        <p style="color: #fff;">{ data.newsletter.text }</p>
                        <form role="form" class="subscribe-form">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Enter email to subscribe"/>
                                <span class="input-group-btn">
                                    <button class="btn btn-lg" type="submit">Ok</button>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
                <!--footer col-->

            </div>
            <div class="row">
                <div class="col-md-12 text-center">
                    <div class="footer-btm">
                        <span>&copy;2015 Cabrera Research Lab</span>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();
        FrontEnd.MetaFire.getData(FrontEnd.site + '/footer').then( (data) => {
            this.data = data;
            this.update();
        })
    </script>
</page-footer>