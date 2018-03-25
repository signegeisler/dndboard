function ColorChoice(x, y, d, color) {
    this.x = x;
    this.y = y;
    this.d = d;
    this.color = color;
    this.chosen = false;
}

ColorChoice.prototype.show = function () {
    if (this.chosen) {
        stroke(151);
        strokeWeight(5);
    }

    fill(this.color);
    ellipse(this.x, this.y, this.d);
    strokeWeight(1);
    stroke(0);
}

ColorChoice.prototype.contains = function (x, y) {
    return dist(this.x, this.y, x, y) < this.d / 2;
}
