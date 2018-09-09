function BaseOccupant(color, shape, isBlocking) {
    this.color = color;
    this.shape = shape;
    this.isBlocking = isBlocking;
}

BaseOccupant.prototype.show = function (x, y, w, fontSize) {
    display(x, y, w, fontSize, this.color, 0, '', this.shape);
}

Occupant.prototype = Object.create(BaseOccupant.prototype);
Occupant.prototype.constructor = Occupant;

function Occupant(color, letter, shape, isBlocking) {
    BaseOccupant.call(this, color, shape);
    this.letter = letter;
    this.fontColor = determineFontColor(this.color);
    this.isBlocking = isBlocking;
}

Occupant.prototype.show = function (x, y, w, fontSize) {
    display(x, y, w, fontSize, this.color, this.fontColor, this.letter, this.shape);
}

determineFontColor = function (color) {
    // 143 - the magic number, så gul får mørk tekst
    if (((color.levels[0] + color.levels[1] + color.levels[2]) / 3) > 143) {
        return 32;
    } else {
        return 240;
    }
}

display = function (x, y, w, fontSize, color, fontColor, letter, shape) {
    noStroke();
    fill(color);
    textAlign(CENTER, CENTER);
    switch (shape) {
        case "CIRCLE":
            ellipse(x, y, w);
            break;
        case "TRIANGLE":
            var p1x = x;
            var p1y = y - w / 2;
            var p2x = x + w / 2;
            var p2y = y + w / 2;
            var p3x = x - w / 2;
            var p3y = y + w / 2;
            triangle(p1x, p1y, p2x, p2y, p3x, p3y);
            textAlign(CENTER, TOP);
            break;
        case "SQUARE":
            rect(x - w / 2, y - w / 2, w, w);
            break;
        default:
            ellipse(x, y, w);
            break;
    }
    fill(0);

    textSize(fontSize);
    fill(fontColor);
    text(letter, x, y);
}

function HoverOccupant(color, letter, shape, x, y, w, originI, originJ, isBlocking) {
    Occupant.call(this, color, letter, shape);
    this.x = x;
    this.y = y;
    this.w = w;
    this.originI = originI;
    this.originJ = originJ;
    this.isBlocking = isBlocking;
}

HoverOccupant.prototype = Object.create(Occupant.prototype);
HoverOccupant.prototype.constructor = HoverOccupant;

HoverOccupant.prototype.show = function () {
    display(this.x, this.y, this.w, this.fontSize, this.color, this.fontColor, this.letter, this.shape);
}
