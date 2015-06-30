<follow-twitter>
    <li >
        <a href="https://twitter.com/{ data.title }"
           class="twitter-follow-button"
           data-show-count="true">Follow @{ data.title }</a>
    </li>

    <script>
        this.data = null
        this.on('mount', () => {
            if(opts) {
                this.data = opts
                this.update()
                twttr.widgets.load()
            }
        });
    </script>
</follow-twitter>
