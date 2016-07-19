// // Sidebar Toggle Function
$("#toggle-sidebar").click(function(){
  $(this).closest('#wrapper').toggleClass("toggled");
  $(this).toggleClass("toggled");
});
$(document).ready(function() {
  $("time.timeago").timeago();
});
