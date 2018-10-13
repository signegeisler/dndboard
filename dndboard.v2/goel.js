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

  $('.color-elem').each(function(index, event){   
    this.addEventListener('click', function(){
    });
  });
    
});
