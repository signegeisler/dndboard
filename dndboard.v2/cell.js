class Cell {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.occupied = false;
    this.occupants = [];
    this.color = color(23, 32, 42);
  }

  show() {
    stroke(0);
    fill(this.color);
    rect(this.x, this.y, this.w, this.w);
  }

  contains(x, y) {
    return (x > this.x && x < this.x + this.w &&
      y > this.y && y < this.y + this.w);
  }

  isFull() {
    if (this.occupants[0].isBlocking) {
      return true;
    }
    return this.occupants.length > 3;
  }

  removeOccupant(mX, mY) {
    let quarter = quarterClicked(mX, mY);
    if (quarterOccupied(quarter)) {
      this.occupants.splice(quarter, 1);
    }
  }

  getClickedOccupantIndex(mX, mY) {
    let quarter = quarterClicked(mX, mY);
    if (quarterOccupied(quarter)) {
      return quarter;
    }
    return -1;
  }

  middle() {
    let x = this.x + this.w / 2;
    let y = this.y + this.w / 2;
    return {
      x: x,
      y: y
    };
  }

  quarterClicked(mX, mY) {
    if (mX <= this.x + this.w / 2) {
      if (this.y <= this.y + this.w / 2) {
        return 0;
      } else {
        return 3;
      }
    } else {
      if (mY <= this.y + this.w / 2) {
        return 2;
      } else {
        return 1;
      }
    }
  }

  quarterOccupied(occupantIndex) {
    return this.occupants[occupantIndex] != undefined;
  }
}
