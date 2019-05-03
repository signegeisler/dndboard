$(document).ready(function () {

  let 
  blues = [ '#27272B','#3E3D46','#313136','#232328','#1A1922',
            '#021023', '#020D1B', '#05172E', '#03234B', '#07346E',
            '#103B73', '#386195', '#1D4D8B', '#072E5F', '#032146',
            '#157CFF', '#ABD0FF', '#7CB5FF', '#003E8E', '#00306E',
            '#574F78','#9A96AD','#746E90','#40385F','#2B224F'],
   
  reds = [
            '#660003','#400103','#4E0002','#9A0004',
            '#350001','#290001','#450304','#720003',
            '#FFA4A6','#FF7074','#A50004',
            '#AD6D6B','#FBD5D4','#D09998','#8A4B4A','#722B29',
            '#513444','#866577','#704C60','#4E223B','#461431'],
  greens = [
            '#002020','#001919','#022A2A','#004545','#006565',
            '#003E3E','#012727','#002F2F','#005D5D','#007F7F',
            '#042C00','#032200','#073902','#095E00','#0D8A00',
              '#085400','#063501','#064100','#0C7F00','#0D8900',
              '#568B56','#AAC9AA','#7AA67A','#3B6F3B','#215C21'],

  yellows = ['#363600','#2A2A00','#464603','#737300','#A8A800',
               '#676700','#414102','#4F4F00','#9B9B00',
               '#FFFFA4','#FFFF70','#A7A700','#87673a',
              '#ADAD6B','#FBFBD4','#D0D098','#8A8A4A','#727229',
            '#383029','#867567','#60544A','#34281E','#2F2115',
          '#272622','#817555','#585243','#403A2B','#564A29'];

  let colors = [blues, greens, reds, yellows];

  let colorHolderMap = document.getElementById("color-grid-menu");
  let colorHolderPlayer = document.getElementById('color-player-grid');
  let colorHolderEffect = document.getElementById('color-effect-menu');

  let colorMenus = [colorHolderMap, colorHolderPlayer, colorHolderEffect];
  let colorFunctions = ['Tile', 'Occupant', 'Effect'];

  for(let i=0; i<colorMenus.length; i++){
    populateWithColors(colorMenus[i], colorFunctions[i]);
  }
 
 

  function populateWithColors(menu, colorFunction) {
    

    for (let i = 0; i < colors.length; i++) {
      for (let j = 0; j < colors[i].length; j++) {
        let div = document.createElement('div');
        div.classList.add('color-elem');
        switch(colorFunction){
          case "Tile":
                div.innerHTML += `<div class="color" style="background: ${colors[i][j]};" onClick="selectTileColor('${colors[i][j]}')"> </div>`;
                break;
          case "Occupant":
                div.innerHTML += `<div class="color" style="background: ${colors[i][j]};" onClick="selectOccupantColor('${colors[i][j]}')"> </div>`;
                break;
          case "Effect":
                div.innerHTML += `<div class="color" style="background: ${colors[i][j]};" onClick="selectEffectColor('${colors[i][j]}')"> </div>`;
                break;
              }
        
        menu.appendChild(div);
      }
    }
  }

  $("#turn-button").click(function () {

    let next = $("#character-list li.active-player").next('li');
    console.log(next);
    if (next.length == 0) {
      $("#character-list li.active-player").toggleClass('active-player');
      $("#character-list li").first().addClass('active-player');

    } else {
      $("#character-list li.active-player").toggleClass('active-player');
      next.toggleClass('active-player');
    }
  }
  );

  $('.color').click(function () {
    $('.color').each(function () {
      $(this).css('border', 'none');
    })
    $(this).css('border', '3px solid black');
  });

  let slider = document.getElementById("effect-size");
  let output = document.getElementById("effect-size-value");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    output.innerHTML = this.value;
    selectedEffectWidth = this.value;
  }

  var radios = $('input[name="occupant-type"]');

  radios.change(function(){
    if(this.value =="enemy"){
      isHero = false;
    }else if(this.value=="hero"){
      isHero = true;
    }
  })
  

});
