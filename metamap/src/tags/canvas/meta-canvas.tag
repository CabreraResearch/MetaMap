<meta-canvas>
    <div class="portlet light">
        <div class="portlet-body" id="diagram"></div>
    </div>
    <div id="overview-diagram" style="display: none;"></div>

    <script type="es6">

        this.mapId = null
        this.canvas = null
        
        this.buildCanvas = (map) => {
            if(!this.canvas) {
                $(this.diagram).empty()
                $(this['overview-diagram']).empty()
            
                var x = {
                    mapId: this.mapId,
                    ccsTagging: {},
                    safeApply: function (fn, ...params) {
                        if (fn) {
                            fn(...params);
                        }
                    },
                    $watch: function () { },
                    get: function () { return { then: function () { } } },
                    isTouchDevice: function () { return false; }
                }
            
                this.update();

                x.mapData = map;
                map.metadata = {
                    sandbox: null,
                    canEdit: true
                };
                map.state_data = {
                        "showNavigator":false,
                        "currentTab":null,
                        "perspectivePointKey":null,
                        "distinctionThingKey":null
                    }
                map.editor_options = {
                        "defaultRelationshipDirection":"noArrows",
                        "defaultThingLayout":"left",
                        "perspectiveMode":"lines"
                    }

                this.canvas = MapEditorCtrl(x, x, x, x, x);
            } else {
                if(map.changed_by != MetaMap.User.userKey) {
                    this.canvas.map.load(map.data)
                }
            }
            NProgress.done()
        }

        this.build = (opts) => {
            if(opts.id != this.mapId) {
                this.canvas = null
                if(this.mapId) {
                    FrontEnd.MetaFire.off(`maps/data/${this.mapId}`)
                }
                this.mapId = opts.id
                NProgress.start()
                
                FrontEnd.MetaFire.on(`maps/data/${opts.id}`, this.buildCanvas);
                MetaMap.Eventer.forget('map',this.build);
            }    
        }

        MetaMap.Eventer.every('map', this.build)

        this.on('update', () => {
            $(this.diagram).css({
                height: window.innerHeight-154+'px'
            });
        });

        $(window).resize(() => {
            $(this.diagram).css({
                height: window.innerHeight-154+'px'
            });

        });

    </script>

</meta-canvas>