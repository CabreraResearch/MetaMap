<modal-dialog>
    <div  class="modal fade" 
         id="{ _.kebabCase(data.title) }" 
         >
        <div class="modal-dialog modal-lg">
            <div id="modal" class="modal-content" style="height: { height }px; position: fixed; width: 100%;" >
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <section id="modal_dialog_container">

                    </section>
                </div>
            </div>
        </div>
    </div>
    <script type="es6">
        this.mixin('config'); 
        this.url = this.pathImg()
        this.height = window.innerHeight - 75;
        this.on('mount', () => {
            if(opts && opts.id && opts.id != '#') {
                
                FrontEnd.MetaFire.getData(`${FrontEnd.site}/explore/items/${opts.id}`).then( (data) => {
                
                    if(data && data.type) {
                        let type = data.type
                        
                        this.update()
                    
                        opts.event = {
                            item: data,
                            id: opts.id,
                            dialog: this.modal
                        }
                        
                        riot.mount(this.modal_dialog_container, `blog-dialog`, opts)
                        
                        Ps.initialize(this.modal)
                        
                        $(this.root.firstChild)
                            .modal()
                            .on('hidden.bs.modal', () => {
                                this.unmount(true);
                                switch(type) {
                                    case 'html':
                                    case 'store':
                                       FrontEnd.Router.to('home')
                                       break;
                                    default:
                                        FrontEnd.Router.to('explore')
                                        break;
                                }
                            });
                    }
                });
            }
        });
    </script>
</modal-dialog>