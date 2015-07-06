<manifesto-dialog>
    <div class="row">
        <div class="col-sm-12 ">
            <div class="center-heading">
                <h2>{ data.title }</h2>
                <span class="center-line"></span>
                <p>
                    <raw content="{ data.text }"/>
                </p>
                <img src="https://c68f7981a8bbe926a1e0154cbfbd5af1b4df0f21.googledrive.com/host/0B6GAN4gX1bnSflRndTRJeFZ5NEszSEFlSzVKZDZJSzFxeDdicFpoLXVwSDNFRWN0RFhfS2c/crlab/site/manifesto_poster_no_diagram.png" alt="Systems Thinking Manifesto" class="img-responsive"></img>
            </div>
            <div if="{ blog }" class="row">
                <div class="col-sm-12 ">
                    <div >
                        <raw content="{ blog }"/>
                    </div>
                    <buttons buttons="{ data.buttons }"></buttons>
                </div>
            </div>
            <buttons if="{ !blog }" buttons="{ data.buttons }"></buttons>
        </div>
    </div>
    <script type="es6">
        this.on('mount', () => {
            if(opts && opts.event.id) {
                this.data = opts.event.item
                
                this.margin = (window.innerWidth - $('#modal').width()) + 220
                this.url = window.location.href
                
                this.update()
                FrontEnd.MetaFire.getData(`${FrontEnd.site}/social`).then( (social) => {
                    this.social = social
                });
                
                let ref = FrontEnd.MetaFire.getChild(`${FrontEnd.site}/content/systems-thinking-manifesto`)
                let firepad = new Firepad.Headless(ref);
                firepad.getHtml( (html) => {
                    this.blog = html;
                    this.update();
                    Ps.update(opts.event.dialog)
                });
            }
        });
        let ignore = false
        this.on('update', () => {
            if(!ignore && $('#modal').width() > 100) {
                this.margin = (window.innerWidth - $('#modal').width()) + 220
                this.update()
                FrontEnd.initSocial()
                gapi.plusone.render('gplusone')
                ignore = true
            } else {
                ignore = false
            }
        });
    </script>
</manifesto-dialog>