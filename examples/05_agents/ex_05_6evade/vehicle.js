// The nature of Code
// Daniel Platt
// Vehicle Class:

class Vehicle {
  constructor(x, y, color) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.accel = createVector();
    this.mass = 1.0;
    this.radius = 8.0;
    this.maxSpeed = 400;
    this.maxForce = 600;
    this.timer = 0;
    this.color = color;
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

  evade(vehicle) {
    let steer = this.pursuit(vehicle).mult(-1);
    return steer;
  }

  pursuit(vehicle) {
    let searchRadius = 200;
    let target = vehicle.position.copy();
    let velocity = vehicle.velocity.copy().mult(0.5);
    let pursue = p5.Vector.add(target, velocity);
    let distance = p5.Vector.dist(this.position, vehicle.position);
    let mapping = map(distance, 0, searchRadius, 0, 1, true);
    target.lerp(pursue, mapping);
    let steer = this.seek(target);
    // draw location of pursuit
    push();
    fill(this.color[0], this.color[1], this.color[2]);
    circle(target.x, target.y, 10);
    pop();
    return steer;
  }

  seek(target) { // target: position vector
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.setMag(this.maxForce);
    return steer
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

class Target extends Vehicle {
  constructor(x, y, color) {
    super(x, y, color);
    this.velocity = createVector(random(-200, 200), random(-200, 200));
    this.radius = 4;
  }
  edges() {
    if(this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if(this.position.x > width) {
      this.velocity.x *= -1;
      this.position.x = width;
    }
    if(this.position.y < 0) {
      this.velocity.y *= -1;
      this.position.y = 0;
    }
    if(this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
  }
}
