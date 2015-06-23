<head riot-tag="page-head">

    <!-- Meta -->
    <meta charset="utf-8"/>
    <title>{ data.site.title }</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" name="viewport"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <link href="{ data.site.favico }" rel="shortcut icon" type="image/x-icon">

    <!-- Bootstrap -->
    <link href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <!-- custom css-->
    <link href="crlab/src/css/style.css" rel="stylesheet" type="text/css" media="screen">

    <!-- font awesome for icons -->
    <link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <!-- flex slider css -->
    <link href="//cdnjs.cloudflare.com/ajax/libs/flexslider/2.5.0/flexslider.min.css" rel="stylesheet" type="text/css" media="screen">
    <!-- animated css  -->
    <link href="crlab/src/css/animate.css" rel="stylesheet" type="text/css" media="screen"> 
    <!--Revolution slider css-->
    <link href="crlab/assets/rs-plugin/css/settings.css" rel="stylesheet" type="text/css" media="screen">
    <link href="crlab/src/css/rev-style.css" rel="stylesheet" type="text/css" media="screen">
    <!--google fonts-->
    <link href='//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
    <!--owl carousel css-->
    <link href="//cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.carousel.min.css" rel="stylesheet" type="text/css" media="screen">
    <link href="//cdnjs.cloudflare.com/ajax/libs/owl-carousel/1.3.3/owl.theme.min.css" rel="stylesheet" type="text/css" media="screen">
    <!--mega menu -->
    <link href="crlab/src/css/yamm.css" rel="stylesheet" type="text/css">
    <!--cube css-->
    <link href="crlab/assets/cubeportfolio/css/cubeportfolio.min.css" rel="stylesheet" type="text/css">
    
    
</head>
<script>
    this.data = CRLab.config
    this.on('mount', () => {
        this.data = CRLab.config
        this.update();    
    });
</script>
