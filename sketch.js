var grid;
var rows;
var cols;
var w = 50;
var menuWidth = 350;
var menuItemWidth = 30;
var menuItemSpacingHorizontal = 10;
var menuItemSpacingVertical = 60;
var menuX;

var input;
var modeRadioButton;
var blockingElementCheckbox;

var colorChoices;
var tileColorChoices;
var shapeChoices;

var hoveringOccupant;

var oncontextmenu = "event.preventDefault();";

var opponents;

function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function setupColorChoices() {
    var colors = [color(192, 57, 43), color(155, 89, 182),
             color(41, 128, 185), color(39, 174, 96), color(241, 196, 15), color(230, 126, 34), color(135, 54, 0)];

    var x = menuX + menuItemWidth / 2;
    var y = 100;

    var arr = [];

    for (var i = 0; i < colors.length; i++) {
        arr.push(new ColorChoice(x, y, menuItemWidth, colors[i]));
        x += menuItemWidth + menuItemSpacingHorizontal;
    }
    arr[0].chosen = true;

    return arr;
}

function setupShapeChoices() {
    var shapes = ["CIRCLE", "SQUARE", "TRIANGLE"];

    var x = menuX + menuItemWidth / 2;
    var y = modeRadioButton.y + menuItemSpacingVertical * 2 + 20;

    var arr = [];

    for (var i = 0; i < shapes.length; i++) {
        arr.push(new ShapeChoice(x, y, menuItemWidth, shapes[i]));
        x += menuItemWidth + menuItemSpacingHorizontal;
    }
    arr[0].chosen = true;

    return arr;
}

function setupTileColorChoices() {
    var colors = [color(213, 216, 220), color(169, 223, 191), color(253, 235, 208), color(141, 110, 99), color(23, 32, 42), color(133, 193, 233), color(248, 249, 249)];

    var x = menuX + menuItemWidth / 2;
    var y = blockingElementCheckbox.y + menuItemSpacingVertical + 40;

    var arr = [];

    for (var i = 0; i < colors.length; i++) {
        arr.push(new ColorChoice(x, y, menuItemWidth, colors[i]));
        x += menuItemWidth + menuItemSpacingHorizontal;
    }
    arr[0].chosen = true;

    return arr;
}

function setup() {
    createCanvas(1920, 1080);

    menuX = width - menuWidth;
    cols = floor(height / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);

    colorChoices = setupColorChoices();

    input = createInput();
    input.style('maxlength', '1');
    input.position(menuX, 100 + menuItemSpacingVertical + menuItemWidth / 2);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i * w, j * w, w);
        }
    }

    modeRadioButton = createRadio();
    modeRadioButton.option('Move');
    modeRadioButton.option('Place');
    modeRadioButton.option('Color');
    modeRadioButton.style('width', '60px');
    modeRadioButton.position(menuX, input.y + menuItemSpacingVertical + 20);
    modeRadioButton.value('Place');

    shapeChoices = setupShapeChoices();

    blockingElementCheckbox = createCheckbox('Blocking element', false);
    blockingElementCheckbox.position(menuX, shapeChoices[0].y + menuItemWidth);

    tileColorChoices = setupTileColorChoices();

    opponents = createNumberDict();
}

function moveMode() {
    return modeRadioButton.value() == 'Move';
}

function coloringMode() {
    return modeRadioButton.value() == 'Color';
}

function placeMode() {
    return modeRadioButton.value() == 'Place';
}

function draw() {
    background(0);
    textSize(20);
    textAlign(LEFT, BOTTOM);
    fill(255);
    text('Character colors:', menuX, colorChoices[0].y - menuItemSpacingVertical / 2);
    text('Character letter:', menuX, input.y - menuItemSpacingVertical / 2 + menuItemWidth / 2);
    text('Mode:', menuX, modeRadioButton.y - menuItemSpacingVertical / 2 + menuItemWidth / 2);
    text('Item shape:', menuX, shapeChoices[0].y - menuItemSpacingVertical / 2);
    text('Tile colors:', menuX, tileColorChoices[0].y - menuItemSpacingVertical / 2);


    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    for (var i = 0; i < colorChoices.length; i++) {
        colorChoices[i].show();
    }

    for (var i = 0; i < shapeChoices.length; i++) {
        shapeChoices[i].show();
    }

    for (var i = 0; i < tileColorChoices.length; i++) {
        tileColorChoices[i].show();
    }

    if (moveMode() && hoveringOccupant) {
        hoveringOccupant.show();
    }
}


function mousePressed() {
  console.log(modeRadioButton.value());

    if (placeMode()) {
        if (mouseButton === LEFT) {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].isFull()) {

                        if (blockingElementCheckbox.checked()) {
                            if (grid[i][j].occupants.length == 0) {
                                grid[i][j].occupants.push(new BaseOccupant(getChosenColor(), getChosenShape()));
                                grid[i][j].isBlocking = true;
                            }
                        } else {
                            var letter = input.value() == "" ? 'X' : input.value().toUpperCase();

                            if (opponents.hasKey(letter)) {
                                opponents.add(letter, 1)
                            } else {
                                opponents.create(letter, 1);
                            }

                            grid[i][j].occupants.push(new Occupant(getChosenColor(), letter + opponents.get(letter), getChosenShape()));
                        }
                    }
                }
            }
        } else if (mouseButton === RIGHT) {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY)) {
                        if (grid[i][j].occupants.length == 1) {
                            grid[i][j].occupants = [];
                            grid[i][j].isBlocking = false;
                        } else if (grid[i][j].occupants.length > 1) {
                            grid[i][j].removeOccupant(mouseX, mouseY);
                        }
                    }
                }
            }
        }
    } else if (coloringMode()) {
        if (mouseButton === LEFT) {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY)) {
                        grid[i][j].color = getChosenTileColor();
                    }
                }
            }
        }
    }

    for (var i = 0; i < colorChoices.length; i++) {
        if (colorChoices[i].contains(mouseX, mouseY)) {
            for (var j = 0; j < colorChoices.length; j++) {
                colorChoices[j].chosen = false;
            }
            colorChoices[i].chosen = true;
        }
    }

    for (var i = 0; i < tileColorChoices.length; i++) {
        if (tileColorChoices[i].contains(mouseX, mouseY)) {
            for (var j = 0; j < tileColorChoices.length; j++) {
                tileColorChoices[j].chosen = false;
            }
            tileColorChoices[i].chosen = true;
        }
    }

    for (var i = 0; i < shapeChoices.length; i++) {
        if (shapeChoices[i].contains(mouseX, mouseY)) {
            for (var j = 0; j < shapeChoices.length; j++) {
                shapeChoices[j].chosen = false;
            }
            shapeChoices[i].chosen = true;
        }
    }

}

function mouseDragged() {
    if (moveMode()) {
        if (hoveringOccupant == undefined) {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY)) {
                        if (grid[i][j].occupants.length == 1) {
                            var occ = grid[i][j].occupants[0];
                            hoveringOccupant = new HoverOccupant(occ.color, occ.letter, occ.shape, mouseX, mouseY, 30, i, j);
                            grid[i][j].occupants = [];
                        } else if (grid[i][j].occupants.length > 1) {
                            var occIdx = grid[i][j].getClickedOccupantIndex(mouseX, mouseY);
                            if (occIdx != -1) {
                                var occ = grid[i][j].occupants[occIdx];
                                hoveringOccupant = new HoverOccupant(occ.color, occ.letter, occ.shape, mouseX, mouseY, 30, i, j);
                                grid[i][j].removeOccupant(mouseX, mouseY);
                            }
                        }
                    }
                }
            }
        } else {
            hoveringOccupant.x = mouseX;
            hoveringOccupant.y = mouseY;
        }

    }
}

function mouseReleased() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (moveMode() && hoveringOccupant) {
                if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].isFull()) {
                    grid[i][j].occupants.push(new Occupant(hoveringOccupant.color, hoveringOccupant.letter, hoveringOccupant.shape));
                    hoveringOccupant = undefined;
                }
            }
        }
    }
    if (moveMode() && hoveringOccupant) {
        grid[hoveringOccupant.originI][hoveringOccupant.originJ].occupants.push(new Occupant(hoveringOccupant.color, hoveringOccupant.letter, hoveringOccupant.shape));
        hoveringOccupant = undefined;
    }
}

function getChosenColor() {
    for (var i = 0; i < colorChoices.length; i++) {
        if (colorChoices[i].chosen) {
            return colorChoices[i].color;
        }
    }
    return color(151);
}

function getChosenTileColor() {
    for (var i = 0; i < tileColorChoices.length; i++) {
        if (tileColorChoices[i].chosen) {
            return tileColorChoices[i].color;
        }
    }
    return color(213, 216, 220);
}

function getChosenShape() {
    for (var i = 0; i < shapeChoices.length; i++) {
        if (shapeChoices[i].chosen) {
            return shapeChoices[i].shape;
        }
    }
    return "";
}
