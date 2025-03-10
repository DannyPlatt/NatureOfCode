// The nature of Code
// Daniel Platt
// Vehicle Class:

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-10,10), random(-10,10));
    this.accel = createVector();
    this.mass = 1.0;
    this.radius = 4.0;
    this.maxSpeed = 300 + random(-100, 100);
    this.maxForce = 650 + random(-100, 100);
    this.timer = 0;
    this.color = [random(0,255), random(0,255), random(0,255)];
    this.count = 0;
  }

  update() {
    // Update linear motion
    let timeAccel = this.accel.copy(); // technically unecissary as accel is zeroed later
    this.velocity.add(timeAccel.mult(deltaTime)); // Vel += Accel * deltaTime
    let timeVel = this.velocity.copy(); // Copy to prevent modifying vector
    this.position.add(timeVel.mult(deltaTime)); //Pos+= Vel * deltaTime * pxPerMeter
    this.accel.mult(0); 
  }

  seek(target) {
    // if the object is behind the vehicle, it doesn't see it:
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed)
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.mult(2).limit(this.maxForce);
    this.applyForce(steer);
  }

  show() {
    let angle = this.velocity.heading();
    fill(this.color[0], this.color[1], this.color[2]);
    push();
    translate(this.position.x, this.position.y);
    push()
    rotate(angle);
    beginShape();
    vertex(this.radius *2, 0);
    vertex(-this.radius * 2, -this.radius);
    vertex(-this.radius * 2, this.radius);
    stroke(0);
    strokeWeight(1)
    endShape(CLOSE);
    pop();
    stroke(0);
    strokeWeight(2);
    fill(255);
    text(this.count, 5,-5); // draw score
    pop();
  }

  applyForce(force) {
    this.accel.add(p5.Vector.div(force,this.mass));
  }
  run() {
    // Handles update(), show(), and applyForce(). This is useful for particle systems
    this.update();
    this.show();
  }

}
