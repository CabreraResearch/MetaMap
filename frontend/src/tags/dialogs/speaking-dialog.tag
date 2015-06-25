<speaking-dialog>
    <div if="opts" class="row">
        <div class="col-sm-12 ">
            <div class="center-heading">
                <h2>{ data.title }</h2>
                <span class="center-line"></span>
                <p>
                    <raw content="{ data.text }"/>
                </p>
                <a each="{ val, i in data.buttons }"
                   role="button" 
                   data-link="{ val.link }"
                   class="btn btn-lg btn-theme-dark" 
                   style="margin-right: 10px;">
                    { val.title }
                </a>
            </div>
            
        </div>
    </div>
    <script type="es6">
        this.on('mount', () => {
            if(opts) {
                this.data = opts.event.item
                this.update()
            }
        });
    </script>
</speaking-dialog>