// The nature of Code

// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Mover {
  constructor(x,y, mass, velocity) {
    // linear motion
    this.position = createVector(x, y);
    this.velocity = velocity;
    this.acceleration = createVector(0,0);
    this.radius = mass * 4;
    this.mass = mass;
    this.color = [200, map(this.mass, 0, 10, 0, 255), 250];
    // angular Motion
    this.angle = 0;
    this.angleVel= 0;
    this.angleAccel= 0
  }
  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }
  update() {
    // Update linear motion
    let timeAccel = this.acceleration.copy(); // technically unecissary
    this.velocity.add(timeAccel.mult(deltaTime)); // Vel += Accel * deltaTime
    let timeVel = this.velocity.copy(); // Copy to prevent modifying vector
    this.position.add(timeVel.mult(deltaTime)); // Pos += Vel * deltaTime
    this.acceleration.mult(0); 
    // Update Angular Motion
    this.angleVel += (this.angleAccel* deltaTime);
    this.angle += this.angleVel * deltaTime;
    this.angleAccel = 0; // reset accel
  }
  show() {
    push()
    fill(this.color[0], this.color[1], this.color[2], 200 );
    stroke(50);
    strokeWeight(1);
    translate(this.position.x, this.position.y)
    rotate(this.angle);
    circle(0 , 0, this.radius * 2);
    pop();
  }
  attract(mover) {
    // calculate direction of force
    let force = p5.Vector.sub(this.position, mover.position);
    let distance = force.mag();
    // limit the distance to eliminate extreme results
    distance = constrain(distance, 5, 50);
    // calc grav force
    let strength = (gravConst * this.mass * mover.mass) / (distance * distance);
    force.setMag(strength);
    return force;
  }
}

class Wave {
  constructor(x, y, w, amplitude, period) {
    this.xSpacing = 8;
    // width of entire wave
    this.width = w;

    this.origin = createVector(x, y);
    this.theta = 0.0; // Start angle at 0
    this.amplitude = amplitude;
    this.period = period;
    this.dx = (TWO_PI / this.period) * this.xSpacing;
    this.yValues = new Array(floor(this.width / this.xSpacing));
  }
  update() {
    // increment theta
    this.theta += 0.02;
    let x = this.theta;
    for (let i = 0; i< this.yValues.length; i++) {
      this.yValues[i] = sin(x) * this.amplitude;
      x += this.dx;
    }
  }
  show() {
    for (let x = 0; x < this.yValues.length; x++) {
      stroke(0);
      fill(100, 50);
      circle(
        this.origin.x + x * this.xSpacing,
        this.origin.y + this.yValues[x],
        48
      );
    }
  }
}
