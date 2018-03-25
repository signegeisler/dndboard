function Cell(x, y, w) {
    this.occupied = false;
    this.occupants = [];
    this.x = x;
    this.y = y;
    this.w = w;
}

var cellPlacement;

Cell.prototype.show = function () {
    stroke(0);
    fill(255);
    rect(this.x, this.y, this.w, this.w);

    if (this.occupants.length > 0) {
        if (this.occupants.length == 1) {
            this.occupants[0].show(this.x + this.w / 2, this.y + this.w / 2, this.w - 4, 20);
        } else {
            this.cellPlacement = initCellPlacement(this.x, this.y, this.w);
            for (var i = 0; i < this.occupants.length; i++) {
                this.occupants[i].show(this.cellPlacement[i].x, this.cellPlacement[i].y, this.w / 1.5, 12);
            }
        }
    }
}

Cell.prototype.contains = function (x, y) {
    return (x > this.x && x < this.x + this.w &&
        y > this.y && y < this.y + this.w);
}

Cell.prototype.isFull = function () {
    return this.occupants.length > 3;
}

Cell.prototype.removeOccupant = function (mX, mY) {
    var quarter = quarterClicked(mX, mY, this.x, this.y, this.w);

    if (quarterOccupied(this.occupants, quarter)) {
        this.occupants.splice(quarter, 1);
    }
}

quarterClicked = function (mX, mY, x, y, w) {
    if (mX <= x + w / 2) {
        if (y <= y + w / 2) {
            return 0;
        } else {
            return 3;
        }
    } else {
        if (mY <= y + w / 2) {
            return 2;
        } else {
            return 1;
        }
    }
}

quarterOccupied = function (occupants, occupantIndex) {
    return occupants[occupantIndex] != undefined;
}

initCellPlacement = function (x, y, w) {
    var arr = [];
    arr[0] = createVector(x + w * 0.25, y + w * 0.25);
    arr[1] = createVector(x + w * 0.75, y + w * 0.75);
    arr[2] = createVector(x + w * 0.75, y + w * 0.25);
    arr[3] = createVector(x + w * 0.25, y + w * 0.75);
    return arr;
}
