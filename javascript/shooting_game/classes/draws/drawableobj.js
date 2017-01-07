class DrawableObj {
  constructor(x, y, style) {
    this.x = x;
    this.y = y;
    this.style = style;
    _drawer.append_obj(this);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  setStyle(style) {
    this.style = style;
  }
}
