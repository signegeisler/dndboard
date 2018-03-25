function Occupant(color, letter) {
    this.color = color;
    this.letter = 'A1';
    this.fontColor = determineFontColor(this.color);
}

Occupant.prototype.show = function (x, y, w, fontSize) {
    noStroke();
    fill(this.color);
    ellipse(x, y, w);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(fontSize);
    fill(this.fontColor);

    text(this.letter, x, y);
}

determineFontColor = function (color) {
    // 143 - the magic number, så gul får mørk tekst
    if (((color.levels[0] + color.levels[1] + color.levels[2]) / 3) > 143) {
        print("dark");
        return 32;
    } else {
        print("light");
        return 240;
    }
}
