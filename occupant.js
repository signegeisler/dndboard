function Occupant(color) {
    this.color = color;
}

Occupant.prototype.show = function (x, y, w) {
    fill(this.color);
    ellipse(x, y, w);
}
