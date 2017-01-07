class Circle extends DrawableObj {
  constructor(x, y, radius, style) {
    super(x, y, style);
    this.radius = radius;
  }

  draw(ctx) {
    ctx.fillStyle = this.style.fillStyle;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  middleXY() {
    return {
      x: this.x,
      y: this.y
    };
  }

  getRadius() {
    return this.radius;
  }

  isRectOut(width, height) {
    if ((this.x+this.radius < 0 || this.x-this.radius > width) ||
        (this.y+this.radius < 0 || this.y-this.radius > height)) {
      return true;
    }
    return false;
  }
}
