/*Theme    : assan
 * Author  : Design_mylife
 * Version : V1.4
 * 
 */

$(window).resize(function () {
    $(".navbar-collapse").css({ maxHeight: $(window).height() - $(".navbar-header").height() + "px" });
});
//sticky header on scroll
$(document).ready(function () {
    $(window).load(function () {
        $(".sticky").sticky({ topSpacing: 0 });
    });


    /* ==============================================
     WOW plugin triggers animate.css on scroll
     =============================================== */
    var wow = new WOW(
            {
                boxClass: 'wow', // animated element css class (default is wow)
                animateClass: 'animated', // animation css class (default is animated)
                offset: 100, // distance to the element when triggering the animation (default is 0)
                mobile: false        // trigger animations on mobile devices (true is default)
            }
    );
    wow.init();


    //parallax
    $(window).stellar({
        horizontalScrolling: false,
        responsive: true/*,
         scrollProperty: 'scroll',
         parallaxElements: false,
         horizontalScrolling: false,
         horizontalOffset: 0,
         verticalOffset: 0*/
    });

    //owl carousel for work

    $("#work-carousel").owlCarousel({
        // Most important owl features
        items: 4,
        itemsCustom: false,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [980, 3],
        itemsTablet: [768, 3],
        itemsTabletSmall: false,
        itemsMobile: [479, 1],
        singleItem: false,
        startDragging: true,
        autoPlay: 6000
    });



    //owl carousel for news

    




    //owl carousel for testimonials

    $("#testi-carousel").owlCarousel({
        // Most important owl features
        items: 1,
        itemsCustom: false,
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [980, 1],
        itemsTablet: [768, 1],
        itemsTabletSmall: false,
        itemsMobile: [479, 1],
        singleItem: false,
        startDragging: true,
        autoPlay: 4000
    });

    //featured work carousel slider


    $("#featured-work").owlCarousel({
        autoPlay: 5000, //Set AutoPlay to 3 seconds
        navigation: true,
        navigationText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
        pagination: false,
        items: 4,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [979, 3],
        stopOnHover: true

    });

    /* ==============================================
     Counter Up
     =============================================== */
    $('.counter').counterUp({
        delay: 100,
        time: 800
    });







    //MAGNIFIC POPUP
    $('.show-image').magnificPopup({ type: 'image' });

    /* ==============================================
     flex slider
     =============================================== */

    $('.main-flex-slider,.testi-slide').flexslider({
        slideshowSpeed: 5000,
        directionNav: false,
        animation: "fade"
    });
    //OWL CAROUSEL
    $("#clients-slider").owlCarousel({
        autoPlay: 3000,
        pagination: false,
        items: 4,
        itemsDesktop: [1199, 3],
        itemsDesktopSmall: [991, 2]
    });


    /*========tooltip and popovers====*/
    $("[data-toggle=popover]").popover();

    $("[data-toggle=tooltip]").tooltip();



    /* ==============================================
     mb.YTPlayer
     =============================================== */
    jQuery(function () {
        jQuery(".player").mb_YTPlayer();
    });


    //transparent header

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.transparent-header').css("background", "#252525");
        } else {
            $('.transparent-header').css("background", "transparent");
        }
    });
});



