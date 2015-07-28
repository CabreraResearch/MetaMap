<meta-canvas>
    <div id="diagram" style="position:absolute; background-color: white; height: 100%; width: 85%; "></div>

    <div id="overview-diagram" style="display: none;"></div>

    <script type="es6">

        MetaMap.Eventer.every('map', (opts) => {
            debugger;
            var x = {
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

                $('#full').modal('toggle');
                
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
            });
        })

        this.on('update', ()=>{
            
        });

        var foo = ''

    </script>

</meta-canvas>