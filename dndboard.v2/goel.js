$(document).ready(function() {
  $("#turn-button").click(function() {
    $("#character-list li").first().addClass('active-player');
  });
});
