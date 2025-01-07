// The Nature of Code
// Daniel Platt
// Chapter 1: Bouncing ball with vector veclocity

class Ball {
  constructor(x,y, z, radius) {
    this.position = createVector(x, y, z);
    this.velocity = createVector(random(-5,5), random(-5,5), random(-5,5));
    this.radius = radius;
    this.rotateDy = 0;
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
    sphere(this.radius, 5, 5);
    pop()
  }
  checkEdges() {
    console.log(this.position.z);
    console.log(this.velocity.z);
    if (this.position.x + this.radius > width/2 || this.position.x - this.radius < -width/2) {
      console.log("flipping velocity");
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
  createCanvas(600, 350, WEBGL);
  ball = new Ball(0,0, -50, 20);
  // ball1 = new Ball(50,100, 10);
}

function draw() {
  background(210);
  fill(255);
  stroke(0);
  strokeWeight(3);
  box(width, height, width);
  // Enable orbiting with the mouse
  orbitControl();
  ball.update();
  ball.checkEdges();
  ball.show();
  // ball1.update();
  // ball1.checkEdges();
  // ball1.show();
}

