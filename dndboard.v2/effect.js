class Effect {
  constructor(col, shape, originI, originJ, width) {
    this.col = col;
    this.shape = shape;
    this.originI = originI;
    this.originJ = originJ;
    this.width = width;
    this.isHovering = true;
  }

  show(x, y) {
    noStroke();
    fill(this.col, 63);
    switch (this.shape) {
      case "CIRCLE":
        ellipse(x, y, this.width);
        break;
      case "SQUARE":
        rect(x - this.width / 2, y - this.width / 2, this.width, this.width);
        break;
      default:
        ellipse(x, y, this.width);
        break;
    }
  }
}
