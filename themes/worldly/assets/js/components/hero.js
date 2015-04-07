$(function() {
  // adjust hero height, in case vh units don't work
  $('.hero, .hero--post').height($(window).height());

  // scroll to content when hero down arrows are clicked
  $('.hero__read-more-arrows').on('click', function(e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $('.content').offset().top
    }, 500);
  });
});
