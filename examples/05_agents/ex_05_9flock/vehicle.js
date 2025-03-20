// The nature of Code
// Daniel Platt
// Vehicle Class:

class Vehicle {
  constructor(x, y, color) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-10, 1),random(-10, 10) );
    this.accel = createVector();
    this.mass = 1.0;
    this.radius = 8.0;
    this.maxSpeed = 200;
    this.maxForce = 200;
    this.timer = 0;
    this.color = color;
    this.wanderTheta = 0;
  }

  run(boids) {
    this.flock(boids);
    this.update();
    this.edges();
    this.show();
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
  flock(boids) {
    let separation = this.separate(boids);
    let alignment = this.align(boids);
    let cohesion = this.cohere(boids);
    separation.mult(3.1);
    alignment.mult(1.0);
    cohesion.mult(2.0);

    this.applyForce(separation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }

  separate(boids) {
    let desiredSeparation = 25;
    let steer = createVector(0,0);
    let sum = createVector();
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (this !== other && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.setMag(1 / d);
        steer.add(diff);
        count++;
      }
      loopCount++;
    }
    if (count > 0) {
      steer.setMag(this.maxSpeed)
      steer.sub(this.velocity);
      steer.limit(this.maxForce);
    }
    return steer;
  }
  align(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((this !== other) && (d < neighborDistance)) {
        sum.add(other.velocity);
        count++;
      }
      loopCount++;
    }
    if (count > 0 ){
      sum.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxForce)
      return steer;
    } else {
      return createVector(0,0);
    }
  } 
  cohere(boids) {
    let neighborDistance = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if ((this !== other) && (d < neighborDistance)) {
        sum.add(other.position);
        count++;
      }
      loopCount++;
    }
    if (count > 0 ){
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0,0);
    }
  } 

  wander() {
    let wanderR = 50;
    let wanderD = 50;
    let change = 0.3;
    this.wanderTheta += random(-change, change);

    let circlePos = this.velocity.copy();
    circlePos.normalize();
    circlePos.mult(wanderD);
    circlePos.add(this.position);

    let h = this.velocity.heading();

    let circleOffSet = createVector(
      wanderR * cos(this.wanderTheta + h),
      wanderR * sin(this.wanderTheta + h)
    )
    let target = p5.Vector.add(circlePos, circleOffSet);
    let steer = this.seek(target);
    this.applyForce(steer);

    if (debug){
      this.drawWanderStuff(this.position, circlePos, target, wanderR);
    }
  }

  drawWanderStuff(location, circlePos, target, rad){
    push();
    stroke(0);
    noFill();
    strokeWeight(1);
    circle(circlePos.x, circlePos.y, rad*2);
    circle(target.x, target.y, 4);
    line(location.x, location.y, circlePos.x, circlePos.y);
    line(circlePos.x, circlePos.y, target.x, target.y);
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
  edges() {
    if(this.position.x < -this.radius*2) {
      this.position.x = width + this.radius*2;
    }
    if(this.position.x > width + this.radius*2) {
      this.position.x = -this.radius*2;
    }
    if(this.position.y < -this.radius*2) {
      this.position.y = height + this.radius*2;
    }
    if(this.position.y > height + this.radius*2) {
      this.position.y = -this.radius*2;
    }
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

class Flock {
  constructor() {
    this.boids = [];
  }
  run() {
    for (let boid of this.boids) {
      boid.run(this.boids);
    }
  }
  addBoid(boid) {
    this.boids.push(boid);
  }
}
