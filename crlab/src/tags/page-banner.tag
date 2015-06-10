<page-banner>

    <div class="fullwidthbanner">
        <div id="tp_banner" class="tp-banner">
            <ul>
                <!-- SLIDE -->
                <li data-transition="fade" 
                    data-slotamount="5" 
                    data-masterspeed="1000" 
                    data-title="Powerful Theme">
                    <!-- MAIN IMAGE -->
                    <img src="crlab/dist/img/site/book_banner.png"  
                         alt="darkblurbg"  
                        data-bgfit="cover"
                        data-bgposition="left top" 
                        data-bgrepeat="no-repeat" />
                    <div class="caption title-2 sft" 
                         data-x="50"
                         data-y="100"
                         data-speed="1000"
                         data-start="1000"
                         data-easing="easeOutExpo">
                        Become a <br/>
                        Systems Thinker
                    </div>

                    <div class="caption text sfl"
                         data-x="50"
                         data-y="220"
                         data-speed="1000"
                         data-start="1800"
                         data-easing="easeOutExpo">
                         Solve everyday and wicked problems. <br/>
                         Increase your personal effectiveness. <br/>
                         Transform your organization. <br/>
                         This book is for anyone interested in learning <br/>
                         the foundational ideas of systems thinking.
                    </div>
                    <div class="caption sfb rev-buttons tp-resizeme"
                         data-x="50"
                         data-y="355"
                         data-speed="500"
                         data-start="1800"
                         data-easing="Sine.easeOut">
                        <a href="#" class="btn btn-theme-bg btn-lg">Pre-order Now</a>
                    </div>
                    
                </li>
                
            </ul>
        </div>
    </div>
    <script type="es6">
        this.data = [];
        this.mixin('config'); 
        this.url = this.pathImg();
        
        $(this.tp_banner).revolution({
            delay: 6000,
            startwidth: 1170,
            startheight: 600,
            hideThumbs: 10,
            //fullWidth: "on",
            //forceFullWidth: "on",
            lazyLoad: "on"
            // navigationStyle: "preview4"
        });
        
        //CRLab.MetaFire.getData('crlab/banner').then( (data) => {
        //    this.data = data;
        //    this.update();
        //})
        
    </script>
</page-banner>