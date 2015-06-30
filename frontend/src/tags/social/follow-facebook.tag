<follow-facebook>
    <div class="fb-follow" 
         data-href="https://www.facebook.com/{ data.title }" 
         data-layout="standard" 
         colorscheme="dark"
         data-show-faces="false"></div>

    <script>
        this.data = null
        this.on('mount', () => {
            if(opts) {
                this.data = opts
                this.update()
            }
        });
    </script>
</follow-facebook>
