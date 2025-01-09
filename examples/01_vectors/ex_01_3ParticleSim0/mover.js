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
    // this.color = p5.Vector.random3D().mult(255);
    // this.color = createVector(random(0,255),random(0,255),random(100,200));
    this.color = createVector(0 ,0,random(100,200));
  }
  update() {
    this.velocity.add(this.acceleration.limit(3));
    this.velocity.limit(15);
    this.position.add(this.velocity);
    this.checkEdges();
  }
  show() {
    strokeWeight(0);
    fill(
      this.color.x, 
      this.color.y, 
      this.color.z);
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
