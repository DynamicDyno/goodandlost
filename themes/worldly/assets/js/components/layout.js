function pin_right_column() {
  $('.right-column').pin({
    padding: { top: 80 },
    minWidth: 989,
    containerSelector: '.columns'
  });
}

$(function() {
  $(window).on('resize', pin_right_column);
  pin_right_column();
});
