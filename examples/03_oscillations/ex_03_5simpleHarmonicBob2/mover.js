// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Mover {
  constructor(x,y, yFrequency, yAmplitude, xFrequency, xAmplitude) {
    // linear motion
    this.basePosition = createVector(x, y);
    this.position = createVector(x, y);
    this.velocity = 0;
    this.acceleration = createVector(0,0);
    this.radius = 30;
    this.mass = 30;
    this.color = [200, map(this.mass, 0, 10, 0, 255), 250];
    // angular Motion
    this.yFrequency = yFrequency;
    this.yAmplitude = yAmplitude;
    this.yAngle = 0;
    this.yAngleVel= 0;
    this.xFrequency = xFrequency;
    this.xAmplitude = xAmplitude;
    this.xAngle = 0;
    this.xAngleVel= 0;
    this.angleAccel= 0;
  }
  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }
  update() {
    // Update linear motion
    // let timeAccel = this.acceleration.copy(); // technically unecissary
    // this.velocity.add(timeAccel.mult(deltaTime)); // Vel += Accel * deltaTime
    // let timeVel = this.velocity.copy(); // Copy to prevent modifying vector
    // this.position.add(timeVel.mult(deltaTime)); // Pos += Vel * deltaTime
    // this.acceleration.mult(0); 
    // Update Angular Motion
    this.yAngleVel = TWO_PI*this.yFrequency;
    this.yAngle += this.yAngleVel * deltaTime;
    this.xAngleVel = TWO_PI*this.xFrequency;
    this.xAngle += this.xAngleVel * deltaTime;
    this.angleAccel = 0; // reset accel
    // this.position.y = this.yAmplitude * sin((TWO_PI) * millis()/1000/this.yFrequency) + height/2
    this.position.y = this.yAmplitude * sin(this.yAngle) + height/2;
    this.position.x = this.xAmplitude * sin(this.xAngle) + this.basePosition.x;
  }
  show() {
    push()
    fill(this.color[0], this.color[1], this.color[2], 200 );
    stroke(50);
    strokeWeight(1);
    translate(this.position.x, this.position.y)
    rotate(this.yAngle);
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
