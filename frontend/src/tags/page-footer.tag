<page-footer >
    <footer id="footer">
        <div id="contact" class="container">
            <div class="row">
                <div class="col-md-3 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>{ data.about.title }</h3>
                        <p style="color: #fff;">{ data.about.text }</p>
                        
                        <ul class="list-unstyled contact">
                            <li each="{ _.sortBy(data.contact,'order') }">
                                <p style="color: #fff;">
                                    <strong>
                                        <i class="{ icon }"></i>{ title || '' }
                                    </strong>
                                    <a if="{ link }" href="{ link }" style="color: #fff" >{ text || link }</a>
                                    <span if="{ !link }">{ text }</span>
                                </p>
                            </li>
                        </ul>
                        
                        <ul id="social_follow" class="list-inline social-1">
                            <li each="{ _.sortBy(data.about.social, 'order') }">
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
                        <h3>Follow Us</h3>

                        <a if="{ social.twitter }" class="twitter-timeline" 
                           href="https://twitter.com/{ social.twitter.title }" 
                           data-widget-id="{ social.twitter.api }">Tweets by @{ social.twitter.title }</a>
                        
                    </div>
                </div>
                <!--footer col-->
                <div class="col-md-3 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>Like Us</h3>
                        <div if="{ social.facebook }" class="fb-page" data-href="https://www.facebook.com/{ social.facebook.title }" 
                             data-small-header="true" 
                             data-adapt-container-width="true" 
                             data-hide-cover="false" 
                             data-show-facepile="true" 
                             data-height="300"
                             data-width="280"
                             data-show-posts="true">
                            <div class="fb-xfbml-parse-ignore">
                                <blockquote cite="https://www.facebook.com/{ social.facebook.title }">
                                    <a href="https://www.facebook.com/{ social.facebook.title }">{ title }</a>
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </div>
                <!--footer col-->
                <div class="col-md-3 col-sm-6 margin30">
                    <div class="footer-col">
                        <h3>Join Us</h3>

                        <div id="mc_embed_signup">
                            <form action="//cabreralabs.us4.list-manage.com/subscribe/post?u=58947385383d323caf9047f39&amp;id=9799d3a7b9" 
                                  method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="" target="_blank" novalidate="">
                            <p style="color: #fff;">{ data.newsletter.text }</p>
                                <div id="mc_embed_signup_scroll">
                                    <div class="mc-field-group">
                                        <div class="input-group">
                                            
                                            <input type="email" 
                                                   placeholder="Email..."
                                                   style="height: 31px;"
                                                   value="" name="EMAIL" class="form-control" id="mce-EMAIL" />
                                            <span class="input-group-btn">
                                                <input role="button" type="submit" value="Subscribe" name="subscribe"
                                                    id="mc-embedded-subscribe"
                                                    class="btn btn-theme-bg">Subscribe</input>
                                            </span>
                                        </div>
                                        
                                    </div>
                                    <!--real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
                                    <div style="position: absolute; left: -5000px;">
                                        <input type="text" name="b_58947385383d323caf9047f39_9799d3a7b9" tabindex="-1" value="" />
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
            </div>
        </div>
    </footer>
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();
        
        this.social = null
        this.data = null
        this.title = FrontEnd.config.site.title
        
        FrontEnd.MetaFire.getData(`${FrontEnd.site}/footer`).then( (data) => {
            this.data = data;
            this.update();
            
            FrontEnd.MetaFire.getData(`${FrontEnd.site}/social`).then( (social) => {
                this.social = social
                this.update();
                FrontEnd.initSocial()
            });
            
        })
    </script>
</page-footer>