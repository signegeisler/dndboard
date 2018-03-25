var grid;
var rows;
var cols;
var w = 50;
var menuWidth = 350;

var input;
var button;

var moveMode = false;

var colors;
var colorChoices;

var hoveringOccupant;

var oncontextmenu = "event.preventDefault();";

function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

function setupColorChoices() {
    colors = [color(192, 57, 43), color(155, 89, 182),
             color(41, 128, 185), color(39, 174, 96), color(241, 196, 15), color(230, 126, 34), color(135, 54, 0)];

    var spacing = 10;
    var totalSpacing = spacing * colors.length;
    var remaining = menuWidth - totalSpacing;
    var boxWidth = remaining / colors.length;

    var x = width - menuWidth;
    var y = boxWidth / 2 + spacing;

    var arr = [];

    for (var i = 0; i < colors.length; i++) {
        arr.push(new ColorChoice(x, y, boxWidth, colors[i]));
        x += boxWidth + spacing;
    }
    arr[0].chosen = true;

    return arr;
}

function toggleMoveMode() {
    moveMode = !moveMode;
}

function setup() {
    createCanvas(1920, 1080);
    cols = floor(height / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    colorChoices = setupColorChoices();

    input = createInput();
    input.position(width - menuWidth, 100);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i * w, j * w, w);
        }
    }

    button = createButton('change mode');
    button.position(input.x + input.width, 65);
    button.mousePressed(toggleMoveMode);
}

function draw() {
    background(0);

    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    for (var i = 0; i < colorChoices.length; i++) {
        colorChoices[i].show();
    }

    if (moveMode && hoveringOccupant != undefined) {
        hoveringOccupant.show();
    }
}


function mousePressed() {
    if (!moveMode) {
        if (mouseButton === LEFT) {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].isFull()) {
                        grid[i][j].occupants.push(new Occupant(getChosenColor(), 'a'));
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
        } else if (mouseButton === RIGHT) {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY)) {
                        if (grid[i][j].occupants.length == 1) {
                            grid[i][j].occupants = [];
                        } else if (grid[i][j].occupants.length > 1) {
                            grid[i][j].removeOccupant(mouseX, mouseY);
                        }
                    }
                }
            }
        }
    }
}

function mouseDragged() {
    if (moveMode) {
        if (hoveringOccupant == undefined) {
            for (var i = 0; i < cols; i++) {
                for (var j = 0; j < rows; j++) {
                    if (grid[i][j].contains(mouseX, mouseY)) {
                        if (grid[i][j].occupants.length == 1) {
                            var occ = grid[i][j].occupants[0];
                            hoveringOccupant = new HoverOccupant(occ.color, occ.letter, mouseX, mouseY, 30, i, j);
                            grid[i][j].occupants = [];
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
            if (moveMode && hoveringOccupant != undefined) {
                if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].isFull()) {
                    grid[i][j].occupants.push(new Occupant(hoveringOccupant.color, 'a'));
                    hoveringOccupant = undefined;
                }
            }
        }
    }
    if (moveMode && hoveringOccupant != undefined) {
        grid[hoveringOccupant.originI][hoveringOccupant.originJ].occupants.push(new Occupant(hoveringOccupant.color, 'a'));
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
