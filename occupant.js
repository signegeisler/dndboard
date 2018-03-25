function Occupant(color, letter) {
    this.color = color;
    this.letter = 'A1';
    this.fontColor = determineFontColor(this.color);
}

Occupant.prototype.show = function (x, y, w, fontSize) {
    display(x, y, w, fontSize, this.color, this.fontColor, this.letter);
}

determineFontColor = function (color) {
    // 143 - the magic number, så gul får mørk tekst
    if (((color.levels[0] + color.levels[1] + color.levels[2]) / 3) > 143) {
        return 32;
    } else {
        return 240;
    }
}

display = function (x, y, w, fontSize, color, fontColor, letter) {
    noStroke();
    fill(color);
    ellipse(x, y, w);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(fontSize);
    fill(fontColor);
    text(letter, x, y);
}

function HoverOccupant(color, letter, x, y, w, originI, originJ) {
    Occupant.call(this, color, letter);
    this.x = x;
    this.y = y;
    this.w = w;
    this.originI = originI;
    this.originJ = originJ;
}

HoverOccupant.prototype = Object.create(Occupant.prototype);
HoverOccupant.prototype.constructor = HoverOccupant;

HoverOccupant.prototype.show = function () {
    display(this.x, this.y, this.w, this.fontSize, this.color, this.fontColor, this.letter);
}
