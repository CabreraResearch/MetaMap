<meta-dialog>

    <div class="modal fade" id="full" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-full">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                    <h4 class="modal-title">Maps</h4>
                </div>
                <div class="modal-body">
                    <meta-table></meta-table>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn default" data-dismiss="modal">Close</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>
        <!-- /.modal-dialog -->
    </div>
    
    <script type="es6">
        
        this.on('update', () => {
            $(this.full).modal();
        
        });
        
        
    </script>
    
</meta-dialog>