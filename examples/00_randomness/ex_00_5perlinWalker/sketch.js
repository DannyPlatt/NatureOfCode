// The Nature of Code
// Danny Platt
// Using perlin noise as our movement for our walker

let walker;
let x= 0;
let tx = 0;
let ty = 1000;

function setup() {
  frameRate(30);
  createCanvas(600, 400);
  walker = new Walker();
}

function draw() {
  background(210);
  strokeWeight(0);
  text ("fps: " + round(frameRate()), 10,20);
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(1);
    strokeWeight(2);
    circle(this.x, this.y, 10);
  }

  step() {
    this.x = map(noise(tx), 0, 1, 0, width);
    this.y = map(noise(ty), 0, 1, 0, height);
    tx += 0.005;
    ty += 0.005;
  }
}
