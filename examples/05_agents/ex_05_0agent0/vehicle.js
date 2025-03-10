// The nature of Code
// Daniel Platt
// Vehicle Class:

class Vehicle {
  constructor(x, y, seek, color) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.accel = createVector();
    this.mass = 1.0;
    this.radius = 4.0;
    this.maxSpeed = 300;
    this.maxForce = 600;
    this.timer = 0;
    this.color = color;
    this.seekType = seek;
  }

  update() {
    // Update linear motion
    let timeAccel = this.accel.copy(); // technically unecissary as accel is zeroed later
    this.velocity.add(timeAccel.mult(deltaTime)); // Vel += Accel * deltaTime
    this.velocity.limit(this.maxSpeed);
    let timeVel = this.velocity.copy(); // Copy to prevent modifying vector
    this.position.add(timeVel.mult(deltaTime)); //Pos+= Vel * deltaTime * pxPerMeter
    this.accel.mult(0); 
  }

  seek(target) {
    let steer;
    if (this.seekType > 0) {
      let desired = p5.Vector.sub(target, this.position);
      desired.setMag(this.maxSpeed);
      steer = p5.Vector.sub(desired, this.velocity);
      steer.setMag(this.maxForce);
      this.applyForce(steer);
    } else {
    let desired = p5.Vector.sub(target, this.position);
    steer = desired.mult(4)
    this.applyForce(steer);
    this.velocity.limit(this.maxSpeed);
    }
    push();
    translate(this.position.x, this.position.y);
    stroke(255,50,50);
    strokeWeight(4);
    line(0,0, steer.x, steer.y);
    pop();
  }

  show() {
    let angle = this.velocity.heading();
    fill(this.color[0], this.color[1], this.color[2]);
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
    this.accel.add(p5.Vector.div(force,this.mass));
  }
  run() {
    // Handles update(), show(), and applyForce(). This is useful for particle systems
    this.update();
    this.show();
  }

}
