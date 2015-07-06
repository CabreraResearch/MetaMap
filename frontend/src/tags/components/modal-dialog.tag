<modal-dialog>
    <section id="{ _.kebabCase(data.title) }" >

        <div class="divide50"></div>

        <div class="container">

            <div id="modal_dialog_container">

            </div>
        </div>
    </section>
    <script type="es6">
        this.mixin('config'); 
        this.url = this.pathImg()
        this.height = window.innerHeight - 75;
        this.on('mount', () => {
            if(opts && opts.id && opts.id != '#') {
                
                FrontEnd.MetaFire.getData(`${FrontEnd.site}/explore/items/${opts.id}`).then( (data) => {
                    let dialogClass = 'blog-dialog'
                    
                    if(opts.id == 'the-systems-thinking-manifesto-poster') {
                        data = data || {}
                        dialogClass = 'manifesto-dialog'
                    }
                    
                    if(data) {
                        
                        this.update()
                    
                        opts.event = {
                            item: data,
                            id: opts.id,
                            dialog: this.modal
                        }
                        
                        $('#main').hide()
                        
                        riot.mount(this.modal_dialog_container, dialogClass, opts)
                        
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