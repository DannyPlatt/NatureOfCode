// The nature of Code
// Daniel Platt
// Vehicle Class:

class Vehicle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.accel = createVector();
    this.mass = 1.0;
    this.radius = 8.0;
    this.maxSpeed = 300 + random(-100, 100);
    this.maxForce = 650 + random(-100, 100);
    this.timer = 0;
    this.color = [random(0,255), random(0,255), random(0,255)];
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
    let desired = p5.Vector.sub(target, this.position);
    let distance = desired.mag();
    let radius = 250;
    if (distance < radius) {
      let magnitude = map(distance, 0, radius, 0, this.maxSpeed);
      desired.setMag(magnitude);
    } else {
      desired.setMag(this.maxSpeed);
    }
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.mult(2).limit(this.maxForce);
    this.applyForce(steer);
    // draw the steer vector
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
