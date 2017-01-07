class DrawableTxt {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
    _drawer.append_txt(this);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
  }

  setText(text) {
    this.text = text;
  }

  draw(ctx) {
    ctx.font = "20px Arial"
    ctx.fillText(this.text, this.x, this.y);
  }
}
