var grains = [];
var effect = 0.5;
var img;

function preload() {
  img = loadImage('csir.jpg');
}

function setup() {
  createCanvas(img.width, img.height);
  colorMode(HSB, 1);
  rectMode(CENTER)
  noFill();
  noStroke();

  var grainNum = 600;
  for (var i = 0; i < grainNum; i++) {
    grains.push(new Grain());
  }

  image(img, 0, 0);
  loadPixels();
}

function draw() {
  runGrains(1);
}

function runGrains(speed) {
  for (var i = 0; i < speed; i++) {
    for (var grain of grains) {
      grain.move(false);
      grain.effect();
    }
  }
}

class Grain {
  constructor() {
    this.regenerate();
  }

  regenerate() {
    var a = random(TAU);
    var r = random(700);
    this.x = width * 0.5 + r * cos(a);
    this.y = height * 0.5 + r * sin(a);
    this.dir = getHue(this.x,this.y)*TAU;
    this.vel = 1;
  }

  move(torus) {
    if (torus) {
      this.x = (width + this.x + this.vel * cos(this.dir)) % width;
      this.y = (height + this.y + this.vel * sin(this.dir)) % height;
    }
    else {
      this.x += this.vel * cos(this.dir);
      this.y += this.vel * sin(this.dir);
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.regenerate();
      }
    }
  }

  effect() {
    stroke(this.dir/TAU,0.8,1, 0.09);
    point(this.x, this.y);
    this.dir = weightedCircularMean(this.dir, getHue(this.x, this.y) * TAU, effect);
  }
}

function weightedCircularMean(d1, d2, w2) {
  return ((1 - w2) * d1 + w2 * d2 + PI * floor(abs(d2 - d1) / PI)) % TAU;
}

function getHue(x, y) {
  colorMode(RGB, 255);
  var h = hue(color(get(x, y))) / 360;
  colorMode(HSB, 1);
  return h;
}

function getImgHue(x, y) {
  colorMode(RGB, 255);
  var h = hue(color(img.get(x, y))) / 360;
  colorMode(HSB, 1);
  return h;
}

function getImgSat(x, y) {
  colorMode(RGB, 255);
  var s = saturation(color(img.get(x, y))) / 100;
  colorMode(HSB, 1);
  return s;
}

function getImgBrg(x, y) {
  colorMode(RGB, 255);
  var b = brightness(color(img.get(x, y))) / 100;
  colorMode(HSB, 1);
  return b;
}

function checkArrayEquality(array1, array2) {
  return array1.length === array2.length && array1.every(function (value, index) { return value === array2[index] });
}