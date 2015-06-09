<page-message>
    <div class="container">
        <div class="row">
            <div class="col-sm-12 ">
                <div class="center-heading">
                    <h2>{ header.title }</h2>
                    <span class="center-line"></span>
                    <p>{ header.text }</p>
                </div>
            </div>
        </div>
        <div class="row special-feature">
            <div each="{ items }" class="col-md-4 col-sm-4 margin10">
                <div class="s-feature-box text-center wow animated fadeIn" 
                     data-wow-duration="700ms" 
                     data-wow-delay="200ms">
                    <div class="mask-top">
                        <!-- Icon -->
                        <i class="{ icon }"></i>
                        <!-- Title -->
                        <h4>{ title }</h4>
                    </div>
                    <div class="mask-bottom">
                        <!-- Icon -->
                        <i class="{ icon }"></i>
                        <!-- Title -->
                        <h4>{ title }</h4>
                        <!-- Text -->
                        <p>{ text }</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script type="es6">
        this.header = {}
        this.items = []
        CRLab.MetaFire.getData('crlab/message').then( (data) => {
            this.header = data.header
            this.items = data.items
            this.update()
        })
    </script>
</page-message>