var grains = [];
var affect = 0.4;
var effect = 0.6;

function setup() {
  createCanvas(500,500);
  colorMode(HSB, 1);
  rectMode(CENTER)
  noFill();
  noStroke();

  var grainNum = 4;
  for (var i = 0; i < grainNum; i++) {
    grains.push(new Grain(random(width), random(width), TWO_PI*random(1), random(2)));
  }

  background(0);
  loadPixels();
}

function draw() {
  runGrains(5000);
}

function runGrains(speed) {
  loadPixels();
  for (var i = 0; i < speed; i++) {
    for (var grain of grains) {
      grain.move();
      grain.affectAndEffect();
    }
  }
  updatePixels();
}

class Grain {
  constructor(xPos, yPos, dir, vel) {
    this.pos = createVector(xPos, yPos);
    this.dir = dir;
    this.vel = vel;
  }

  move() {
    this.pos.x = (width + this.pos.x + this.vel * cos(this.dir)) % width;
    this.pos.y = (height + this.pos.y + this.vel * sin(this.dir)) % height;
  }

  affectAndEffect() {
    var currentHue = getHue(this.pos.x, this.pos.y);
    var newHue = weightedCircularMean(currentHue * TWO_PI, this.dir, affect) / TWO_PI;
    var newDir = weightedCircularMean(this.dir, currentHue * TWO_PI, effect);

    if (currentHue != 0) {
      set(this.pos.x, this.pos.y, color(newHue, 1, 1));
      this.dir = newDir;
    }
    else {
      set(this.pos.x, this.pos.y, color(this.dir / TWO_PI, 1, 1));
    }
  }
}

function weightedCircularMean(d1, d2, w2) {
  return ((1 - w2) * d1 + w2 * d2 + PI * floor(abs(d2 - d1) / PI)) % TWO_PI;
}

function getHue(x, y) {
  colorMode(RGB, 255);
  var h = hue(color(get(x, y))) / 360;
  colorMode(HSB, 1);
  return h;
}