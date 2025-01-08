// The Nature of Code
// Daniel Platt
// Chapter 1: Bouncing ball with vector veclocity

class Ball {
  constructor(x,y, z, radius) {
    this.position = createVector(x, y, z);
    this.velocity = createVector(random(-5,5), random(-5,5), random(-5,5));
    this.radius = radius;
    this.rotateDy = random(-0.05,0.05);
  }
  update() {
    this.position.add(this.velocity);
    this.rotateDy += 0.03
  }
  show() {
    push()
    stroke(0);
    strokeWeight(1);
    fill(175);
    translate(this.position.x, this.position.y, this.position.z);
    rotateY(this.rotateDy);
    rotateX(this.rotateDy*2);
    sphere(this.radius, 5, 5);
    pop()
  }
  checkEdges() {
    if (this.position.x + this.radius > width/2 || this.position.x - this.radius < -width/2) {
      this.velocity.x *= -1;
    }
    else if (this.position.y + this.radius > height/2 || this.position.y - this.radius < -height/2) {
      this.velocity.y *= -1;
    }
    else if (this.position.z + this.radius > 0 || this.position.z - this.radius < -width/2) {
      this.velocity.z *= -1;
    }
  }
}
let ball;
// let ball1;

function setup() {
  frameRate(30);
  createCanvas(600, 350, WEBGL);
  ball = new Ball(0,0, -50, 20);
  // ball1 = new Ball(50,100, 10);
}

function draw() {
  orbitControl();
  background(210);
  noFill();
  push();
  stroke(0);
  strokeWeight(3);
  translate(0,0,-width/4)
  box(width, height, width/2);
  pop();
  // Enable orbiting with the mouse
  ball.update();
  ball.checkEdges();
  ball.show();
  // ball1.update();
  // ball1.checkEdges();
  // ball1.show();
}

