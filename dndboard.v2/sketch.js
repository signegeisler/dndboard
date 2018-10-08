let worldGrid;
let worldDimenScale = 1.6;
let worldGridDimenY = 20; // how many tiles down in world grid
let worldGridDimenX = Math.floor(worldGridDimenY * worldDimenScale);
let worldPixDimenY = 900;
let worldPixDimenX = worldPixDimenY * worldDimenScale;
let viewGrid;
let selectedTileColor = '#c62828';
let selectedOccupantColor;
let mapMakingMode = true;
let playPlaceMode = false;
let worldGridCoordinateI;
let worldGridCoordinateJ;
let cellWidth;
let enemies;
let hoveringOccupant;

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
  } else {
    mapMakingMode = false;
    playPlaceMode = true;
  }
}

function setup() {
  selectedOccupantColor = color('#c62828');
  frameRate(10);
  let cvs = createCanvas(worldPixDimenX, worldPixDimenY);
  cvs.parent('canvas');
  worldGrid = make2DArray(worldGridDimenX, worldGridDimenY);
  viewGrid = new ViewGrid(worldGridDimenX, worldGridDimenY);
  cellWidth = floor(worldPixDimenY / viewGrid.dimenY);
  populateWorldGridWithCells();
  enemies = createNumberDict();
}

function draw() {
  background(50);
  goThroughAndDoCallback(drawViewGrid);
  if (hoveringOccupant) {
    hoveringOccupant.show(mouseX, mouseY, cellWidth);
  }
}

function selectTileColor(col) {
  selectedTileColor = col;
}

function selectOccupantColor(col) {
  selectedOccupantColor = color(col);
}

function mousePressed() {
  if (isInsideCanvas()) {
    if (mapMakingMode) {
      if (keyIsDown(CONTROL) && mouseButton === LEFT) {
        goThroughAndDoCallback(saveInitWorldGridCoordinate);
      } else if (mouseButton === LEFT) {
        goThroughAndDoCallback(colorTile);
      }
    } else if (playPlaceMode) {
      if (keyIsDown(CONTROL) && mouseButton === LEFT) {
        goThroughAndDoCallback(placeOccupant);
      } else if (keyIsDown(CONTROL) && mouseButton === RIGHT) {
        goThroughAndDoCallback(deleteItemFromCanvas);
      }
    }
  }
}

function mouseDragged() {
  if (isInsideCanvas()) {
    if (mapMakingMode) {
      if (keyIsDown(CONTROL) && mouseButton === LEFT) {
        goThroughAndDoCallback(colorDraggedTiles);
      } else if (mouseButton === LEFT) {
        goThroughAndDoCallback(colorTile);
      }
    } else if (playPlaceMode) {
      if (mouseButton === LEFT && !hoveringOccupant) {
        goThroughAndDoCallback(pickUpOccupant);
      }
    }
  }
}

function mouseReleased() {
  if (isInsideCanvas()) {
    if (playPlaceMode) {
      if (mouseButton === LEFT && hoveringOccupant) {
        goThroughAndDoCallback(putDownOccupant);
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
  console.log('colortileblock');
  for (let i = sI; i <= gI; i++) {
    for (let j = sJ; j <= gJ; j++) {
      worldGrid[i][j].color = selectedTileColor;
    }
  }
}

function placeOccupant(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY) && !worldGrid[i][j].isFull()) {
    let letter = document.getElementById('character-letter-input').value;
    let upperCaseLetter = letter == "" ? 'X' : letter.toUpperCase();
    // don't do this if hero
    addOccupantToEnemies(upperCaseLetter);
    let occupant = new OccupantWithLetter(selectedOccupantColor, 'CIRCLE', i, j, upperCaseLetter + enemies.data[upperCaseLetter]);
    worldGrid[i][j].occupant = occupant;
    buildHtmlOccupant(upperCaseLetter + enemies.data[upperCaseLetter]);
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
       <input type="number" name="" value="" placeholder="Initiative">
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

function isInsideCanvas() {
  return mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height;
}
