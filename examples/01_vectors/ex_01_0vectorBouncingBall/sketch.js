// The Nature of Code
// Daniel Platt
// Chapter 1: Bouncing ball with vector veclocity

class Ball {
  constructor(x,y,radius) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-5,5), random(-5,5));
    this.radius = radius;
  }
  update() {
    this.position.add(this.velocity);
  }
  show() {
    stroke(0);
    fill(175);
    circle(this.position.x, this.position.y, this.radius * 2);
  }
  checkEdges() {
    if (this.position.x + this.radius > width || this.position.x - this.radius < 0) {
      this.velocity.x *= -1;
    }
    else if (this.position.y + this.radius > height || this.position.y - this.radius < 0) {
      this.velocity.y *= -1;
    }
  }
}
let ball;
let ball1;

function setup() {
  createCanvas(600, 350);
  frameRate(30);
  ball = new Ball(100,50, 15);
  ball1 = new Ball(50,100, 10);
}

function draw() {
  background(210);
  strokeWeight(0);
  fill(0);
  text ("fps: " + round(frameRate()), 10,20);
  strokeWeight(1);
  ball.update();
  ball.checkEdges();
  ball.show();
  ball1.update();
  ball1.checkEdges();
  ball1.show();
}

