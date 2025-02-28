// The nature of Code
// Daniel Platt
// Particle Class:

class Particle{
  constructor(x,y) {
    // linear motion
    this.position = createVector(x, y);
    this.velocity = createVector(.3, -1.1);
    this.acceleration = createVector(0,0);
    this.radius = .5 * pxPerCm;
    this.mass = 10;
    this.lifeTime = 1;
    this.elapsedTime = 0;
    this.color = [200, 10, 250];
    // angular Motion
    this.angle = 0;
    this.angleVel= random(-6, 6);
    this.angleAccel= 0
  }

  isAlive() {
    // checks how long the object has been alive for and 
    // compares to this.lifetime. All time is in seconds
    return this.elapsedTime < this.lifeTime;
  }

  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }

  update() {
    // Update linear motion
    let timeAccel = this.acceleration.copy(); // technically unecissary as accel is zeroed later
    this.velocity.add(timeAccel.mult(deltaTime)); // Vel += Accel * deltaTime
    let timeVel = this.velocity.copy(); // Copy to prevent modifying vector
    this.position.add(timeVel.mult(deltaTime * pxPerMeter)); //Pos+= Vel * deltaTime * pxPerMeter
    this.acceleration.mult(0); 

    // Update Angular Motion
    this.angleVel += (this.angleAccel* deltaTime);
    this.angle += this.angleVel * deltaTime;
    this.angleAccel = 0; // reset accel
    // decrease lifetime
    this.elapsedTime += deltaTime;
  }

  show() {
    push()
    let opacity = map(this.elapsedTime, 0, this.lifeTime, 255, 0);
    fill(this.color[0], this.color[1], this.color[2], 150);
    stroke(50, opacity);
    strokeWeight(2);
    translate(this.position.x, this.position.y)
    rotate(this.angle);
    circle(0, 0, this.radius * 2);
    line(-this.radius, 0, this.radius, 0);
    line(0, -this.radius, 0, this.radius);
    pop();
  }
}
