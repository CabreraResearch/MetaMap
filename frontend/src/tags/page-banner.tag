<page-banner id="home">

    <div class="fullwidthbanner">
        <div id="tp_banner" class="tp-banner">
            <ul>
                <!-- SLIDE -->
                <li each="{ data }"
                    data-transition="fade" 
                    data-slotamount="5" 
                    data-title="{ title }"
                    style="background: rgb(240,110,30);"
                    >
                    <!-- MAIN IMAGE -->
                    <img if="{ img }" src="{ parent.url + img }"  
                         alt="darkblurbg"  
                        data-bgfit="cover"
                        data-bgposition="left top" 
                        data-bgrepeat="no-repeat" />
                    <div if="{ title }" class="caption title-2 sft"
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
                             data-easing="Sine.easeOut"
                             onclick="{ parent.getLink }">
                            <a href="{ link || '' }" 
                               target="{ target || ''}"
                               class="btn btn-lg btn-theme-dark">{ title }</a>
                        </div>
                    
                    </div>

                    <div if="{ youtubeid }" class="tp-caption sft customout tp-videolayer"
						data-x="center" data-hoffset="134"
			            data-y="center" data-voffset="-6"
			            data-customin="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:5;scaleY:5;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;"
			            data-customout="x:0;y:0;z:0;rotationX:0;rotationY:0;rotationZ:0;scaleX:0.75;scaleY:0.75;skewX:0;skewY:0;opacity:0;transformPerspective:600;transformOrigin:50% 50%;"
			            data-speed="600"
			            data-start="1000"
			            data-easing="Power4.easeOut"
			            data-endspeed="500"
			            data-endeasing="Power4.easeOut"
			            data-autoplay="true"
			            data-autoplayonlyfirsttime="false"
                        
			            data-nextslideatend="false"
                        data-thumbimage="https://img.youtube.com/vi/{ youtubeid }/mqdefault.jpg">
                        <iframe src="https://www.youtube.com/embed/{ youtubeid }?hd=1&wmode=opaque&controls=1&showinfo=0"
                                width="640" 
                                height="360"
			                    style="width:640px;height:360px;">
                        </iframe>
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
                this.data = _.sortBy(data, 'order');
                this.update();
            
                $(this.tp_banner).revolution({
                    stopAtSlide: 1,
                    stopAfterLoops: 0,
                    startwidth: 1170,
                    startheight: 600,
                    hideThumbs: 10
                    //fullWidth: "on",
                    //forceFullWidth: "on",
                    //lazyLoad: "on"
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