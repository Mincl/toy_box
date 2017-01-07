class NonPlayer extends Character {
  constructor(x, y) {
    super(x, y, {fillStyle:"rgba(200,0,0,1)"})
    _central.append_char(this);
  }
}
