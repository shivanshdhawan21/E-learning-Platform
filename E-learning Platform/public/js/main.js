jQuery(document).ready(function( $ ) {

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Real view height for mobile devices
  if (window.matchMedia("(max-width: 767px)").matches) {
    $('#intro').css({ height: $(window).height() });
  }

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
  });

});

////////////////////////////////////////////////////////////////////////////////

// TEST ISTRUCTOR LOGIN BUTTON: POST users/login AND STORE TOKEN (in memory)

// const baseURL = 'http://localhost:3000'
// var token;
// var testIstructorBtn = document.getElementById('testIstructor-btn');
// var resPara = document.getElementById('res-test-login');
//
// testIstructorBtn.addEventListener('click', function(ev) {
//   var url = `${baseURL}/users/login`
//   // var data = {email: 'instructor@test.com', password: '1234'}
//   var options = {
//     method: 'POST',
//     headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//     // body: JSON.stringify(data)
//     body: 'email=instructor@test.com&password=1234'
//   }
//   fetch(url, options).then(function(response) {
//     // token = response.headers.get('x-auth-token'); // if token was in the header. BUT IT IS IN THE BODY
//     resPara.innerHTML = response.status + ' ' + response.statusText;
//     if (response.status == 200) {
//       testIstructorBtn.innerHTML = "Logged in as test user";
//       testIstructorBtn.style.backgroundColor = 'darkgreen';
//     }
//     console.log(response);
//     return response.text();
//   }).then(function(responseText) {
//     token = responseText;
//   }).catch((err) => {
//     console.log('There was an error you your login. Please try again.')
//     testIstructorBtn.innerHTML = "Error. Please try again.";
//     testIstructorBtn.style.backgroundColor = 'orange';
//   });
//
// });
