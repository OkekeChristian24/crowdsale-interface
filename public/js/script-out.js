(function(window, document) {

    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    $(window).on('load', function() {
        var $preloader = $('#preloader');
        $preloader.fadeOut('slow');
    });

    var owl = $('.owl-carousel');
    owl.owlCarousel({
        items: 1,
        loop: true,
        // margin:10,
        animateOut: 'fadeOut',
        autoplay: true,
        autoplayTimeout: 6000,
        autoplayHoverPause: false,
        mouseDrag: false,
        touchDrag: false
    });
    $(document).ready(function() {
        owl.trigger('play.owl.autoplay', 6000)
        // owl.trigger('play.owl.autoplay',[5000])
    })

    var accord = $('.accordion');
    var i;

    for (i = 0; i < accord.length; i++) {
        accord[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        });
    }

    //animate shows
    AOS.init({
        easing: 'ease-in-ease',
        anchorplacement: 'top-bottom',
        duration: 800,
        // offset: 100,
        once: true,
    });

    window.onscroll = function() {
        scrollFunction()
    };


    // CARDS START
    var raruty = 'earth';
    var element = 'common';
    var src_1 = 'image/cards/card_';
    var src_2 = '_';
    var src_3 = '.gif';

    $("#water").click(function() {
        if (element == 'legendary') {
            element = 'common';
            $('#water').removeClass('disabled');
            $('#earth').removeClass('disabled');
            $('#air').removeClass('disabled');
            $('#common').removeClass('disabled');
            $('#rare').removeClass('disabled');
            $('#epic').removeClass('disabled');
        }

        raruty = 'water';
        id_element = '#' + element;

        $('#water').addClass('active-btn');
        $(id_element).addClass('active-btn');

        $('#earth').removeClass('active-btn');
        $('#air').removeClass('active-btn');
        $('#pink').removeClass('active-btn');
        $('#orange').removeClass('active-btn');

        $('#orange').addClass('disabled');

        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });
    $("#earth").click(function() {
        if (element == 'legendary') {
            element = 'common';
            $('#water').removeClass('disabled');
            $('#earth').removeClass('disabled');
            $('#air').removeClass('disabled');
            $('#common').removeClass('disabled');
            $('#rare').removeClass('disabled');
            $('#epic').removeClass('disabled');
        }

        raruty = 'earth';
        id_element = '#' + element;

        $('#earth').addClass('active-btn');
        $(id_element).addClass('active-btn');

        $('#water').removeClass('active-btn');
        $('#air').removeClass('active-btn');
        $('#pink').removeClass('active-btn');
        $('#orange').removeClass('active-btn');

        $('#orange').addClass('disabled');

        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });
    $("#air").click(function() {
        if (element == 'legendary') {
            element = 'common';
            $('#water').removeClass('disabled');
            $('#earth').removeClass('disabled');
            $('#air').removeClass('disabled');
            $('#common').removeClass('disabled');
            $('#rare').removeClass('disabled');
            $('#epic').removeClass('disabled');
        }

        raruty = 'air';
        id_element = '#' + element;

        $('#air').addClass('active-btn');
        $(id_element).addClass('active-btn');

        $('#water').removeClass('active-btn');
        $('#earth').removeClass('active-btn');
        $('#pink').removeClass('active-btn');
        $('#orange').removeClass('active-btn');

        $('#orange').addClass('disabled');

        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });
    $("#pink").click(function() {
        raruty = 'fire';
        element = 'legendary';

        $('#pink').addClass('active-btn');
        $('#orange').addClass('active-btn');

        $('#water').removeClass('active-btn');
        $('#earth').removeClass('active-btn');
        $('#air').removeClass('active-btn');

        $('#common').removeClass('active-btn');
        $('#rare').removeClass('active-btn');
        $('#epic').removeClass('active-btn');

        $('#orange').removeClass('disabled');
        $('#common').addClass('disabled');
        $('#rare').addClass('disabled');
        $('#epic').addClass('disabled');

        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });


    $("#common").click(function() {
        id_raruty = '#' + raruty;
        element = 'common';

        $(id_raruty).addClass('active-btn');
        $('#common').addClass('active-btn');

        $('#rare').removeClass('active-btn');
        $('#epic').removeClass('active-btn');
        $('#orange').removeClass('active-btn');

        // $('#orange').addClass('disabled');

        // $('#orange').addClass('disabled');

        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });
    $("#rare").click(function() {
        id_raruty = '#' + raruty;
        element = 'rare';

        $(id_raruty).addClass('active-btn');
        $('#rare').addClass('active-btn');

        $('#common').removeClass('active-btn');
        $('#epic').removeClass('active-btn');
        $('#orange').removeClass('active-btn');

        // $('#orange').addClass('disabled');
        // $('#orange').addClass('disabled');

        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });
    $("#epic").click(function() {
        id_raruty = '#' + raruty;
        element = 'epic';

        $(id_raruty).addClass('active-btn');
        $('#epic').addClass('active-btn');

        $('#common').removeClass('active-btn');
        $('#rare').removeClass('active-btn');
        $('#orange').removeClass('active-btn');

        // $('#orange').addClass('disabled');
        // $('#orange').addClass('disabled');


        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });
    $("#orange").click(function() {
        raruty = 'fire';
        element = 'legendary';

        $('#pink').addClass('active-btn');
        $('#orange').removeClass('disabled');
        $('#orange').addClass('active-btn');

        $('#common').removeClass('active-btn');
        $('#rare').removeClass('active-btn');
        $('#epic').removeClass('active-btn');

        $('#common').addClass('disabled');
        $('#rare').addClass('disabled');
        $('#epic').addClass('disabled');

        $('#earth').removeClass('active-btn');
        $('#water').removeClass('active-btn');
        $('#air').removeClass('active-btn');


        src_final = src_1 + raruty + src_2 + element + src_3;
        $("#choosen_card").attr("src", src_final);
    });

})(window, document);

function scrollFunction() {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
        $('#size').addClass('size-index-scroll');
        $('#index_nav').addClass('navbar-index-scroll');
    } else {
        $('#size').removeClass('size-index-scroll');
        $('#index_nav').removeClass('navbar-index-scroll');
    }
}

function changeLogo() {
    setTimeout(function() {
        $('#left_battle_logo').css('background', 'url(/image/logo-co/meebits.png)');
        $('#right_battle_logo').css('background', 'url(/image/logo-co/logo-cools-cats.jpeg)');
    }, 2000);
    setTimeout(function() {
        $('#left_battle_logo').css('background', 'url(/image/logo-co/bayc.png)');
        $('#right_battle_logo').css('background', 'url(/image/logo-co/logo-crypto-kitties.svg)');
    }, 4000);
    setTimeout(function() {
        $('#left_battle_logo').css('background', 'url(/image/logo-co/logo-punk.png)');
        $('#right_battle_logo').css('background', 'url(/image/logo-co/meebits.png)');
    }, 6000);
    setTimeout(function() {
        $('#left_battle_logo').css('background', 'url(/image/logo-co/logo-cools-cats.jpeg)');
        $('#right_battle_logo').css('background', 'url(/image/logo-co/bayc.png)');
    }, 8000);
    setTimeout(function() {
        $('#left_battle_logo').css('background', 'url(/image/logo-co/logo-crypto-kitties.svg)');
        $('#right_battle_logo').css('background', 'url(/image/logo-co/logo-punk.png)');
    }, 10000);
    setTimeout(function() {
        $('#left_battle_logo').css('background', 'url(/image/logo-co/logo-polymorphs.jpg)');
        $('#right_battle_logo').css('background', 'url(/image/logo-co/bayc.png)');
    }, 12000);
    setTimeout(function() {
        $('#left_battle_logo').css('background', 'url(/image/logo-co/logo-punk.png)');
        $('#right_battle_logo').css('background', 'url(/image/logo-co/hashmasks.png)');
        changeLogo();
    }, 14000);
}

function changeNewsSize() {
    if ($(window).width() <= 428) {
        for (var i = 0, len = carousel.length; i < len; i++) {
            new Splide(carousel[i], {
                classes: {
                    arrows: 'splide__arrows your-class-arrows',
                    arrow: 'splide__arrow your-class-arrow',
                    prev: 'splide__arrow--prev new-class-prev',
                    next: 'splide__arrow--next new-class-next',
                },
                type: 'loop',
                perPage: 1,
                perMove: 1,
                focus: 'center',
                pagination: false,
                trimSpace: false,
                easing: 'linear',
                speed: 600,
                height: 500,
                arrows: false,
                // autoHeight: true,
                padding: {
                    left: 0,
                    right: 0,
                }
            }).mount();
        }
    } else {
        for (var i = 0, len = carousel.length; i < len; i++) {
            new Splide(carousel[i], {
                classes: {
                    arrows: 'splide__arrows your-class-arrows',
                    arrow: 'splide__arrow your-class-arrow',
                    prev: 'splide__arrow--prev new-class-prev',
                    next: 'splide__arrow--next new-class-next',
                },
                type: 'loop',
                perPage: 3,
                perMove: 1,
                focus: 'center',
                pagination: false,
                trimSpace: false,
                easing: 'linear',
                speed: 600,
                height: 460,
                arrows: false,
                // autoHeight: true,
                padding: {
                    left: 50,
                    right: 50,
                },
            }).mount();
        }
    }
}