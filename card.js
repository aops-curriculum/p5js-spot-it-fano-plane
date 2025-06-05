class Card {
  constructor(id, circleid) {
    this.id = id;
    this.circleid = circleid;

    // build code numbers from difference set that generates finite projective plane
    this.code1 = id;
    this.code2 = (id + 1) % 7;
    this.code3 = (id + 3) % 7;
    this.code = 2 ** this.code1 + 2 ** this.code2 + 2 ** this.code3;
  }
}

function drawCircle(x, y, r, col = 0, weight = 1) {
  fill(255);
  stroke(col);
  strokeWeight(weight);
  circle(x, y, 2 * r);
}

function log2(i) {
  let l = 0;
  let a = i;
  while (a > 1) {
    a = a / 2;
    l++;
  }
  return l;
}
