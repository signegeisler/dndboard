class BaseOccupant {
  constructor(col, shape, originI, originJ, isBlocking = false) {
    this.col = col;
    this.shape = shape;
    this.originI = originI;
    this.originJ = originJ;
    this.isBlocking = isBlocking;
    this.isHovering = false;
  }

  show(x, y, w) {
    noStroke();
    fill(this.col);
    switch (this.shape) {
      case "CIRCLE":
        ellipse(x, y, w);
        break;
      case "TRIANGLE":
        var p1x = x;
        var p1y = y - w / 2;
        var p2x = x + w / 2;
        var p2y = y + w / 2;
        var p3x = x - w / 2;
        var p3y = y + w / 2;
        triangle(p1x, p1y, p2x, p2y, p3x, p3y);
        textAlign(CENTER, TOP);
        break;
      case "SQUARE":
        rect(x - w / 2, y - w / 2, w, w);
        break;
      default:
        ellipse(x, y, w);
        break;
    }
  }
}

class OccupantWithLetter extends BaseOccupant {
  constructor(col, shape, originI, originJ, letter) {
    super(col, shape, originI, originJ);
    this.letter = letter;
    this.fontCol = this.determineFontColor();
    this.fontSize = this.determineFontSize();
  }

  determineFontColor() {
    // 143 - the magic number, så gul får mørk tekst
    console.log(this.col.levels);
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

  show(x,y,w) {
    super.show(x,y,w);
    textAlign(CENTER, CENTER);
    fill(0);
    textSize(this.fontSize);
    fill(this.fontCol);
    if(this.letter){
    text(this.letter, x, y);
  }
  }
}
