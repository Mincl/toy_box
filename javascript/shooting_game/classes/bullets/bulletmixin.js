var BulletMixin = Base => class extends Base {
  shooted() {
    var bullet = this;
    this.interval_id = setInterval(function() { bullet.pattern(); }, 1000 / _fps);
  }

  pattern() {
    // some pattern
    this.move_next();
  }

  move_next() {
    this.x += this.vector.x;
    this.y += this.vector.y;
  }

  destroy() {
    clearInterval(this.interval_id);
  }
}
