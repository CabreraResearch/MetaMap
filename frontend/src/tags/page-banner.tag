<page-banner id="banner">

    <div class="fullwidthbanner">
        <div id="tp_banner" class="tp-banner">
            <ul>
                <!-- SLIDE -->
                <li if="{ title }" each="{ data }"
                    data-transition="fade" 
                    data-slotamount="5" 
                    data-masterspeed="1000" 
                    data-title="{ title }">
                    <!-- MAIN IMAGE -->
                    <img if="{ img }" src="{ parent.url + img }"  
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
                        <raw content="{ title }"></raw>
                    </div>

                    <div if="{ subtext }" class="caption text sfl"
                         data-x="50"
                         data-y="220"
                         data-speed="1000"
                         data-start="1800"
                         data-easing="easeOutExpo">
                        <raw content="{ subtext }"></raw>
                    </div>
                    <div each="{ buttons }">
                    
                        <div class="caption sfb rev-buttons tp-resizeme"
                             data-x="50"
                             data-y="355"
                             data-speed="500"
                             data-start="1800"
                             data-easing="Sine.easeOut">
                            <a href="#" class="btn btn-lg btn-theme-dark">{ title }</a>
                        </div>
                    
                    </div>
                </li>
                
            </ul>
        </div>
    </div>
    <script type="es6">
        this.data = [];
        this.mixin('config'); 
        this.url = this.pathImg('site');
        this.mounted = false;
        
        this.watchData('/banner', (data) => {
            if(false == this.mounted) {
                this.mounted = true;
                this.data = data;
                this.update();
            
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
            } 
            //else {
            //    this.unmount(true);
            //    riot.mount('page-banner');
            //}
        })
        
    </script>
</page-banner>