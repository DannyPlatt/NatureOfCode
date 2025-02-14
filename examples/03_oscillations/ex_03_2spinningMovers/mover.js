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
    this.radius = mass;
    this.mass = mass;
    this.color = [200, map(this.mass, 0, 10, 0, 255), 250];
    // angular Motion
    this.angle = 0;
    this.angleVel= 0;
    this.angleAccel= 0;
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
    line(-this.radius, 0, this.radius, 0);
    line(0, -this.radius, 0, this.radius );
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
