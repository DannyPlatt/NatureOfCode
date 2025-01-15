// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Mover {
  constructor(x,y,radius) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-5,5), random(-5,5));
    this.acceleration = createVector(0,0);
    this.radius = radius;
    this.mass = this.radius;
  }
  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass)).limit(5);
  }
  applyGravity(force) {
    this.acceleration.add(force).limit(5);

  }
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.checkEdges();
    // clear acceleration vector after applied
    this.acceleration.mult(0);

  }
  show() {
    fill(200, map(this.position.y,0,height,300,0),map(this.position.x,0,width,300,0));
    // circle(this.position.x, this.position.y, this.radius * 2);
    vertex(this.position.x, this.position.y);
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
}
