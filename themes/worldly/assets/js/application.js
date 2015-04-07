// on mobile / touch devices, get rid of the fadeOut titles on image posts
if (Modernizr.touch)
  skrollr.init().destroy();
else
  var s = skrollr.init();

$(function() {
  // dropcaps
  // $('article > p:first-child').html(function (i, html) {
  //   return html.replace(/^[^a-zA-Z]*([a-zA-Z])/g, '<span class="dropcap">$1</span>');
  // });
  //
  // var dropcaps = document.querySelectorAll(".dropcap");
  // window.Dropcap.layout(dropcaps, 3);
});
