<modal-dialog>
    <div if="{ opts }" class="modal fade" id="{ opts.id }">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-body container">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <p>One fine body&hellip;</p>
                </div>
            </div>
        </div>
    </div>
    <script type="es6">
        this.on('mount', () => {
            if(opts) {
                $(this.root.firstChild).modal();
            }
        });
    </script>
</modal-dialog>