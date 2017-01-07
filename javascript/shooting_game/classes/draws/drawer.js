class Drawer {
  constructor(canvas) {
    this.objs = [];
    this.txts = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
  }

  append_obj() {
    for (var idx in arguments) {
      this.objs.push(arguments[idx]);
    }
  }

  append_txt() {
    for (var idx in arguments) {
      this.txts.push(arguments[idx]);
    }
  }

  draw() {
    // clear screen
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // draw objs
    for (var idx=0; idx < this.objs.length; idx++) {
      if (this.objs[idx].isRectOut(this.canvas.width, this.canvas.height)) {
        this.objs[idx].destroy();
        this.objs.splice(idx, 1);
        idx--;
      }
      else if (this.objs[idx].draw != undefined) {
        this.ctx.save();
        this.objs[idx].draw(this.ctx);
        this.ctx.restore();
      }
    }

    // draw texts
    for (var idx=0; idx < this.txts.length; idx++) {
      this.ctx.save();
      this.txts[idx].draw(this.ctx);
      this.ctx.restore();
    }
  }
}
