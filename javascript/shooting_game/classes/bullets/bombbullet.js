class BombBullet extends BulletMixin(Circle) {
  constructor(owner, middleX, middleY) {
    super(middleX, middleY, 7, {fillStyle:'rgba(0, 0, 200, 1)'});
    this.owner = owner;
    this.vector = new Vector(0, 2);
    this.pattern_vector = new Vector(0, 0.15);
    _central.append_bullet(this);
  }

  pattern() {
    this.vector.sub(this.pattern_vector);
    super.move_next();
  }
}
