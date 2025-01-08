// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
//    Accleration starts at 0
//    velocity is set randomly

class Mover {
  constructor(x,y,radius) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-5,5), random(-5,5));
    this.acceleration = createVector(0,0);
    this.radius = radius;
  }
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.checkEdges();
  }
  show() {
    stroke(0);
    fill(175);
    circle(this.position.x, this.position.y, this.radius * 2);
  }
  checkEdges() {
    if (this.position.x + this.radius > width || this.position.x - this.radius < 0) {
      this.position.x -= this.velocity.x; // reset the position to ensure it doesn't exit bounds
      this.velocity.x *= -1;
    }
    else if (this.position.y + this.radius > height || this.position.y - this.radius < 0) {
      this.position.y -= this.velocity.y; // reset the position to ensure it doesn't exit bounds
      this.velocity.y *= -1;
    }
  }
}
