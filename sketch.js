const CARD_RADIUS = 40;
const LOWER_LEFT_CORNER_X = 160;
const LOWER_LEFT_CORNER_Y = 420;
const SIDE_LENGTH = 400;
const CARD_GAP = 20;
const lineIndices = [
  [0, 1, 2],
  [2, 3, 4],
  [4, 5, 0],
  [0, 6, 3],
  [2, 6, 5],
  [4, 6, 1],
  [1, 3, 5],
];

let loadedBAImages = [];
let circleCenterx = [];
let circleCentery = [];
let cards = []; // array of cards;
let listOfCards = []; // this array keeps track of which cards are in which circles
let lastClickedCircleId = -1;
let colorArray = [];
let lineColors = [];

function preload() {
  loadedBAImages.push(loadImage("images/Alex.png"));
  loadedBAImages.push(loadImage("images/Fiona.png"));
  loadedBAImages.push(loadImage("images/Grogg.png"));
  loadedBAImages.push(loadImage("images/Grok.png"));
  loadedBAImages.push(loadImage("images/Lizzie.png"));
  loadedBAImages.push(loadImage("images/MsQ.png"));
  loadedBAImages.push(loadImage("images/Winnie.png"));
  loadedBAImages.push(loadImage("images/Headmaster1.png"));
}

function setup() {
  createCanvas(800, 600);

  // define centers of circles
  circleCenterx[0] = LOWER_LEFT_CORNER_X + (1 / 2) * SIDE_LENGTH;
  circleCentery[0] = LOWER_LEFT_CORNER_Y - (sqrt(3) / 2) * SIDE_LENGTH;
  circleCenterx[2] = LOWER_LEFT_CORNER_X;
  circleCentery[2] = LOWER_LEFT_CORNER_Y;
  circleCenterx[4] = LOWER_LEFT_CORNER_X + SIDE_LENGTH;
  circleCentery[4] = LOWER_LEFT_CORNER_Y;
  circleCenterx[1] = (circleCenterx[0] + circleCenterx[2]) / 2;
  circleCentery[1] = (circleCentery[0] + circleCentery[2]) / 2;
  circleCenterx[3] = (circleCenterx[2] + circleCenterx[4]) / 2;
  circleCentery[3] = (circleCentery[2] + circleCentery[4]) / 2;
  circleCenterx[5] = (circleCenterx[0] + circleCenterx[4]) / 2;
  circleCentery[5] = (circleCentery[0] + circleCentery[4]) / 2;
  circleCenterx[6] =
    (circleCenterx[0] + circleCenterx[2] + circleCenterx[4]) / 3;
  circleCentery[6] =
    (circleCentery[0] + circleCentery[2] + circleCentery[4]) / 3;

  for (let i = 7; i <= 13; i++) {
    circleCenterx[i] =
      circleCenterx[0] + 2 * (i - 10) * CARD_RADIUS + (i - 10) * CARD_GAP;
    circleCentery[i] = LOWER_LEFT_CORNER_Y + CARD_RADIUS + 4 * CARD_GAP;
  }

  // initialize cards
  for (let i = 0; i <= 6; i++) {
    cards[i] = new Card(i, i + 7);
  }

  // initialize listOfCards
  for (let i = 0; i <= 6; i++) {
    listOfCards[i] = -1;
  }

  for (let i = 7; i <= 13; i++) {
    listOfCards[i] = i - 7;
  }

  // initalize colors of lines
  colorArray[0] = color(69, 182, 232);
  colorArray[1] = color(183, 165, 203);
  colorArray[2] = color(91, 27, 117);
  colorArray[3] = color(210, 214, 217);
  colorArray[4] = color(128, 194, 66);
  colorArray[5] = color(255, 236, 129);
  colorArray[6] = color(234, 126, 177);

  imageMode(CENTER);

  const shuffleButton = createButton("Shuffle");
  shuffleButton.mouseClicked(shuffleCards);
  shuffleButton.size(65, 30);
  shuffleButton.position(70, 90);
  shuffleButton.style("font-size", "16px");

  const resetButton = createButton("Reset");
  resetButton.mouseClicked(reset);
  resetButton.size(55, 30);
  resetButton.position(150, 90);
  resetButton.style("font-size", "16px");
}

function draw() {
  background(255);

  noStroke();
  fill(0);
  textAlign(LEFT);
  textSize(16);
  text("Place the cards into the Fano plane,", 20, 30);
  text("so that all the cards with the same", 20, 50);
  text("character lie on the same line.", 20, 70);

  // compute the color of each line in the Fano plane
  for (let i = 0; i <= 6; i++) {
    lineColors[i] = 255;
    const a = lineIndices[i][0];
    const b = lineIndices[i][1];
    const c = lineIndices[i][2];
    if (listOfCards[a] >= 0 && listOfCards[b] >= 0 && listOfCards[c] >= 0) {
      const acode = cards[listOfCards[a]].code;
      const bcode = cards[listOfCards[b]].code;
      const ccode = cards[listOfCards[c]].code;
      const dcode = acode & bcode & ccode;

      if (dcode > 0) {
        const l = log2(dcode);
        lineColors[i] = colorArray[l];
      }
    }
  }

  // draw lines of Fano plane
  drawLines();

  // draw all the circles
  for (let i = 0; i <= 13; i++) {
    const x = circleCenterx[i];
    const y = circleCentery[i];

    if (i === lastClickedCircleId) {
      drawCircle(x, y, CARD_RADIUS, color(255, 0, 0), 5);
    } else {
      drawCircle(x, y, CARD_RADIUS, 0, 1);
    }
  }

  // draw all the cards
  for (let c of cards) {
    drawCard(c);
  }

  // all the cards are lined up!
  if (
    lineColors[0] !== 255 &&
    lineColors[1] !== 255 &&
    lineColors[2] !== 255 &&
    lineColors[3] !== 255 &&
    lineColors[4] !== 255 &&
    lineColors[5] !== 255 &&
    lineColors[6] !== 255
  ) {
    fill(0);
    noStroke();
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Headmaster says", 650, 80);
    image(loadedBAImages[7], 650, 200, 200, 200);
    text("You got it!", 650, 330);
  }
}

function mousePressed() {
  for (let i = 0; i <= 13; i++) {
    const x = circleCenterx[i];
    const y = circleCentery[i];
    if (dist(x, y, mouseX, mouseY) < CARD_RADIUS) {
      if (lastClickedCircleId === -1) {
        // no circle is highlighted
        if (listOfCards[i] >= 0) {
          // there is a card in circle being clicked
          lastClickedCircleId = i;
        }
      } else {
        // some circle is highlighted
        if (i !== lastClickedCircleId) {
          // different circle is clicked on
          if (listOfCards[i] >= 0) {
            // there is a card in new circle
            swapCircles(lastClickedCircleId, i);
          } else {
            // new circle is empty
            const a = listOfCards[lastClickedCircleId];
            listOfCards[lastClickedCircleId] = -1;
            listOfCards[i] = a;
            cards[a].circleid = i;
          }
        }
        lastClickedCircleId = -1;
      }
      return;
    }
  }
}

function drawLines() {
  // first draw the circle of the Fano plane!
  fill(lineColors[6]);
  stroke(0);
  strokeWeight(1);

  const d = dist(
    circleCenterx[6],
    circleCentery[6],
    circleCenterx[1],
    circleCentery[1]
  );
  circle(circleCenterx[6], circleCentery[6], 2 * (d + 6));

  fill(255);
  circle(circleCenterx[6], circleCentery[6], 2 * (d - 6));

  for (let i = 0; i <= 5; i++) {
    fill(lineColors[i]);

    const a = lineIndices[i][0];
    const c = lineIndices[i][2];
    const Ax = circleCenterx[a];
    const Ay = circleCentery[a];
    const Bx = circleCenterx[c];
    const By = circleCentery[c];
    const X = createVector(Bx - Ax, By - Ay);
    const Xunit = p5.Vector.normalize(X);
    const Yunit = createVector(Xunit.y, -Xunit.x);

    beginShape();
    vertex(Ax + 6 * Yunit.x, Ay + 6 * Yunit.y);
    vertex(Ax + 6 * Yunit.x + X.x, Ay + 6 * Yunit.y + X.y);
    vertex(Ax - 6 * Yunit.x + X.x, Ay - 6 * Yunit.y + X.y);
    vertex(Ax - 6 * Yunit.x, Ay - 6 * Yunit.y);
    endShape(CLOSE);
  }
}

function drawCard(c) {
  const x = circleCenterx[c.circleid];
  const y = circleCentery[c.circleid];

  if (c.circleid !== lastClickedCircleId) {
    drawCircle(x, y, CARD_RADIUS, 0, 2);
  }

  image(loadedBAImages[c.code1], x, y - 20, 32, 32);
  image(
    loadedBAImages[c.code2],
    x - (sqrt(3) / 2) * 20,
    y + (1 / 2) * 20,
    32,
    32
  );
  image(
    loadedBAImages[c.code3],
    x + (sqrt(3) / 2) * 20,
    y + (1 / 2) * 20,
    32,
    32
  );
}

function swapCircles(i, j) {
  const a = listOfCards[i];
  const b = listOfCards[j];

  listOfCards[i] = b;
  listOfCards[j] = a;
  cards[a].circleid = j;
  cards[b].circleid = i;
}

// Fisher-Yates algorithm
function shuffleCards() {
  let filledCircles = [];

  for (let i = 0; i <= 13; i++) {
    if (listOfCards[i] >= 0) {
      filledCircles.push(i);
    }
  }

  for (let i = 0; i <= 5; i++) {
    const j = floor(random(i, 7));
    swapCircles(filledCircles[i], filledCircles[j]);
  }
}

function reset() {
  for (let i = 0; i <= 6; i++) {
    cards[i].circleid = i + 7;
  }

  for (let i = 0; i <= 6; i++) {
    listOfCards[i] = -1;
  }

  for (let i = 7; i <= 13; i++) {
    listOfCards[i] = i - 7;
  }

  lastClickedCircleId = -1;
}
