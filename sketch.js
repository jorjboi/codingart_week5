let col, r, g, b;
let x, y, d;
let glowLayers;
let waveTimer;
let xDir, yDir;

function setup() {
  createCanvas(windowWidth, windowHeight);

  waveTimer = random(10);

  xDir = random(-5, 3);
  yDir = random(-5, 5);

  glowLayers = 40;

  d = max(random(width / 3), 50);
  x = random(100, width - 100);
  y = random(100, height - 100);
}

function draw() {
  background(0);
  noStroke();

  drawGlowHalo(x, y, d, r, g, b);

  update();
}

function drawGlowHalo(xPos, yPos, diameter, rVal, gVal, bVal) {
  let baseColor = color(rVal, gVal, bVal);

  for (let i = glowLayers; i > 0; i--) {
    let progress = map(i, glowLayers, 1, 0, 1);

    let currentDiameter = d * map(progress, 0, 1, 2.0, 0.1);
    let mixedColor = lerpColor(baseColor, color(255), progress);

    let alphaValue = map(progress, 0, 1, 5, 200);

    fill(red(mixedColor), green(mixedColor), blue(mixedColor), alphaValue);
    ellipse(xPos, yPos, currentDiameter);
  }
}

function update() {
  // Move positions
  x += xDir;
  y += yDir;

  waveTimer += 0.02;

  r = map(sin(waveTimer), -1, 1, 0, 255);
  g = map(sin(waveTimer + TWO_PI / 3), -1, 1, 0, 255);
  b = map(sin(waveTimer + (TWO_PI * 2) / 3), -1, 1, 0, 255);

  let minSize = 40;
  let maxSize = min(width, height) * 0.25;
  d = map(sin(waveTimer), -1, 1, minSize, maxSize);

  keepInCanvas();
}

function keepInCanvas() {
  let radius = d / 2;

  if (x + radius > width) {
    x = width - radius;
    xDir = -xDir;
  } else if (x - radius < 0) {
    x = radius;
    xDir = -xDir;
  }
  if (y + radius > height) {
    y = height - radius;
    yDir = -yDir;
  } else if (y - radius < 0) {
    y = radius;
    yDir = -yDir;
  }
}
