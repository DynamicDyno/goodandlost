// on mobile / touch devices, get rid of the fadeOut titles on image posts
if (Modernizr.touch)
  skrollr.init().destroy();
else
  var s = skrollr.init();

$(function() {
  // adjust hero height, in case vh units don't work
  function resizeHero() {
    $('.hero, .hero--about, .hero--post').height($(window).height());
  }
  resizeHero();
  $(window).on('resize', resizeHero);

  // scroll to content when hero down arrows are clicked
  $('.hero__read-more-arrows').on('click', function(e) {
    e.preventDefault();

    $('html, body').animate({
      scrollTop: $('.content').offset().top
    }, 500);
  });
});
