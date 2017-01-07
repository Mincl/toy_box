class Player extends Character {
  constructor(x, y) {
    super(x, y, {fillStyle:"rgba(0, 0, 200, 0.5)"});
    _central.append_char(this);
  }

  shoot_bullet() {
    var middleXY = this.middleXY();
    var bullet = new NormalBullet(this, middleXY.x, middleXY.y);
    bullet.shooted();
  }

  shoot_bomb() {
    var middleXY = this.middleXY();
    var leftBomb = new BombBullet(this, middleXY.x-14, middleXY.y-8);
    var rightBomb = new BombBullet(this, middleXY.x+14, middleXY.y-8);
    leftBomb.shooted();
    rightBomb.shooted();
  }
}
