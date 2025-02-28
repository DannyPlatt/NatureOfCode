// The nature of Code
// Daniel Platt
// Particle Class:

class Particle{
  constructor(x,y) {
    // linear motion
    this.position = createVector(x, y);
    this.velocity = createVector(random(-0.5, 0.5), random(-0.5, -1));
    this.acceleration = createVector(0,0);
    this.radius = 1 * pxPerCm;
    this.mass = 10;
    this.lifeTime = 1;
    this.elapsedTime = 0;
    this.color = [50, y, 250];
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

  run() {
    // Handles update(), show(), and applyForce(). This is useful for particle systems
    // However, it prevents us from directly apply force within the sketch code
    this.update();
    this.show();
  }

  update() {
    // Update linear motion
    let timeAccel = this.acceleration.copy(); // technically unecissary as accel is zeroed later
    this.velocity.add(timeAccel.mult(deltaTime)); // Vel += Accel * deltaTime
    let timeVel = this.velocity.copy(); // Copy to prevent modifying vector
    this.position.add(timeVel.mult(deltaTime * pxPerMeter)); //Pos+= Vel * deltaTime * pxPerMeter
    this.acceleration.mult(0); 
    if (this.position.y > height) {
      this.position.y = height - 1;
      this.velocity.y *= -0.90;
    }

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
    fill(this.color[0], this.color[1], this.color[2], opacity);
    stroke(50, opacity);
    strokeWeight(2);
    translate(this.position.x, this.position.y)
    rotate(this.angle);
    circle(0, 0, this.radius * 2);
    // line(-this.radius, 0, this.radius, 0);
    // line(0, -this.radius, 0, this.radius);
    pop();
  }
}

class Emitter {
  constructor(x, y) {
    this.position= createVector(x, y);
    this.particles = [];
    this.lifeTime = 5; // lifespan of emitter
    this.elapsedTime = 0;
    this.particleRate = 200; // Particles per second
    this.particleHz = 1/this.particleRate; // Seconds per Particle
    this.spawnTimer = 0;
  }

  applyForce(force) {
    for (let element of this.particles) {
      element.applyForce(force);
    }
  }
  applyGravity() {
    for (let element of this.particles) {
      let gravity = createVector(0, 9.81 * element.mass);
      element.applyForce(gravity);
    }
  }

  addParticle() {
    this.spawnTimer += deltaTime;
    if (this.spawnTimer > this.particleHz){
      // Each spawn of particle, decrease the spawnTimer by Hz rate
      while(this.spawnTimer > this.particleHz) {
        let selection = random();
        if (selection < 0.5) {
          this.particles.push(new Particle(this.position.x, this.position.y));
        }
        else {
          this.particles.push(new Confetti(this.position.x, this.position.y));
        }
        this.spawnTimer -= this.particleHz;
      }
    }
  }

  run() {
    this.elapsedTime += deltaTime;
    let length = this.particles.length - 1;
    for (let i = length; i >= 0; i--) {
      let particle = this.particles[i];
      particle.run();
      if (!particle.isAlive()) {
        this.particles.splice(i, 1);
      }
    }
  }

  isAlive() {
    // checks how long the object has been alive for and 
    // compares to this.lifetime. All time is in seconds
    return this.elapsedTime < this.lifeTime;
  }
}
