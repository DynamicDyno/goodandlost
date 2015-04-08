$(function() {
  $('.header__hamburger').on('click', function() {
    $('body').addClass('header__menu-open');
  });

  $('.header__nav-close').on('click', function() {
    $('body').removeClass('header__menu-open');
  });

  $(document).mouseup(function (e) {
    var container = $('.header__nav-links');

    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $('body').removeClass('header__menu-open');
    }
  });
});
