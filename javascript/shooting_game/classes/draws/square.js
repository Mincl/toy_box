class Square extends DrawableObj {
  constructor(x, y, width, height, style) {
    super(x, y, style);
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillStyle = this.style.fillStyle;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  middleXY() {
    return {
      x: this.x+this.width/2.,
      y: this.y+this.height/2.
    };
  }

  getXYByMiddle(middleX, middleY) {
    return {
      x: middleX-this.width/2.,
      y: middleY-this.height/2.
    }
  }

  getRadius() {
    return Calc.distance(0, 0, this.width/2., this.height/2.);
  }

  isRectOut(width, height) {
    if ((this.x+this.width < 0 || this.x > width) ||
        (this.y+this.height < 0 || this.y > height)) {
      return true;
    }
    return false;
  }
}
