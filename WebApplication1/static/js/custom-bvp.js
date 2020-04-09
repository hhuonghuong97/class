$( document ).ready(function() {
 /* $(window).load(function(){'use strict';
    $(".pre-loader").fadeOut("slow");
    $('body').addClass('animated' + ' ' + 'fadeInDown');
  });
*/
// check box
/*
$(".item-check").each(function () {
  console.log('jkfhgfdg');
  if ($(this).find('input[type="checkbox"]').first().attr("checked")) {
    $(this).addClass('item-check-checked');
  }
  else {
    $(this).removeClass('item-check-checked');
  }
});


$(document.body).on(".item-check", "click", function (e) {
  $(this).toggleClass('item-check-checked');
  var $checkbox = $(this).find('input[type="checkbox"]');
  $checkbox.prop("checked",!$checkbox.prop("checked"))
  var checkbox = $(this).find('.checker');
  e.preventDefault();

  var this_checked = checkbox.is(':checked');
    var value_1 = checkbox.closest('.service-item').find('.price-number').text();
    var value_2 = checkbox.closest('.service-item .inner-package').find('.package-name').text();
    var id_item = checkbox.closest('.service-item .inner-package').attr('id');


  if (checkbox.prop('checked')==true){
    
   
    console.log('checked');
    var html_auto_field = "<div class='package-info'><p class='package-name' data-id='#" + id_item + "'>" + value_2 + "</p><p class='price-service-child'><span class='price-number-child'>" + value_1 + "</span>đ</p></div>";
    checkbox.closest('.modal-body').find('.list-list-result').append(html_auto_field);
    
  }
  if (checkbox.prop('checked')==false) {
    console.log('unchecked');
  }
});*/
$('.speaker-slider').owlCarousel({
  loop:true,
  margin:0,
  nav:true,
  dots: false,
   navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
  responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:4
      },
      1200:{
        items:6
      }
    }
})

$('.status-confirm').on('click', function(){
  $('body').append('<div class="modal-backdrop fade in"></div>');
});

// function popupGallery() {
//   if ($('.popupgallery').length) {
//       $('.quick-view').magnificPopup({
//           type: 'image',
//           closeOnContentClick: true,
//           image: {
//               verticalFit: true
//           },
//           gallery: {
//             // options for gallery
//             enabled: true
//           }
//       });
//   }
// }

// popupGallery();

$('.tab-title-item').click(function(){
  $('.tab-title-item').removeClass('active');
  $(this).addClass('active');
})
  

  $(".item-check").on("click", function (e) {
    $(this).toggleClass('item-check-checked');
    
    
  });



 $('.tab-title-yba').click(function (e) {
    e.preventDefault();
    var tab_id = $(this).attr('href');
    $('.tab-title-yba').removeClass('active');
    $('.tab-content-yba').removeClass('active');
    $(this).addClass('active');
    $(tab_id).fadeIn(400).siblings().hide();
});

 $('.continue-lesson  .lesson-item').click(function (e) {
    e.preventDefault();
    $('.continue-lesson  .lesson-item').removeClass('active');
    $(this).addClass('active');
});

$('.chan-doan-hinh-anh .filter-yba-item').click(function (e) {
  e.preventDefault();
  var tab_id = $(this).data('id');
  console.log(tab_id);
  $('.chan-doan-hinh-anh .filter-yba-item').removeClass('active');
  $('.chan-doan-hinh-anh .tab-child-yba').removeClass('active');
  $(this).addClass('active');
  $("#" + tab_id).fadeIn(400).siblings().hide();
});



  function height(){
    $('.row').each(function(){  
    
      // Cache the highest
      var highestBox = 0;
      
      // Select and loop the elements you want to equalise
      $('.news-item', this).each(function(){
        
        // If this box is higher than the cached highest then store it
        if($(this).height() > highestBox) {
          highestBox = $(this).height(); 
        }
      
      });  
       $('.news-item',this).height(highestBox);  
      // Set the height of all those children to whichever was highest 
     

      $('.content-conseling', this).each(function(){
        
        // If this box is higher than the cached highest then store it
        if($(this).height() > highestBox) {
          highestBox = $(this).height(); 
        }
      
      }); 
      $('.content-conseling',this).height(highestBox);   

      $('.exchange-item', this).each(function(){
        
        // If this box is higher than the cached highest then store it
        if($(this).height() > highestBox) {
          highestBox = $(this).height(); 
        }
      
      }); 
      $('.exchange-item',this).height(highestBox);    


      $('.news-title', this).each(function(){
        
        // If this box is higher than the cached highest then store it
        if($(this).height() > highestBox) {
          highestBox = $(this).height(); 
        }
      
      }); 
      $('.news-title',this).height(highestBox); 


      
      $('.album-item', this).each(function(){

        // If this box is higher than the cached highest then store it
        if($(this).height() > highestBox) {
          highestBox = $(this).height();
        }

      });
      $('.album-item',this).height(highestBox);
      

    });
  }

  if ($(window).width() >= 1200) {
    setTimeout(function(){ 
      height();
    }, 3000);
  }
      


$('.btn-creat').click(function(e){
  e.preventDefault();
  $('.form-register-yba').show();
  $('.action-yba').hide();
})


if ($('.filter-yba-slider').length) {
  $('.filter-yba-slider').owlCarousel({
    loop:true,
    autoplay: false,
    margin:0,
    nav:true,
    dots: false,
    autoHeight:true,
    navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    items: 1
  })
}
  
// select live search
  
    
  $('.live-search-list li').each(function(){
    $(this).attr('data-search-term', $(this).text().toLowerCase());
    });

    $('.live-search-box').on('keyup', function(){

    var searchTerm = $(this).val().toLowerCase();

        $('.live-search-list li').each(function(){

            if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
                $(this).show();
            } else {
                $(this).hide();
            }

        });

    });

    $(document.body).on('click', '.live-search li', function() {
      var name_doctor = $(this).find('.doctor-name').text();    
      $(this).closest('.live-search-wrap').find('.live-search-btn').html(name_doctor + ' <span class="caret"></span>');
    })

  })


  // jQuery(function(){
  //   var current = location.pathname;
  //   jQuery('.awemenu-item > a').each(function(){
  //       var path = window.location.pathname;
  //       path = path.replace(/\/$/, "");
  //       path = decodeURIComponent(path);
  //       var url = window.location.href;
  //       var href = jQuery(this).attr('href');
  //       console.log(path);
  //       var $this = jQuery(this);
  //       // if the current path is like this link, make it active
  //       if(((path == href) && (href != "")) || (path == "/")){
  //           $this.closest('li').addClass('awemenu-active-trail');
  //       }
  //   })
  // })

  $('.scrollup').click(function (){
    $("html,body").animate({
    scrollTop: 0
    }, 1000);
    return false;
  });



  function scroll_header() {
    $(window).scroll(function() {
      $('.menu-main').each(function() {
        var scrollTop_item = $(window).scrollTop(),
        vh = $(window).height(),
        $scroll = $(this),
        scrollEasing = $scroll.data('easing'),
        $scrollInner = $scroll.find('main-header'),
        scrollEasing = $scroll.data('css'),
        scrollOffsetTop = $scroll.offset().top
        if (scrollTop_item  > 95) {
            $scroll.addClass('fixed' + ' ' + 'bg-white' + ' '+ 'animated' + ' ' + 'fadeInDown');
            // $('.element-item').addClass('animated fadeInDown');
        }else {
            $scroll.removeClass('fixed' + ' '  + 'bg-white' + ' ' + 'animated' +  ' ' + 'fadeInDown');
        }
      });
    });
  }
   
  scroll_header();



  // slider 

  // $('.service-slider').owlCarousel({
  //   loop:true,
  //   autoplayTimeout:2000,
  //   autoplay: true,
  //   margin:30,
  //   nav:true,
  //   dots: false,
  //   navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
  //   responsive:{
  //     0:{
  //         items:1
  //     },
  //     600:{
  //         items:2
  //     },
  //     1000:{
  //         items:3
  //     }
  //   }
  // })

  /*$('.list-media').owlCarousel({
    loop:true,
    margin:20,
    nav:false,
    dots: true,
    navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:2
      }
    }
  })*/

  $('.news-slider').owlCarousel({
    loop:true,
    margin:20,
    nav:false,
    dots: true,
    navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
    responsive:{
      0:{
          items:1
      },
      600:{
          items:2
      },
      1000:{
          items:3
      }
    }
  })

  // $('.doctor-list-inner').owlCarousel({
  //   loop:true,
  //   margin:25,
  //   nav:true,
  //   navText: ["<i class='fa fa-angle-left'></i>","<i class='fa fa-angle-right'></i>"],
  //   responsive:{
  //     0:{
  //         items:1
  //     },
  //     600:{
  //         items:2
  //     },
  //     1000:{
  //         items:3
  //     },
  //     1200:{
  //         items:4
  //     }
  //   }
  // })

  // $('.banner').owlCarousel({
  //     loop:true,
  //     margin:0,
  //     nav:false,
  //     dots: false,
  //     autoplay: true,
  //     items: 1,
  //     autoplayHoverPause: true
  // })

 
  // $('.testimonial-carousel').owlCarousel({
  //     loop:true,
  //     margin:0,
  //     nav:false,
  //     dots: true,
  //     autoplay: true,
  //     items: 1
  // })

  /*$('.media-item').click(function(){
    $('.video-real').play();
  })*/
  // $('.media-item').each(function(ev) {
//     var real_video = $(this).find('.video-real');
//     $(this).on('click', function(ev) {
//
//       $(real_video)[0].src += "&autoplay=1";
//       ev.preventDefault();
//       $(this).addClass('open-video');
//     });
//
// })
  
  $(document.body).on('click', '.menu-mobile', function(e) {
    $('.menu-main').slideToggle('fast');
    e.preventDefault();
  })

  $(document.body).on('click', '.link-web-bar', function(e) {
    $('.link-web ul').slideToggle('fast');
    e.preventDefault();
  })
  //time-tn


    //like 

  $(".like-action").click(function(){

    $(this).toggleClass('like-active')
  });

  $('.header-search button').click(function(){
    $('.header-search').toggleClass('active-search');
  });

  // $('.lesson-slider').owlCarousel({
  //   loop:true,
  //   margin:60,
  //   nav:true,
  //   navText: ["<img src='../images/prev-slider-lesson.png'>","<img src='../images/next-slider-lesson.png'>"],
  //   responsive:{
  //     0:{
  //         items:1
  //     },
  //     600:{
  //         items:2
  //     },
  //     1000:{
  //         items:3
  //     },
  //     1200:{
  //         items:3
  //     }
  //   }
  // })

// menu

function aweMenu() {
    if ($('.business-top').length) {
        $('.business-top').aweMenu({
            trigger: 'hover',
            showArrow: true,
            hoverTime: 0,
            sticky: false,
            responsiveWidth: 1200,
            customMenuBar: '<i class="fa fa-bars"></i>',
            mobileType: 'outleft',
            mobileTrigger: 'toggle',
            customCloseButton: '<i class="fa fa-close"></i>',
            defaultDesktopAnimation: 'fadeup',
        });
    }
}

aweMenu();


  // if ($(window).width() > 1200) {
  //   $('.awemenu-item ').each(function(){
  //     var container = $(this).find('.awemenu-megamenu');
  //     var container_width = container.width()-40;
  //     var item_count = $(this).find('.megamenu-item').size();
  //
  //
  //
  //     var width_item = container.width()/item_count;
  //
  //     var data_value = 25 * item_count + '%';
  //     /*var data_width_container = container.data('width'); //getter
  //     container.data('width',data_value + '%'); //setter*/
  //     var num = +container.attr("data-width");
  //       num = data_value;
  //       container.attr('data-width', num);
  //
  //     if (item_count >= 5) {
  //        $(this).find('.megamenu-item').css("min-width", '265px');
  //     }else{
  //       $(this).find('.megamenu-item').css("width", width_item);
  //     }
  //     console.log(width_item);
  //   });
  // }


  // date time
  if ($('.date-bn').length) {
    $('.date-bn').datetimepicker({
      format: 'DD-MM-YYYY',
       allowInputToggle: true,
       debug: true
    });
  }
  if ($('.time-tn').length) {
    /*$('.time-tn').datetimepicker({
      format: 'hh:mm',
       allowInputToggle: true
    })*/
    $('.time-tn').datetimepicker({
      format: 'LT',
      allowInputToggle: true,
      debug: true
    }).on("dp.change",function(e){
        var date = e.date;//e.date is a moment object

        var target = $(e.target).attr('value');
        var current_time = date.format("HH:mm");
        console.log($('#time-kham-tn').attr('value', current_time));
        console.log(current_time)//get time by using format 


        var timeElements = $('#time-kham-tn').attr('value').split(":");    
        var theHour = parseInt(timeElements[0]);
        var theMintute = timeElements[1];
        var newHour = theHour + 1;
        $('#time-kham-tn').val(newHour + ":" + theMintute);
        console.log($('#time-kham-tn').val(newHour + ":" + theMintute));
    })
  }




  if ($('.date-kham').length) {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('.date-kham').datetimepicker({
      format: 'DD-MM-YYYY',
       minDate: today,
        allowInputToggle: true
    });
  }
  if ($('.date-birth').length) {
    var date = new Date();
    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    $('.date-birth').datetimepicker({
      format: 'DD-MM-YYYY',
       maxDate: today,
        allowInputToggle: true
    });
  }

    // show form dat kham

  $(document.body).on('click', '.dat-lich-kham', function(e) {
    console.log('fgjtyh');
    e.preventDefault();
    var tab_id = $(this).attr('href');
    $(tab_id).addClass('active');
    if ($(tab_id).hasClass('active')) {
      $('.form-dat-kham').removeClass('active');
      $(tab_id).addClass('active');
    }
  });

  // menu left
  $('.menu-left-main a').next('ul').parent('li').addClass('toggle-open');
  $('.menu-left-main a').click(function(ev){
      $(this).next('ul').parent('li').removeClass('toggle-open');
      $(this).next('ul').parent('li').toggleClass('toggle-close');
      $(this).next('ul').parent('li').addClass('toggle-open');
  
    $(this).parent('li').parent('ul').find("ul").hide(500);
    if($(this).attr('rel')!=0){
      $(this).parent('li').children("ul").slideToggle();$(this).attr('rel',0);
    }
    else{
          $(this).attr('rel',1);
        }
    return true;
  });

  function readURL(input){
    var reader = new FileReader();
    reader.onload = function(e){
      $('.preview-img').attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }



  $('.text-imge').change(function(){
    //var html_inner = "<div class='prev-image'><img id='images' class='preview-img' src='#' alt='your image'></div>";
    //$('.change-image').append(html_inner);
    readURL(this);
  });

   $(document.body).on('click', '.addcomment-btn', function(e) {
      e.preventDefault();
     $(this).closest('.comment-content').addClass('active-comment');
   });





  $('.price-number').each(function(){
    var price = 0;
    price = parseInt($(this).text());
    $(this).text(price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
  });

  $('.price-number-child').each(function(){
    var price1 = 0;
    price1 = parseInt($(this).text());
    $(this).text(price1.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
  });
  var total = 0;

  total = parseInt($('.total-service').text());

  $(".total-service").text(total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
