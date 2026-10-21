let numBalls = 25;
let minRadiusFactor = 0.02;
let maxRadiusFactor = 0.06;
let glowLayers = 40;
let repelRadius = 30;
let balls = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // intiialize glowing balls
  balls = [];
  for (let i = 0; i < numBalls; i++) {
    balls.push(makeBall());
  }
}

function draw() {
  background(0);
  noStroke();

  // update physics
  for (let i = 0; i < balls.length; i++) {
    balls[i].mouseRepel();
    balls[i].update();
    for (let j = i + 1; j < balls.length; j++) {
      collideBalls(balls[i], balls[j]);
    }
  }
  // draw all glowing balls
  for (let ball of balls) {
    ball.drawGlowingBall();
  }
}

function getRandomColor() {
  colorMode(HSB, 360, 100, 100);
  let col = color(random(360), random(80, 100), random(80, 100));
  colorMode(RGB, 255);
  return color(red(col), green(col), blue(col));
}

class Ball {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(2, 5)); // random speed
    this.r = r;
    this.col = getRandomColor();
    this.mass = r * r;
  }

  mouseRepel() {
    let mousePos = createVector(mouseX, mouseY);
    let dir = p5.Vector.sub(this.pos, mousePos); // get a direction away from mouse
    let dist = dir.mag(); // distance away;

    // harddcode a larger radius here so it's actually noticeable
    let interactionRadius = 150;
    if (dist < interactionRadius && dist > 0) {
      dir.normalize(); // unit dir
      let pushForce = map(dist, 0, interactionRadius, 3, 0);
      this.vel.add(p5.Vector.mult(dir, pushForce));
      // cap the maximum velocity so they don't accelerate to infinity
      this.vel.limit(15);
    }
  }

  update() {
    // Update position
    this.pos.add(this.vel);
    let bounce = false;
    if (this.pos.x - this.r < 0) {
      // bounce off left wall
      this.pos.x = this.r;
      this.vel.x *= -1;
      bounce = true;
    } else if (this.pos.x + this.r > width) {
      //bounce off right wall
      this.pos.x = width - this.r;
      this.vel.x *= -1;
      bounce = true;
    }

    if (this.pos.y - this.r < 0) {
      // bounce of bottom wall
      this.pos.y = this.r;
      this.vel.y *= -1;
      bounce = true;
    } else if (this.pos.y + this.r > height) {
      // bounce off top wall
      this.pos.y = height - this.r;
      this.vel.y *= -1;
      bounce = true;
    }
    if (bounce) {
      this.col = getRandomColor();
    }
  }

  drawGlowingBall() {
    for (let i = glowLayers; i > 0; i--) {
      let progress = map(i, glowLayers, 1, 0, 1);
      let currentDiameter = this.r * 2 * map(progress, 0, 1, 2.0, 0.1);

      let mixedColor = lerpColor(this.col, color(255), progress);
      let alphaValue = map(progress, 0, 1, 5, 200);

      // create rippling clowing effect with sin
      let wave = map(
        sin(frameCount * 0.1 + progress * TWO_PI),
        -1,
        1,
        0.3,
        1.5,
      );

      fill(
        red(mixedColor),
        green(mixedColor),
        blue(mixedColor),
        alphaValue * wave,
      );
      ellipse(this.pos.x, this.pos.y, currentDiameter);
    }
  }
}

function collideBalls(b1, b2) {
  let delta = p5.Vector.sub(b2.pos, b1.pos);
  let dist = delta.mag();

  if (dist < b2.r + b1.r && dist > 0) {
    //close enough to collide

    // find how much they overlap and separate them
    let overlap = b2.r + b1.r - dist;
    let n = delta.copy().normalize();
    b1.pos.sub(p5.Vector.mult(n, overlap));
    b2.pos.add(p5.Vector.mult(n, overlap));

    // collision physics
    // adapted from https://www.101computing.net/elastic-collision-in-a-pool-game/
    let relativeVel = p5.Vector.sub(b2.vel, b1.vel);
    let velAlongNormal = p5.Vector.dot(relativeVel, n);

    if (velAlongNormal < 0) {
      let impulse = -(2 * velAlongNormal) / (b1.mass + b2.mass);
      let impulseVector = p5.Vector.mult(n, impulse);

      b1.vel.sub(p5.Vector.mult(impulseVector, b2.mass));
      b2.vel.add(p5.Vector.mult(impulseVector, b1.mass));
      b1.col = getRandomColor();
      b2.col = getRandomColor();
    }
  }
}

function makeBall() {
  let minR = max(min(width, height) * minRadiusFactor, 10);
  let maxR = max(min(width, height) * maxRadiusFactor, 25);
  let r = random(minR, maxR);

  let x = random(r, width - r);
  let y = random(r, height - r);

  return new Ball(x, y, r);
}
