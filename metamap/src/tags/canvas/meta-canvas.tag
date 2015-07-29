<meta-canvas>
    <div class="portlet light">
        <div class="portlet-body" id="diagram"></div>
    </div>
    <div id="overview-diagram" style="display: none;"></div>

    <script type="es6">

        MetaMap.Eventer.every('map', (opts) => {
            NProgress.start()
            var x = {
                mapId: opts.id,
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
            FrontEnd.MetaFire.getData(`maps/data/${opts.id}`).then((map)=>{
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

                window._mapEditorCtrl = MapEditorCtrl(x, x, x, x, x);
                
                NProgress.done()
            });
        })

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