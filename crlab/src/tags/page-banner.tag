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
                    <img src="crlab/dist/img/book_banner.png"  
                         alt="darkblurbg"  
                        data-bgfit="cover"
                        data-bgposition="left top" 
                        data-bgrepeat="no-repeat" />
                    <div class="caption title-2 sft" 
                         style="text-align: center;"
                         data-x="50"
                         data-y="100"
                         data-speed="1000"
                         data-start="1000"
                         data-easing="easeOutExpo">
                        GET THE BOOK <br/> THAT'S CHANGING <br/> THE WORLD
                    </div>

                    <div class="caption text sfl"
                         style="text-align: center;"
                         data-x="50"
                         data-y="280"
                         data-speed="1000"
                         data-start="1800"
                         data-easing="easeOutExpo">
                         Systems thinking can help us solve everyday and wicked problems,<br/>
                         increase our personal effectiveness as human beings, <br/> 
                         and transform our organizations. <br/> 
                         This book is for anyone interested in learning <br/>
                         the foundational ideas of systems thinking.
                    </div>
                    <div class="caption sfb rev-buttons tp-resizeme"
                         data-x="185"
                         data-y="415"
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
        var that = this;
        that.data = [];
        
        CRLab.MetaFire.getData('crlab/banner').then( (data) => {
        that.data = data;
        that.update();

        _.delay(function () {
        $(that.tp_banner).revolution(
        {
        delay: 6000,
        startwidth: 1170,
        startheight: 600,
        hideThumbs: 10,
        //fullWidth: "on",
        //forceFullWidth: "on",
        lazyLoad: "on"
        // navigationStyle: "preview4"
        });
        }, 100);
        })
    </script>
</page-banner>