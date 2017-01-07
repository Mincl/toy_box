class NormalBullet extends BulletMixin(Square) {
  constructor(owner, middleX, middleY) {
    super(middleX-2.5, middleY-2.5, 5, 5, {fillStyle:'rgba(0, 200, 0, 1)'});
    this.owner = owner;
    this.vector = new Vector(0, -10);
    _central.append_bullet(this);
  }
}
