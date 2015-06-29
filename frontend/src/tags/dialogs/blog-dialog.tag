<blog-dialog>
    <div if="opts" class="row">
        <div class="col-sm-12 ">
            <div class="center-heading">
                <h2>{ data.title }</h2>
                <span class="center-line"></span>
                <p>
                    <raw content="{ data.text }"/>
                </p>
            </div>
            <div if="{ blog }">
                <raw content="{ blog }"/>
            </div>
            <a each="{ val, i in data.buttons }"
                role="button" 
                data-link="{ val.link }"
                class="btn btn-lg btn-theme-dark" 
                style="margin-right: 10px;">
                { val.title }
            </a>
        </div>
    </div>
    <script type="es6">
        this.on('mount', () => {
            if(opts && opts.event.id) {
                this.data = opts.event.item
                this.update()
                let ref = FrontEnd.MetaFire.getChild(`${FrontEnd.site}/content/${opts.event.id}`)
                let firepad = new Firepad.Headless(ref);
                firepad.getHtml( (html) => {
                    this.blog = html;
                    this.update();
                    Ps.update(opts.event.dialog)
                });
            }
        });
    </script>
</blog-dialog>