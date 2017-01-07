class Calc {
  static distance(x1, y1, x2, y2) {
    sub_x = x1 - x2;
    sub_y = y1 - y2;
    return Math.sqrt(sub_x * sub_x + sub_y * sub_y);
  }
}
