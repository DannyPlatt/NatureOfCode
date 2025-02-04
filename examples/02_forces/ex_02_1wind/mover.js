// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Mover {
  constructor(x,y,radius) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-50,50), random(-50,50));
    this.acceleration = createVector(0,0);
    this.radius = radius;
    this.mass = this.radius;
  }
  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }
  applyGravity(force) {
    this.acceleration.add(force).limit(5);

  }
  update() {
    // useing Delta time, where V = acceleration * deltaTime
    let timeAccel = p5.Vector.copy(this.acceleration);
    timeAccel.mult(deltaTime); 
    this.velocity.add(timeAccel);
    let timeVel = p5.Vector.copy(this.velocity);
    timeVel.mult(deltaTime); 
    this.position.add(timeVel);
    this.checkEdges();
    // clear acceleration vector after applied
    this.acceleration.mult(0);

  }
  show() {
    stroke(0);
    fill(map(this.mass,5,20,255,0),0,150);
    circle(this.position.x, this.position.y, this.radius * 2);
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
