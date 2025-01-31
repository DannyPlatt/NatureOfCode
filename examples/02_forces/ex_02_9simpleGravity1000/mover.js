// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Mover {
  constructor(x,y, mass, radius, velocity) {
    this.position = createVector(x, y);
    this.velocity = velocity;
    this.acceleration = createVector(0,0);
    this.radius = radius;
    this.mass = mass;
    this.color = [200, map(radius, 0, 20, 0, 255), 200];
  }
  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    // clear acceleration vector after applied
    this.acceleration.mult(0);

  }
  show() {
    fill(this.color[0], this.color[1], this.color[2] );
    stroke(50);
    strokeWeight(1);
    // circle(this.position.x, this.position.y, this.radius * 2);
    circle(this.position.x, this.position.y, this.radius);
  }
}
