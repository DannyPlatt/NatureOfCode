// The Nature of Code
// Danny Platt
// use perlin noise to adjust the step size of the walker

let walker;
let x= 0;

function setup() {
  createCanvas(600, 400);
  walker = new Walker();
}

function draw() {
  background(200, 10);
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.xoff = 0
  }

  show() {
    stroke(1);
    strokeWeight(2);
    circle(this.x, this.y, 10);
  }

  step() {
    const stepSize = map(noise(this.xoff), 0, 1, 0, 10);
    this.xoff += 0.005
    const choice = floor(random(4));
    if (choice == 0) {
      this.x += stepSize;
    } else if (choice == 1) {
      this.x -= stepSize;
    } else if (choice == 2) {
      this.y += stepSize;
    } else {
      this.y -= stepSize;
    }
  }
}
