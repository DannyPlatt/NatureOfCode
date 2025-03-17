// The nature of Code
// Daniel Platt
// Vehicle Class:

class Boid {
  constructor(x, y, z, color=[1,1,1,1], scale = [1,1,1]) {
    this.position = vec3.fromValues(x, y, z);
    this.velocity = vec3.fromValues(randomFl(-10, 10),randomFl(-10, 10), randomFl(-10, 10));
    this.accel = vec3.create();
    this.scale = vec3.fromValues(scale[0], scale[1], scale[2]);
    this.stateObj = undefined;
    this.mass = 1.0;
    this.radius = 2.0;
    this.maxSpeed = 200;
    this.maxForce = 20;
    this.timer = 0;
    this.color = color;
    this.wanderTheta = 0;
  }

  run(boids) {
    this.flock(boids);
    this.update();
    // this.edges();
    // this.show();
  }

  applyForce(force) {
    // takes vec3 force into it
    var tempForce = vec3.clone(force);
    vec3.scale(tempForce, tempForce, (1/this.mass));
    vec3.add(this.accel, this.accel, tempForce);
  }

  update() {
    vec3.scale(this.accel, this.accel, state.dt);
    vec3.add(this.velocity, this.velocity, this.accel);
    let scaledVel = vec3.create();
    vec3.scale(scaledVel, this.velocity, state.dt);
    vec3.add(this.position, this.position, scaledVel);
    vec3.scale(this.accel, this.accel, 0);
  }

  seek(target) { // target: position vector
    let desired = vec3.sub(vec3.create(), target, this.position);
    vec3.normalize(desired, desired);
    vec3.scale(desired, desired, this.maxSpeed);
    let steer = vec3.sub(vec3.create(),desired, this.velocity);
    vec3.normalize(steer, steer);
    vec3.scale(steer, steer, this.maxForce);
    return steer
  }

  flock(boids) {
    let separation = this.separate(boids);
    let alignment = this.align(boids);
    let cohesion = this.cohere(boids);
    vec3.scale(separation, separation,1.0);
    vec3.scale(alignment, alignment,1.1);
    vec3.scale(cohesion, cohesion,1.3);

    this.applyForce( separation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
  }

  separate(boids) {
    let desiredSeparation = 25;
    let steer = vec3.create();
    let sum = vec3.create();
    let count = 0;
    for (let other of boids) {
      let d = vec3.sqrDist(this.position, other.position);
      if (this !== other && d < desiredSeparation) {
        let diff = vec3.sub(vec3.create(),this.position, other.position);
        vec3.normalize(diff, diff);
        if (d === 0){d = 0.001;}
        vec3.scale(diff, diff, 1/d);
        vec3.add(steer, steer, diff);
        count++;
      }
    }
    if (count > 0) {
      vec3.normalize(steer, steer);
      vec3.scale(steer, steer, this.maxSpeed);
      vec3.sub(steer, steer, this.velocity);
      limit(steer, this.maxForce);
    }
    return steer;
  }
  align(boids) {
    let neighborDistance = 50;
    let sum = vec3.create();
    let count = 0;
    for (let other of boids) {
      let d = vec3.sqrDist(this.position, other.position);
      if ((this !== other) && (d < neighborDistance)) {
        vec3.add(sum, sum, other.position);
        count++;
      }
    }
    if (count > 0 ){
      vec3.normalize(sum, sum);
      vec3.scale(sum, sum, this.maxSpeed);
      let steer = vec3.sub(vec3.create(),sum, this.velocity);
      limit(steer, this.maxForce)
      return steer;
    } else {
      return vec3.create();
    }
  } 
  cohere(boids) {
    let neighborDistance = 50;
    let sum = vec3.create();
    let count = 0;
    for (let other of boids) {
      let d = vec3.sqrDist(this.position, other.position);
      if ((this !== other) && (d < neighborDistance)) {
        vec3.add(sum, sum, other.position);
        count++;
      }
    }
    if (count > 0 ){
      vec3.scale(sum, sum, 1/count);
      return this.seek(sum);
    } else {
      return vec3.create();
    }
  } 

  // wander() {
  //   let wanderR = 50;
  //   let wanderD = 50;
  //   let change = 0.3;
  //   this.wanderTheta += random(-change, change);
  //
  //   let circlePos = this.velocity.copy();
  //   circlePos.normalize();
  //   circlePos.mult(wanderD);
  //   circlePos.add(this.position);
  //
  //   let h = this.velocity.heading();
  //
  //   let circleOffSet = createVector(
  //     wanderR * cos(this.wanderTheta + h),
  //     wanderR * sin(this.wanderTheta + h)
  //   )
  //   let target = p5.Vector.add(circlePos, circleOffSet);
  //   let steer = this.seek(target);
  //   this.applyForce(steer);
  //
  //   if (debug){
  //     this.drawWanderStuff(this.position, circlePos, target, wanderR);
  //   }
  // }
  //
  // drawWanderStuff(location, circlePos, target, rad){
  //   push();
  //   stroke(0);
  //   noFill();
  //   strokeWeight(1);
  //   circle(circlePos.x, circlePos.y, rad*2);
  //   circle(target.x, target.y, 4);
  //   line(location.x, location.y, circlePos.x, circlePos.y);
  //   line(circlePos.x, circlePos.y, target.x, target.y);
  //   pop();
  // }
  //
  // show() {
  //   let angle = this.velocity.heading();
  //   fill(this.color[0], this.color[1], this.color[2]);
  //   stroke(0);
  //   push();
  //   translate(this.position.x, this.position.y);
  //   rotate(angle);
  //   beginShape();
  //   vertex(this.radius *2, 0);
  //   vertex(-this.radius * 2, -this.radius);
  //   vertex(-this.radius * 2, this.radius);
  //   endShape(CLOSE);
  //   pop();
  // }

  edges(state) {
    // X
    if(this.position.x < -this.radius*2) {
      this.position.x = state.canvasWidth + this.radius*2;
    }
    if(this.position.x > state.canvasWidth + this.radius*2) {
      this.position.x = -this.radius*2;
    }
    // Y
    if(this.position.y < -this.radius*2) {
      this.position.y = state.canvasHeight + this.radius*2;
    }
    if(this.position.y > state.canvasHeight + this.radius*2) {
      this.position.y = -this.radius*2;
    }
    // Z
    if(this.position.z < -this.radius*2) {
      this.position.z = state.canvasDepth+ this.radius*2;
    }
    if(this.position.z > state.canvasDepth+ this.radius*2) {
      this.position.z = -this.radius*2;
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

function limit(vec, maxLength) {
    let len = vec3.length(vec);
    if (len > maxLength) {
        vec3.normalize(vec, vec);
        vec3.scale(vec, vec, maxLength);
    }
}
