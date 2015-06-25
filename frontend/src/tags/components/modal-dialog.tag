<modal-dialog>
    <div if="{ opts }" class="modal fade" id="{ opts.id }">
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
            if(opts) {
                
                let type = opts.event.item.type
                console.log(type)
                riot.mount(this.modal_dialog_container, `${type}-dialog`, opts)
                
                $(this.root.firstChild).modal();
            }
        });
    </script>
</modal-dialog>