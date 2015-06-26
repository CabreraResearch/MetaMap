<modal-dialog>
    <div class="modal fade" id="{ _.kebabCase(data.title) }">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
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
        this.on('mount', () => {
            if(opts && opts.id) {
                
                FrontEnd.MetaFire.getData(`${FrontEnd.site}/explore/items/${opts.id}`).then( (data) => {
                
                    let type = data.type
                    console.log(type)
                    
                    this.update()
                    
                    opts.event = {}
                    opts.event.item = data
                    
                    riot.mount(this.modal_dialog_container, `${type}-dialog`, opts)
                
                    $(this.root.firstChild)
                        .modal()
                        .on('hidden.bs.modal', () => {
                            this.unmount(true);
                        });
                    
                });
            }
        });
    </script>
</modal-dialog>