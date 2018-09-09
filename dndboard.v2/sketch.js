let worldGrid;
let worldDimenScale = 1.6;
let worldGridDimenY = 20;
let worldGridDimenX = Math.floor(worldGridDimenY * worldDimenScale);
let worldPixDimenY = 900;
let worldPixDimenX = worldPixDimenY * worldDimenScale;
let viewGrid;
let selectedTileColor = '#c62828';
let selectedOccupantColor = '#c62828';
let mapMakingMode = true;
let playPlaceMode = false;
let worldGridCoordinateI;
let worldGridCoordinateJ;
let enemies;

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
  let cvs = createCanvas(worldPixDimenX, worldPixDimenY);
  cvs.parent('canvas');
  worldGrid = make2DArray(worldGridDimenX, worldGridDimenY);
  viewGrid = new ViewGrid(worldGridDimenX, worldGridDimenY);
  populateWorldGridWithCells();
  enemies = createNumberDict();

  buildHtmlOccupant();
}

function draw() {
  background(50);
  goThroughAndDoCallback(drawViewGrid);
}

function selectTileColor(color) {
  selectedTileColor = color;
}

function selectOccupantColor(color) {
  selectedOccupantColor = color;
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
      if (keyIsDown(CONRTOL) && mouseButton === LEFT) {
        goThroughAndDoCallback(placeOccupant);
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
    }
  }
}

function saveInitWorldGridCoordinate(i, j) {
  if (worldGrid[i][j].contains(mouseX, mouseY)) {
    worldGridCoordinateI = i;
    worldGridCoordinateJ = j;
  }
}

function goThroughAndDoCallback(callback) {
  for (let i = viewGrid.originX; i < viewGrid.originX + viewGrid.dimenX; i++) {
    for (let j = viewGrid.originY; j < viewGrid.originY + viewGrid.dimenY; j++) {
      callback(i, j);
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
    let letter = getElementById('character-letter-input').value();
    let upperCaseLetter = letter == "" ? 'X' : letter.toUpperCase();
    // don't do this if hero
    addOccupantToEnemies(upperCaseLetter);
    let occupant = new OccupantWithLetter(x, y, w, selectOccupantColor, 'CIRCLE', i, j, upperCaseLetter);
    // create occupant
    // add occupant to cell's occupants
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
        floor(worldPixDimenY / viewGrid.dimenY)
      );
    }
  }
}

function buildHtmlOccupant() {
  let characterDiv = createDiv(
    `<div class="character">
     <div class="color-elem">
       <div class="color" style="background: ${selectedOccupantColor};">
       </div>
     </div>
     <div class="character-info">
       <input type="number" name="" value="" placeholder="Initiative">
     </div>
     </div>`);
  characterDiv.parent('character-list');
}

function isInsideCanvas() {
  return mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height;
}
