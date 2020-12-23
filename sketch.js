var grains = [];
var affect = 0.4;
var effect = 0.6;

function setup() {
  createCanvas(500, 500);
  colorMode(HSB, 1);
  rectMode(CENTER)
  noFill();
  noStroke();

  var grainNum = 100;
  for (var i = 0; i < grainNum; i++) {
    grains.push(new Grain(random(width), random(width), TWO_PI * random(1), random(2)));
  }

  background(0);
  loadPixels();
}

function draw() {
  runGrains(1);
}

function runGrains(speed) {
  for (var i = 0; i < speed; i++) {
    for (var grain of grains) {
      grain.move();
      grain.affectAndEffect();
    }
  }

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

    if (checkArrayEquality(get(this.pos.x, this.pos.y), [0, 0, 0, 255])) {
      stroke(this.dir / TWO_PI, 1, 1);
      point(this.pos.x, this.pos.y);
    }
    else {
      stroke(newHue, 1, 1);
      point(this.pos.x, this.pos.y);
      this.dir = newDir;
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

function checkArrayEquality(array1, array2) {
  return array1.length === array2.length && array1.every(function (value, index) { return value === array2[index] });
}