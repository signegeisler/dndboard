$(document).ready(function() {

  let started = false;
  $("#turn-button").click(function() {

       let next = $("#character-list li.active-player").next('li');
       console.log(next);
       if(next.length == 0){
        $("#character-list li.active-player").toggleClass('active-player');
        $("#character-list li").first().addClass('active-player');

       }else{
       $("#character-list li.active-player").toggleClass('active-player');
       next.toggleClass('active-player');
       }
    }
  );
  
  $('.color').click(function(){
    $('.color').each(function(){
      $(this).css('border', 'none');
    })
    $(this).css('border','3px solid black');
});

  let slider = document.getElementById("effect-size");
  let output = document.getElementById("effect-size-value");
  output.innerHTML = slider.value; // Display the default slider value
    
  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
    selectedEffectWidth = this.value;
  }

});
