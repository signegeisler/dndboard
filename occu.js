class BaseOccupant {
  constructor(x, y, w, col, shape, originI, originJ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.col = col;
    this.shape = shape;
    this.originI = originI;
    this.originJ = originJ;
    this.isHovering = false;
  }

  show() {
    noStroke();
    fill(this.col);
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
        textAlign(CENTER, TOP);
        break;
      case "SQUARE":
        rect(this.x - this.w / 2, this.y - this.w / 2, this.w, this.w);
        break;
      default:
        ellipse(this.x, this.y, this.w);
        break;
    }
  }
}

class OccupantWithLetter extends BaseOccupant {
  constructor(x, y, w, col, shape, originI, originJ, letter) {
    super(x, y, w, col, shape, originI, originJ);
    this.letter = letter;
    this.fontCol = this.determineFontColor();
    this.fontSize = this.determineFontSize();
  }

  determineFontColor() {
    // 143 - the magic number, så gul får mørk tekst
    if (((this.col.levels[0] + this.col.levels[1] + this.col.levels[2]) / 3) > 143) {
      return 32;
    } else {
      return 240;
    }
  }

  determineFontSize() {
    if (this.w > 30) {
      return 20;
    } else {
      return 12;
    }
  }

  show() {
    super.show();
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(this.fontSize);
    fill(this.fontCol);
    text(this.letter, this.x, this.y);
  }

}
