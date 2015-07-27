<page-content>

    <div class="page-content-wrapper">
        <div id="page-content" class="page-content">
            
            <div class="page-head">
               
            </div>

            <div id="app-container">

                <div id="diagram" style="position:absolute; background-color: white; height: 100%; width: 85%; "></div>

                <div id="overview-diagram" style="display: none;"></div>


            </div>
        </div>
    </div>

    <script>
        
        this.on('update', () => {
            $(this['page-content']).css({height: window.innerHeight-154+'px'});
        });
        
        
    </script>

</page-content>