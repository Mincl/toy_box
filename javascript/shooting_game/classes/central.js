class Central {
  constructor() {
    this.chars = [];
    this.bullets = [];

    this.t = new DrawableTxt(400, 300, 'P -> E : 0');
    this.pe = 0;

  	this.t2 = new DrawableTxt(400, 400, 'E -> P : 0');
    this.ep = 0;
  }

  append_char() {
    for (var idx in arguments) {
      this.chars.push(arguments[idx]);
    }
  }

  append_bullet() {
    for (var idx in arguments) {
      this.bullets.push(arguments[idx]);
    }
  }

  collision_check() {
    for (var b in this.bullets) {
      for (var c in this.chars) {
        if (b.owner != c) {
          b_m_xy = b.middleXY();
          c_m_xy = c.middleXY();
          dist = Calc.distance(b_m_xy.x, b_m_xy.y, c_m_xy.x, c_m_xy.y);
          if (b.getRadius()+c.getRadius() >= dist) {
            // if square and circle, then

            // if square and square, then

            // if circle and circle, then
          }
        }
      }
    }
  }
}
