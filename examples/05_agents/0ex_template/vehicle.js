// The nature of Code
// Daniel Platt
// Vehicle Class:

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.accel = createVector();
    this.mass = 1.0;
    this.radius = 4.0;
    this.maxSpeed = 8;
    this.maxForce = 0.2;
  }

  update() {
    // Update linear motion
    let timeAccel = this.acceleration.copy(); // technically unecissary as accel is zeroed later
    this.velocity.add(timeAccel.mult(deltaTime)); // Vel += Accel * deltaTime
    let timeVel = this.velocity.copy(); // Copy to prevent modifying vector
    this.position.add(timeVel.mult(deltaTime * pxPerMeter)); //Pos+= Vel * deltaTime * pxPerMeter
    this.acceleration.mult(0); 
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed)
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  show() {
    let angle = this.velocity.heading();
    fill(127);
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(this.radius *2, 0);
    vertex(-this.radius * 2, -this.radius);
    vertex(-this.radius * 2, this.radius);
    endShape(CLOSE);
    pop();
  }

  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }
  run() {
    // Handles update(), show(), and applyForce(). This is useful for particle systems
    this.update();
    this.show();
  }

}
