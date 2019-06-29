let worldGrid;
let worldDimenScale = 1.6;
let worldGridDimenY = 20; // how many tiles down in world grid
let worldGridDimenX = Math.floor(worldGridDimenY * worldDimenScale);
let worldPixDimenY = 900;
let worldPixDimenX = worldPixDimenY * worldDimenScale;
let viewGrid;
let selectedTileColor;
let selectedOccupantColor;
let selectedEffectColor;
let selectedEffectShape;
let selectedEffectWidth; //need to be instantiated
let mapMakingMode = true;
let playPlaceMode = false;
let effectMode = false;
let worldGridCoordinateI;
let worldGridCoordinateJ;
let cellWidth;
let enemies;
let hoveringOccupant;
let activeEffects;
let hoveringEffect;
let isHero;
let heroes;
let data;
let loadedMap;
let loadedEffects;
let socket;
let isMaster;
let letterForNewOccupant;
let canWrite;

function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

function toggleMode(mode) {
  if (mode == 'mapmk') {
    mapMakingMode = true;
    playPlaceMode = false;
    effectMode = false;
  } else if (mode == 'play') {
    mapMakingMode = false;
    playPlaceMode = true;
    effectMode = false;
  } else {
    mapMakingMode = false;
    playPlaceMode = false;
    effectMode = true;
  }
}

function saveMyGrid() {
  let blob = ([{ grid: worldGrid }, { effects: activeEffects }]);
  save(blob, "DND-map.json");
}

function loadMyGrid() {
  var input,file, fr;



  input = document.getElementById('fileinput');
  file = input.files[0];
  fr = new FileReader();
  fr.onload = receivedText;
  fr.readAsText(file);
}

function receivedText(e) {
  let lines = e.target.result;
  data = JSON.parse(lines);

  loadedMap = data[0].grid;
  loadedEffects = data[1].effects;

  worldGrid = [];
  worldGrid = make2DArray(worldGridDimenX, worldGridDimenY);
  populateWorldGridWithCells();
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 20; j++) {
      if (typeof loadedMap[i][j].color != "string") {
        worldGrid[i][j].color = color(loadedMap[i][j].color.levels);
      } else {
        worldGrid[i][j].color = color(loadedMap[i][j].color);
      }
      if (loadedMap[i][j].occupant != null) {
        var newOccupant = loadedMap[i][j].occupant;
        worldGrid[i][j].occupant = new OccupantWithLetter(color(newOccupant.col.levels), newOccupant.shape, newOccupant.originI, newOccupant.originJ, newOccupant.letter);
      }
    }
  }
  if (loadedEffects != undefined) {
    for (let p = 0; p <= loadedEffects.length - 1; p++) {
      let temp = loadedEffects[p];

      let newEffect = new Effect(color(temp.col.levels), temp.shape, temp.originI, temp.originJ, temp.width);
      activeEffects.push(newEffect);
    }
  }
  document.getElementById('fileinput').value = "";
}


function setup() {
  isMaster = false;
  canWrite = true;
  swithIsMaster();
  //Socket connection for server/client
  socket = io('localhost:3000');

  socket.on('map', function(mapWithEffects){
    if(!isMaster){
      console.log(mapWithEffects);
      instatiateMap(mapWithEffects);
    }
  })

  socket.on('color tile', function (msg) {
    if (!isMaster) {
      if (isInsideCanvas(msg.posX, msg.posY)) {
        mouseX = msg.posX;
        mouseY = msg.posY;
        goThroughAndDoCallback(colorTile);
      }
    }
  });

  socket.on('color block', function (block) {
    if (!isMaster) {
      mouseX = block.posX;
      mouseY = block.posY;
      goThroughAndDoCallback(colorDraggedTiles);
    }
  });

  socket.on('worldgridcoordinate', function (coordinates) {
    if (!isMaster) {
      worldGridCoordinateI = coordinates.worldI;
      worldGridCoordinateJ = coordinates.worldJ;
    }
  });

  socket.on('change color tile', function (color) {
    if (!isMaster) {
      selectedTileColor = color.color;
    }
  });

  socket.on('change color occupant', function (color) {
    if (!isMaster) {
      console.log(color);
      selectedOccupantColor = color;
    }
  });

  socket.on('pick up occupant', function (coordinates) {
    if (!isMaster) {
      mouseX = coordinates.posX;
      mouseY = coordinates.posY;
      goThroughAndDoCallback(pickUpOccupant);
    }
  });

  socket.on('hover coordinates', function (coordinates) {
    if (!isMaster) {
      mouseX = coordinates.posX;
      mouseY = coordinates.posY;
    }
  });

  socket.on('put down occupant', function (coordinates) {
    if (!isMaster) {
      mouseX = coordinates.posX;
      mouseY = coordinates.posY;
      goThroughAndDoCallback(putDownOccupant);
    }
  })

  socket.on('place occupant', function (coordinates) {
    if (!isMaster) {
      mouseX = coordinates.posX;
      mouseY = coordinates.posY;
      letterForNewOccupant = coordinates.letter;
      isHero = coordinates.isHero;
      goThroughAndDoCallback(placeOccupant);
    }
  });

  socket.on('delete item from canvas', function (coordinates) {
    if (!isMaster) {
      console.log('in here');
      mouseX = coordinates.posX;
      mouseY = coordinates.posY;
      goThroughAndDoCallback(deleteItemFromCanvas);
    }
  });

  socket.on('hover effect coordinates', function(coordinates){
    if(!isMaster){
    mouseX = coordinates.posX;
    mouseY = coordinates.posY;
    }
  });

  socket.on('new hovering effect', function(effect){
    if(!isMaster){
      console.log('new hover effect');
      hoveringEffect = new Effect(color(effect.col.levels), effect.shape, effect.originI, effect.originJ, effect.width);
      console.log(hoveringEffect);
    }
  })

  socket.on('put down effect', function(coordinates){
    if(!isMaster){
      mouseX = coordinates.posX;
      mouseY = coordinates.posY;
      putDownEffect(mouseX, mouseY);
    }
  })

  selectedTileColor = color('#c62828');
  selectedOccupantColor = color('#c62828');
  selectedEffectColor = color(255, 204, 0, 30);
  selectedEffectShape = "SQUARE";
  selectedEffectWidth = 15;
  frameRate(20);
  let cvs = createCanvas(worldPixDimenX, worldPixDimenY);
  cvs.parent('canvas');
  worldGrid = make2DArray(worldGridDimenX, worldGridDimenY);
  viewGrid = new ViewGrid(worldGridDimenX, worldGridDimenY);
  cellWidth = floor(worldPixDimenY / viewGrid.dimenY);
  populateWorldGridWithCells();
  enemies = createNumberDict();
  heroes = [];
  activeEffects = [];
  isHero = true;
}

function instatiateMap(mapWithEffects){
 let loadedMap = mapWithEffects.map;
 let loadedEffects = mapWithEffects.effects;

  
  worldGrid = [];
  worldGrid = make2DArray(worldGridDimenX, worldGridDimenY);
  populateWorldGridWithCells();
  for (let i = 0; i < 32; i++) {
    for (let j = 0; j < 20; j++) {
      if (typeof loadedMap[i][j].color != "string") {
        worldGrid[i][j].color = color(loadedMap[i][j].color.levels);
      } else {
        worldGrid[i][j].color = color(loadedMap[i][j].color);
      }
      if (loadedMap[i][j].occupant != null) {
        var newOccupant = loadedMap[i][j].occupant;
        worldGrid[i][j].occupant = new OccupantWithLetter(color(newOccupant.col.levels), newOccupant.shape, newOccupant.originI, newOccupant.originJ, newOccupant.letter);
      }
    }
  }
  if (loadedEffects != undefined) {
    for (let p = 0; p <= loadedEffects.length - 1; p++) {
      let temp = loadedEffects[p];

      let newEffect = new Effect(color(temp.col.levels), temp.shape, temp.originI, temp.originJ, temp.width);
      activeEffects.push(newEffect);
    }
  }
}

function sendMapToServer() {
  if(isMaster && canWrite){
    let mapWithEffects = {map:worldGrid, effects:activeEffects};
    console.log(mapWithEffects);
  socket.emit(mapWithEffects);
  }
}

function sendColorTile(x, y) {
  if(isMaster && canWrite)
  socket.emit('color tile', { posX: x, posY: y });
}

function sendMouseCoordinatesBlock(x, y) {
  if(isMaster && canWrite)
  socket.emit('color block', { posX: x, posY: y });
}

function sendWorldGridCoordinate(i, j) {
  if(isMaster && canWrite)
  socket.emit('worldgridcoordinate', { worldI: i, worldJ: j });
}

function sendSelectedTileColor() {
  if(isMaster && canWrite)
  socket.emit('change color tile', { color: selectedTileColor });
}

function sendPlaceOccupant(x, y) {
  if(isMaster && canWrite)
  socket.emit('place occupant', { posX: x, posY: y, letter: document.getElementById('character-letter-input').value, isHero:isHero });
}

function sendDeleteItemFromCanvas(x, y) {
  if(isMaster && canWrite)
  socket.emit('delete item from canvas', { posX: x, posY: y });
}

function sendSeletedOccupantColor(color) {
  if(isMaster && canWrite)
  socket.emit('change color occupant', color);
}

function sendPickUpOccupant(x, y) {
  if(isMaster && canWrite)
  socket.emit('pick up occupant', { posX: x, posY: y });
}

function sendHoverCoordinates(x, y) {
  if(isMaster && canWrite) {
    socket.emit('hover coordinates', { posX: x, posY: y });
  }
}

function sendPutDownOccupant(x, y) {
  if(isMaster && canWrite)
  socket.emit('put down occupant', { posX
    : x, posY: y });
}

function sendHoveringEffect(effect){
  if(isMaster && canWrite)
  socket.emit('new hovering effect', effect);
}

function sendHoverEffectCoordinates(x,y){
  if(isMaster && canWrite)
  socket.emit('hover effect coordinates', { posX: x, posY: y });
}

function sendPutDownEffect(x,y){
  if(isMaster && canWrite)
  socket.emit('put down effect',{ posX: x, posY: y } );
}

function draw() {
  background(50);

  goThroughAndDoCallback(drawViewGrid);
  if (hoveringOccupant) {
    if (isMaster) {
      sendHoverCoordinates(mouseX, mouseY);
    }
    hoveringOccupant.show(mouseX, mouseY, cellWidth);

  } else if (hoveringEffect) {
    if(isMaster){
      sendHoverEffectCoordinates(mouseX, mouseY);
    }
    hoveringEffect.show(mouseX, mouseY);
  }
  if (activeEffects.length >= 1) {
    for (let i = 0; i < activeEffects.length; i++) {
      activeEffects[i].show(activeEffects[i].originI, activeEffects[i].originJ);
    }
  }
}

function selectTileColor(col) {
  selectedTileColor = col;
  sendSelectedTileColor(selectedTileColor);

}

function selectOccupantColor(col) {
  selectedOccupantColor = col;
  if (isMaster) {
    sendSeletedOccupantColor(selectedOccupantColor);
  }
}

function selectEffectColor(col) {
  selectedEffectColor = color(col + "40");
}

function selectEffectShape(shape) {
  selectedEffectShape = shape;
}

function mousePressed() {
  if (isInsideCanvas()) {
    if (mapMakingMode) {
      if (keyIsDown(CONTROL) && mouseButton === LEFT) {
        goThroughAndDoCallback(saveInitWorldGridCoordinate);
        sendWorldGridCoordinate(worldGridCoordinateI, worldGridCoordinateJ);
      } else if (keyIsDown(ALT) && mouseButton === LEFT) {
        goThroughAndDoCallback(setColorFromCoordinates);
        sendSelectedTileColor();
      } else if (mouseButton === LEFT) {
        goThroughAndDoCallback(colorTile);
        sendColorTile(mouseX, mouseY);
      }
    } else if (playPlaceMode) {
      if (keyIsDown(CONTROL) && mouseButton === LEFT) {
        goThroughAndDoCallback(placeOccupant);
        sendPlaceOccupant(mouseX, mouseY);
      } else if (keyIsDown(CONTROL) && mouseButton === RIGHT) {
        goThroughAndDoCallback(deleteItemFromCanvas);
        sendDeleteItemFromCanvas(mouseX, mouseY);
      } else if (keyIsDown(ALT) && mouseButton === LEFT) {
        goThroughAndDoCallback(setColorFromOccupants);
        sendSeletedOccupantColor();
      }
    } else if (effectMode) {
      if (keyIsDown(CONTROL) && mouseButton === LEFT) {
        if (hoveringEffect) {
          putDownEffect(mouseX, mouseY);
          if(isMaster){
          sendPutDownEffect(mouseX,mouseY);
          }
          
        } else {
          let effect = new Effect(selectedEffectColor, selectedEffectShape, mouseX, mouseY, (selectedEffectWidth / 5) * cellWidth);
          hoveringEffect = effect;
          sendHoveringEffect(effect);
        }

      } else if (mouseButton === RIGHT && keyIsDown(CONTROL)) {
        for (let i = 0; i < activeEffects.length; i++) {
          if (activeEffects[i].contains(mouseX, mouseY)) {
            hoveringEffect = activeEffects[i];
            activeEffects.splice(i, 1);
          }
        }
      } else if (mouseButton === RIGHT) {
        for (let i = 0; i < activeEffects.length; i++) {
          if (activeEffects[i].contains(mouseX, mouseY)) {
            activeEffects.splice(i, 1);
            if(isMaster && canWrite){
              sendMapToServer();
            }
          }
        }
      }
    }
  }
}

function mouseDragged() {
  if (isInsideCanvas()) {
    if (mapMakingMode) {
      if (keyIsDown(CONTROL) && mouseButton === LEFT) {
        goThroughAndDoCallback(colorDraggedTiles);
        if (isMaster) {
          sendMouseCoordinatesBlock(mouseX, mouseY);
        }
      } else if (mouseButton === LEFT) {
        goThroughAndDoCallback(colorTile);
        sendColorTile(mouseX, mouseY);
      }
    } else if (playPlaceMode) {
      if (mouseButton === LEFT && !hoveringOccupant && !keyIsDown(CONTROL)) {
        goThroughAndDoCallback(pickUpOccupant);
        if (isMaster) {
          sendPickUpOccupant(mouseX, mouseY);
        }
      }
    }

  }
}

function mouseReleased() {
  if (isInsideCanvas()) {
    if (playPlaceMode) {
      if (mouseButton === LEFT && hoveringOccupant != undefined && !keyIsDown(CONTROL)) {
        goThroughAndDoCallback(putDownOccupant);
        sendPutDownOccupant(mouseX, mouseY);
      }
    }

  }
}

function saveInitWorldGridCoordinate(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY)) {
    worldGridCoordinateI = i;
    worldGridCoordinateJ = j;
  }
}

function goThroughAndDoCallback(callback, arg = undefined) {
  for (let i = viewGrid.originX; i < viewGrid.originX + viewGrid.dimenX; i++) {
    for (let j = viewGrid.originY; j < viewGrid.originY + viewGrid.dimenY; j++) {
      callback(i, j, arg);
    }
  }
}

function colorTile(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY)) {
    worldGrid[i][j].color = selectedTileColor;
  }
}

function colorDraggedTiles(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY)) {
    if (i >= worldGridCoordinateI) {
      if (j >= worldGridCoordinateJ) {
        // bottom right or straight right or straight down
        colorTileBlock(i, j, worldGridCoordinateI, worldGridCoordinateJ);
      } else {
        // top right or straight up
        colorTileBlock(i, worldGridCoordinateJ, worldGridCoordinateI, j);
      }
    } else if (i < worldGridCoordinateI) {
      if (j >= worldGridCoordinateJ) {
        // bottom left or straight left
        colorTileBlock(worldGridCoordinateI, j, i, worldGridCoordinateJ);
      } else {
        // top left
        colorTileBlock(worldGridCoordinateI, worldGridCoordinateJ, i, j);
      }
    }
  }
}

function colorTileBlock(gI, gJ, sI, sJ) {
  for (let i = sI; i <= gI; i++) {
    for (let j = sJ; j <= gJ; j++) {
      worldGrid[i][j].color = selectedTileColor;
    }
  }
}

function placeOccupant(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY) && !worldGrid[i][j].isFull()) {
    let letter;
    if (letterForNewOccupant == null) {
      letter = document.getElementById('character-letter-input').value;
    } else {
      letter = letterForNewOccupant;
    }
    let upperCaseLetter = letter == "" ? 'X' : letter.toUpperCase();


    let occupant;
    if (isHero) {
      occupant = new OccupantWithLetter(selectedOccupantColor, 'CIRCLE', i, j, upperCaseLetter);
      heroes.push(occupant);
      buildHtmlOccupant(upperCaseLetter);
    } else {
      addOccupantToEnemies(upperCaseLetter);
      occupant = new OccupantWithLetter(selectedOccupantColor, 'CIRCLE', i, j, upperCaseLetter + enemies.data[upperCaseLetter]);

      console.log(enemies.data[upperCaseLetter]);
      buildHtmlOccupant(upperCaseLetter + enemies.data[upperCaseLetter]);
    }
    worldGrid[i][j].occupant = occupant;
  }
}

function pickUpOccupant(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY) && worldGrid[i][j].occupant) {
    worldGrid[i][j].occupant.isHovering = true;
    hoveringOccupant = worldGrid[i][j].occupant;
  }
}

function putDownOccupant(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY)) {
    if (!worldGrid[i][j].isFull()) {
      worldGrid[hoveringOccupant.originI][hoveringOccupant.originJ].occupant = undefined;
      worldGrid[i][j].occupant = new OccupantWithLetter(hoveringOccupant.col, hoveringOccupant.shape, i, j, hoveringOccupant.letter);
    } else {
      worldGrid[hoveringOccupant.originI][hoveringOccupant.originJ].occupant.isHovering = false;
    }
    hoveringOccupant = undefined;
  }
}

function addOccupantToEnemies(letter) {
  if (enemies.hasKey(letter)) {
    enemies.add(letter, 1)
  } else {
    enemies.create(letter, 1);
  }
}

function putDownEffect(i, j) {
  let effect = new Effect(hoveringEffect.col, hoveringEffect.shape, i, j, hoveringEffect.width);
  activeEffects.push(effect);
  hoveringEffect = undefined;
}


function drawViewGrid(i, j) {
  worldGrid[i][j].show();
}

function populateWorldGridWithCells() {
  for (let i = 0; i < worldGridDimenX; i++) {
    for (let j = 0; j < worldGridDimenY; j++) {
      worldGrid[i][j] = new Cell(
        i * floor(worldPixDimenY / viewGrid.dimenY),
        j * floor(worldPixDimenY / viewGrid.dimenY),
        cellWidth
      );
    }
  }
}

function buildHtmlOccupant(letter) {

  let li = document.createElement('li');
  li.classList.add('column');
  li.setAttribute("id", letter);
  li.setAttribute("draggable", "true");
  li.innerHTML = `<div class="character">
     <div class="color-elem">
       <div class="color" style="background: ${selectedOccupantColor};">
        ${letter}
       </div>
     </div>
     <div class="character-info">
       <input type="number" id="initNumber${letter}" value="" placeholder="Initiative">
     </div>
     <div class="delete-button" onclick="deleteItem('${letter}')">
     <i class="material-icons">close</i>
     </div>
     </div>`;
  document.getElementById('character-list').appendChild(li);
  addDnDHandlers(li);
}

// when deleting from within canvas
function deleteItemFromCanvas(i, j) {
  if (worldGrid[i][j].occupant && worldGrid[i][j].contains(mouseX, mouseY)) {
    // delete from canvas
    document.getElementById(worldGrid[i][j].occupant.letter).remove();
    // delete from DOM
    worldGrid[i][j].occupant = undefined;
  }
}

// onclick for character DOM element
function deleteItem(id) {
  // delete from canvas
  goThroughAndDoCallback((i, j, id) => {
    if (worldGrid[i][j].occupant && worldGrid[i][j].occupant.letter == id) {
      worldGrid[i][j].occupant = undefined;
    }
  }, id);
  // delete from DOM
  document.getElementById(id).remove();
}

function isInsideCanvas(x = undefined, y = undefined) {
  if (x == undefined && y == undefined) {
    return mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height;
  } else {
    return x >= 0 && y >= 0 && x <= width && y <= height;
  }
}

function setColorFromCoordinates(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY)) {
    let color = worldGrid[i][j].color;
    selectedTileColor = color;
    sendSelectedTileColor(selectedTileColor);
  }
}

function setColorFromOccupants(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY) && worldGrid[i][j].occupant != undefined) {

    let color = worldGrid[i][j].occupant.col;
    selectedOccupantColor = color;
  }
}

function swithIsMaster(){
  let nav = document.getElementsByClassName('nav-tabs')[0];
  let mapMaking = document.getElementById('mapmk');
  let play  = document.getElementById('play');
  let removePlay = document.getElementById('remove-play');
  if(isMaster== true){
    isMaster = false;
    document.getElementById('isMasterButton').innerText = 'Is client';
    nav.style.display = 'none';
    mapMaking.style.display = 'none';
    play.style.display = 'block';
    play.style.opacity = 1;
    removePlay.style.display = 'none';
        
    
  }else{
    isMaster= true;
    document.getElementById('isMasterButton').innerText = 'Is master';
  }
}

function switchCanWrite(){
  if(canWrite){
    canWrite = false;
    document.getElementById('canWriteButton').innerText = '|>';
  }else{
    canWrite = true;
    document.getElementById('canWriteButton').innerText = '||';
  }
}

