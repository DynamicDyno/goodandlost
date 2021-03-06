var zoomimageOpen = false;
if (!Modernizr.touch) {
  $(function() {
    $('.zoomimage').on('click', function(e) {
      $(this).parent().next('.zoomimage__modal').addClass('js-zoomimage__modal-open').show();
      zoomimageOpen = true;
      moveImage(e);
    });

    // when you mouseover a zoomimage, download the full version
    $('.zoomimage').on('mouseover', function(e) {
      var image = $(this).parent().next().children();
      if (!image.attr('src')) {
        image.attr('src', image.data('src'));
      }
    });

    $('.zoomimage__modal').on('click', function(e) {
      $(this).removeClass('js-zoomimage__modal-open').hide();
      zoomimageOpen = false;
    });

    function moveImage(e) {
      if(zoomimageOpen) {
        $window = $(window);
        $image = $('.js-zoomimage__modal-open > .zoomimage__full-image');
        var windowWidth = $window.width(),
            windowHeight = $window.height(),
            imageWidth = $image.width() + 200,
            imageHeight = $image.height() + 200,
            xRatio = (imageWidth - windowWidth) / windowWidth,
            yRatio = (imageHeight - windowHeight) / windowHeight,
            x = 0,
            y = 0;

        if ( imageWidth > windowWidth ) {
          x = -( e.pageX * xRatio);
          y = -( (e.pageY - $window.scrollTop()) * yRatio);
        } else {
          x = (windowWidth - imageWidth) / 2;
          y = (windowHeight - imageHeight) / 2;
        }

        $image.css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0px)');
      }
    }
    $(document).on('mousemove', function(e) {
      moveImage(e);
    });
  });
}
