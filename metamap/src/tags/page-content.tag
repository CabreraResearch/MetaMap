<page-content>

    <div class="page-content-wrapper">
        <div id="page-content" class="page-content">

            <div class="page-head">

            </div>

            <div id="app-container">

            </div>
        </div>
    </div>

    <script>


        MetaMap.Eventer.every('nav', (type, obj) => {
            let tag = ''
            switch(type) {
                case 'map':
                    tag = 'meta-canvas'
                    break;
            }

            if(tag) {
                $(this['app-container']).empty();
                riot.mount(this['app-container'], tag);
                MetaMap.Eventer.do(type, obj);
            }

        });

        this.on('update', () => {
            $(this['page-content']).css({height: window.innerHeight-154+'px'});
        });


    </script>

</page-content>