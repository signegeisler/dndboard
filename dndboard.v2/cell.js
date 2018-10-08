class Cell {
  constructor(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.occupant;
    this.color = color(23, 32, 42);
  }

  show() {
    stroke(0);
    fill(this.color);
    rect(this.x, this.y, this.w, this.w);

    if(this.occupant && !this.occupant.isHovering) {
      this.occupant.show(this.middle().x, this.middle().y, this.w);
    }
  }

  contains(mX, mY) {
    return (mX > this.x && mX < this.x + this.w &&
      mY > this.y && mY < this.y + this.w);
  }

  isFull() {
    return !!this.occupant;
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
    let midX = this.x + this.w / 2;
    let midY = this.y + this.w / 2;
    return {
      x: midX,
      y: midY
    };
  }

  quarterClicked(mX, mY) {
    if (mX <= this.x + this.w / 2) {
      if (y <= this.y + this.w / 2) {
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
