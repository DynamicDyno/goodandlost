function pin_right_column() {
  $('.right-column').pin({
    padding: { top: 40 },
    minWidth: 989,
    containerSelector: '.content'
  });
}

$(function() {
  $(window).on('resize', pin_right_column);
  pin_right_column();
});
