// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Mover {
  constructor(x,y, mass, radius) {
    this.position = createVector(x, y);
    this.velocity = createVector(0,0);
    this.acceleration = createVector(0,0);
    this.radius = radius;
    this.mass = mass;
  }
  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }
  update() {
    this.velocity.add(this.acceleration);
    if(this.velocity < 0.1) {
      this.velocity = 0;
    }
    this.position.add(this.velocity);
    // clear acceleration vector after applied
    this.acceleration.mult(0);

  }
  show() {
    fill(255);
    stroke(0);
    strokeWeight(1);
    // circle(this.position.x, this.position.y, this.radius * 2);
    rect(this.position.x, this.position.y, this.radius, this.radius, 4);
  }
  checkEdges() {
    const bounce = -0.98;
    if (this.position.x + this.radius > width) {
      this.position.x = width - this.radius;
      this.velocity.x *= bounce;
    } else if (this.position.x - this.radius < 0){
      this.position.x = this.radius;
      this.velocity.x *= bounce;
    }
    if (this.position.y + this.radius > height) {
      this.position.y = height- this.radius;
      this.velocity.y *= bounce;
    } else if (this.position.y - this.radius < 0){
      this.position.y = this.radius;
      this.velocity.y *= bounce;
    }
  }
  isOffScreen() {
    return this.position.x+this.radius<0 || this.position.x-this.radius>width || 
        this.position.y+this.radius<0 || this.position.y-this.radius > height
  }
}
