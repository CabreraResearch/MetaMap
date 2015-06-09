<page-banner>
    
    <div class="fullwidthbanner">
        <div class="tp-banner">
            <ul>
                
                <li if={ title } each={ data }
                    data-transition="fade" 
                    data-slotamount="5" 
                    data-masterspeed="1000" 
                    data-title="{ title }">
                    <!-- MAIN IMAGE -->
                    <img src="crlab/dist/img/{ img }" 
                         alt="darkblurbg"  
                         data-bgfit="cover" 
                         data-bgposition="left top" 
                         data-bgrepeat="no-repeat" />
                    <div class="caption title-2 sft" style="text-align: center;"
                         data-x="50"
                         data-y="160"
                         data-speed="1000"
                         data-start="1000"
                         data-easing="easeOutExpo">
                        <span>{ title }</span>
                    </div>



                    <div if={ subtext } class="caption text sfl"
                         data-x="50"
                         data-y="310"
                         data-speed="1000"
                         data-start="1800"
                         data-easing="easeOutExpo">
                         { subtext }
                    </div>

                    <div each={ buttons }>
                    
                        <div class="caption sfb rev-buttons tp-resizeme"
                             data-x="50"
                             data-y="380"
                             data-speed="500"
                             data-start="1800"
                             data-easing="Sine.easeOut">
                            <a href="#" class="btn btn-theme-bg btn-lg">{ title }</a>
                        </div>
                    
                    </div>
                </li>
                
            </ul>
        </div>
    </div>
    <script type="es6">
        var that = this;
        that.data = [];
        debugger;
        CRLab.MetaFire.getData('crlab/banner').then( (data) => {
        that.data = data;
        that.update();

        _.delay(function () {
            jQuery('.tp-banner').revolution(
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
            }, 500);
        })
    </script>
</page-banner>