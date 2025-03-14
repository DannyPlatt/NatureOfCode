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
    this.maxSpeed = 200;
    this.maxForce = 800;
    this.timer = 0;
    this.color = color;
    this.wanderTheta = 0;
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

  follow(flow) {
    let desired = flow.lookup(this.position);
    console.log(desired);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.accel.add(p5.Vector.div(force,this.mass));
  }
  run() {
    // Handles update(), show(), and applyForce(). This is useful for particle systems
    this.update();
    this.show();
  }
  edges() {
    if(this.position.x < -5) {
      this.position.x = width + 5;
    }
    if(this.position.x > width + 5) {
      this.position.x = -5;
    }
    if(this.position.y < -5) {
      this.position.y = height + 5;
    }
    if(this.position.y > height + 5) {
      this.position.y = -5;
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

class FlowField {
  constructor() {
    this.resolution = 10;
    this.cols = floor(width/this.resolution);
    this.rows = floor(height/this.resolution);
    this.field = new Array(this.cols);
    this.zoff = 0;
    noiseSeed(random(10000));
    let xoff = 0;
    for (let i = 0; i < this.cols; i++) {
      let yoff = 0;
      this.field[i] = new Array(this.rows);
      for (let j = 0; j < this.rows; j++) {
        let angle = map(noise(xoff, yoff), 0, 1, 0, TWO_PI);
        // let angle = map(random(), 0, 1, 0, TWO_PI);
        this.field[i][j] = p5.Vector.fromAngle(angle);
        yoff += 0.1;
      }
      xoff += 0.1;
    }
  }
  lookup(position) { // position is the location of the vehicle
    // reutrs the unit direction vector to be used in velocity
    let column = constrain(floor(position.x / this.resolution), 0, this.cols - 1);
    let row = constrain(floor(position.y / this.resolution), 0, this.rows - 1);
    return this.field[column][row].copy();
  }

  draw() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        push();
        noFill()
        translate(i * this.resolution + this.resolution/2, j * this.resolution + this.resolution/2);
        line(0, 0, this.field[i][j].x * this.resolution, this.field[i][j].y*this.resolution);
        circle(this.field[i][j].x, this.field[i][j].y, 2);
        pop();
      }
    }
  }
}

