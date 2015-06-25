<page-explore>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <div class="center-heading">
                    <h2>
                        <strong>{ header.title }</strong>
                    </h2>
                    <span class="center-line"></span>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="cube-masonry">

            <div id="filters_container" 
                 class="cbp-l-filters-alignCenter">
                <div each="{ val, i in filters }"
                     data-filter=".{ val.tag }"
                     class="cbp-filter-item { 'cbp-filter-item-active': i == 0 }">
                    { val.name } <div class="cbp-filter-counter"></div>
                </div>
            </div>

            <div id="masonry_container" class="cbp">
                <div onclick="{ parent.onClick }" each="{ content }" class="cbp-item { type } { _.keys(tags).join(' ') }">
                    <div class="cbp-caption" 
                         data-title="{ text }" href="{ link || parent.url + type + '/' + img }">
                        <div class="cbp-caption-defaultWrap">
                            <img if="{ img }" src="{ parent.url + type + '/' + img }" alt="{ title }"/>
                        </div>
                        <div class="cbp-caption-activeWrap">
                            <div class="cbp-l-caption-alignCenter">
                                <div class="cbp-l-caption-body">
                                    <div if="{ title }"
                                         class="{ 'cbp-l-caption-title': true }"
                                       >{ title }</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
        <!--.cube masonry-->
    </div>
    <div class="divide50"></div>
    <div class="text-center">
        <a href="masonry-portfolio-4.html" class="btn btn-theme-dark btn-lg">Explore All</a>
    </div>
    
    <script type="es6">
        this.mixin('config');
        this.url = this.pathImg();
        
        this.onClick = (e) => {
            riot.mount('modal-dialog', { event: e, tag: this })
        }
        
        FrontEnd.MetaFire.getData(FrontEnd.site + '/explore').then( (data) => {
            this.filters = _.sortBy(data.filters, 'order');
            this.header = data.header;
            this.items = data.items;
            FrontEnd.MetaFire.getData(FrontEnd.site + '/content').then( (data) => {
                this.content = _.sortBy(_.toArray(data), 'order');
                this.content = _.union( this.content, this.items );
                this.content = _.filter( this.content, (item) => { return !(item.archived === true) } );
                this.update();
                $(this.masonry_container).cubeportfolio({
                    filters: '#filters_container',
                    layoutMode: 'grid',
                    defaultFilter: '.featured',
                    animationType: 'flipOutDelay',
                    gapHorizontal: 20,
                    gapVertical: 20,
                    gridAdjustment: 'responsive',
                    mediaQueries: [
                        {
                            width: 1100,
                            cols: 4
                        }, {
                            width: 800,
                            cols: 3
                        }, {
                            width: 500,
                            cols: 2
                        }, {
                            width: 320,
                            cols: 1
                        }
                    ],
                    caption: 'overlayBottomAlong',
                    displayType: 'bottomToTop',
                    displayTypeSpeed: 100,

                    // lightbox
                    //lightboxDelegate: '.cbp-lightbox',
                    //lightboxGallery: true,
                    //lightboxTitleSrc: 'data-title',
                    //lightboxCounter: '<div class="cbp-popup-lightbox-counter">{{current}} of {{total}}</div>',
                });
            })
        })
    </script>
    
</page-explore>