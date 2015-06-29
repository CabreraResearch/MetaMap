<page-footer id="contact">
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

                        <div id="mc_embed_signup">
                            <form action="{ data.newsletter.mailchimp }" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate="">
                                <p style="color: #fff;">{ data.newsletter.text }</p>
                                <div id="mc_embed_signup_scroll" >
                                    <div class="form-group">
                                        <div class="input-group">
                                            <span class="input-group-addon">E-Mail</span>
                                            <input type="email" value="" name="EMAIL" class="form-control required email" id="mce-EMAIL" />
                                        </div>
                                        <button type="submit" value="Subscribe" name="subscribe" 
                                                style="margin-top: 5px;"
                                                id="mc-embedded-subscribe"
                                                class="btn btn-theme-bg">Subscribe</button>
                                    </div>
                                    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                                    <div style="position: absolute; left: -5000px;">
                                        <input type="text" name="b_58947385383d323caf9047f39_40c673760d" tabindex="-1" value="" />
                                    </div>
            
                                    <div id="mce-responses" class="clear" style="margin-top: 5px;">
                                        <div class="response" id="mce-error-response" style="color: red; display:none"></div>
                                        <div class="response" id="mce-success-response" style="color: #fff; display:none"></div>
                                    </div>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
                <!--footer col-->

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