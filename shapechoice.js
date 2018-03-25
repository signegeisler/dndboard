function ShapeChoice(x, y, w, shape) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.shape = shape;
    this.chosen = false;
}

ShapeChoice.prototype.show = function () {
    if (this.chosen) {
        stroke(151);
        strokeWeight(5);
    }

    fill(255);

    switch (this.shape) {
        case "CIRCLE":
            ellipse(this.x, this.y, this.w);
            break;
        case "TRIANGLE":
            var p1x = this.x;
            var p1y = this.y - this.w / 2;
            var p2x = this.x + this.w / 2;
            var p2y = this.y + this.w / 2;
            var p3x = this.x - this.w / 2;
            var p3y = this.y + this.w / 2;
            triangle(p1x, p1y, p2x, p2y, p3x, p3y);
            break;
        case "SQUARE":
            rect(this.x - this.w / 2, this.y - this.w / 2, this.w, this.w);
            break;
        default:
            ellipse(this.x, this.y, this.w);
            break;
    }
    strokeWeight(1);
    stroke(0);
}

ShapeChoice.prototype.contains = function (x, y) {
    return dist(this.x, this.y, x, y) < this.w / 2;
}
