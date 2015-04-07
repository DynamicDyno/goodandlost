// on mobile / touch devices, get rid of the fadeOut titles on image posts
if (Modernizr.touch)
  skrollr.init().destroy();
else
  var s = skrollr.init();

$(function() {

});
