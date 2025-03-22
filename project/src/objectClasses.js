// The nature of Code
// Daniel Platt
// Vehicle Class:
class Object {
  constructor( 
    gl,
    position = [0,0,0], 
    velocity = [0,0,0], 
    color=[1,1,1,1], 
    scale = [1,1,1], 
    mass = 1,
    type,
  ) {
    this.position = vec3.fromValues([position[0], position[1], position[2]]);
    this.velocity = vec3.fromValues([velocity[0], velocity[1], velocity[2]]);
    this.accel = vec3.create();
    this.scale = vec3.fromValues(scale[0], scale[1], scale[2]);
    this.mass = mass;
    this.color = color;
    this.timer = 0;
    // WebGL info
    this.name = type.name;
    this.programInfo = transformShader(gl) // FROM shadersAndUniforms.js
    this.buffers = undefined;
    this.centroid = this.calculateCentroid(type.vertices); // FROM drawScene
    this.material =  {
      ambientColor: [0.6, 0.6, 0.6],
      diffuseColor: type.material.diffuse,
      specularColor: [1.0, 1.0, 1.0],
      shininess: 32.0,
    };
  }

  /*
   * Adds force to acceleration taking mass into account
   * @param force a vec3 object to apply to the acceleration
   */
  applyForce(force) {
    // takes vec3 force into it
    var tempForce = vec3.clone(force);
    vec3.scale(tempForce, tempForce, (1/this.mass));
    vec3.add(this.accel, this.accel, tempForce);
  }

  /*
   * Applies acceleration and velocity to object and moves object based on deltaTime
   * @param state Uses state.dt to manage the delta time of the movements
   */
  update(state) {
    // console.log("state", state);
    vec3.scale(this.accel, this.accel, state.dt);
    vec3.add(this.velocity, this.velocity, this.accel);
    let scaledVel = vec3.create();
    vec3.scale(scaledVel, this.velocity, state.dt);
    vec3.add(this.position, this.position, scaledVel);
    vec3.scale(this.accel, this.accel, 0);
  }

  /*
   * If object moves outside of bounding box, move the object to the other side of the box
   * @param state Uses state.dt to manage the delta time of the movements
   */
  edges(state) {
    // X
    if (this.position[0] < -state.canvasWidth/2) { this.position[0] = state.canvasWidth/2; }
    else if (this.position[0] > state.canvasWidth/2) { this.position[0] = -state.canvasWidth/2; }
    // Y
    else if (this.position[1] < -state.canvasHeight/2) { this.position[1] = state.canvasHeight/2; }
    else if (this.position[1] > state.canvasHeight/2) { this.position[1] = -state.canvasHeight/2; }
    // Z
    else if (this.position[2] < -state.canvasDepth/2) { this.position[2] = state.canvasDepth/2; }
    else if (this.position[2] > state.canvasDepth/2) { this.position[2] = -state.canvasDepth/2; }
  }

  /**
   * @param {array of x,y,z vertices} vertices 
   */
  calculateCentroid(vertices) {
    var center = vec3.fromValues(0.0, 0.0, 0.0);
    for (let t = 0; t < vertices.length; t++) {
      vec3.add(center,center,vertices[t]);
    }
    vec3.scale(center,center,1/vertices.length);
    return center;
  }
}

class Boid extends Object {
  constructor( 
    gl,
    position = [0,0,0], 
    velocity = [0,0,0], 
    color=[1,1,1,1], 
    scale = [1,1,1], 
    mass = 1,
    type
  ) {
    super(position, velocity, color, scale, mass);
    this.radius = 2.0;
    this.maxSpeed = 50;
    this.maxForce = 150;
    this.wanderTheta = 0;
    this.separationForce = vec3.create();
    this.alignForce = vec3.create();
    this.cohereForce = vec3.create();
    this.cohereCount = 0;
  }

  run(boids, startPoint) {
    // this.flock(boids);
    this.newFlock(boids, startPoint);
    this.update();
    // this.edges();
    // this.show();
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

  newFlock(boids, startingPoint) {
    let sepDist = 2;
    let aliDist = 4;
    let cohereDist = 4;
    let steer = vec3.create();
    for(let i = startingPoint;i < boids.length; i++) {
      // console.log("i: ", i);
      // console.log("LOOPCOUNT: ", LOOPCOUNT);
      LOOPCOUNT++;
      let other = boids[i];
      if (this === other) {continue;} // skip loop if comparing itself
      // Find separation distance
      let distanceMag = vec3.sqrDist(this.position, other.position);
      // SEPARATION
      if (distanceMag <= sepDist) {
        let diff = vec3.sub(vec3.create(),this.position, other.position);
        vec3.normalize(diff, diff);
        if (distanceMag === 0){distanceMag = 0.001;}
        vec3.scale(diff, diff, 1/distanceMag);
        vec3.add(other.separationForce, other.separationForce, vec3.negate(vec3.create(),diff));
        vec3.add(this.separationForce, this.separationForce, diff);
      }
      // ALIGN
      if (distanceMag < aliDist) {
        vec3.add(other.alignForce, other.alignForce, this.velocity);
        vec3.add(this.alignForce, this.alignForce, other.velocity);
      }
      // COHERE
      if (distanceMag < cohereDist) {
        
        vec3.add(other.cohereForce, other.cohereForce, this.position); // apply to other boid
        vec3.add(this.cohereForce, this.cohereForce, other.position); // apply to this boid
        other.cohereCount++;
        this.cohereCount++;
      }
    }
    // apply separation force
    if(vec3.sqrLen(this.separationForce) != 0){
      vec3.normalize(this.separationForce, this.separationForce);
      vec3.scale(this.separationForce, this.separationForce, this.maxSpeed);
      vec3.sub(this.separationForce, this.separationForce, this.velocity);
      limit(this.separationForce, this.maxForce);
    }
    // apply align force
    if (vec3.sqrLen(this.alignForce) != 0 ){
      vec3.normalize(this.alignForce, this.alignForce);
      vec3.scale(this.alignForce, this.alignForce, this.maxSpeed);
      vec3.sub(this.alignForce ,this.alignForce, this.velocity);
      limit(this.alignForce, this.maxForce)
    }
    if (vec3.sqrLen(this.cohereForce) != 0 ){
      vec3.scale(this.cohereForce, this.cohereForce, 1/this.cohereCount);
      this.cohereForce = this.seek(this.cohereForce);
    }
    // apply coeffecients
    let sepCoef = document.getElementById('slider0');
    let aliCoef = document.getElementById('slider1');
    let coCoef = document.getElementById('slider2');
    vec3.scale(this.separationForce, this.separationForce,sepCoef.value);
    vec3.scale(this.alignForce, this.alignForce,aliCoef.value);
    vec3.scale(this.cohereForce, this.cohereForce,coCoef.value);
    this.applyForce(this.separationForce);
    vec3.scale(this.separationForce,this.separationForce, 0);
    this.applyForce(this.alignForce);
    vec3.scale(this.alignForce, this.alignForce, 0);
    this.applyForce(this.cohereForce);
    vec3.scale(this.cohereForce, this.cohereForce, 0);
  }

  separate(boids) {
    let desiredSeparation = 50;
    let steer = vec3.create();
    let sum = vec3.create();
    let count = 0;
    for (let other of boids) {
      LOOPCOUNT++;
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
    let neighborDistance = 100;
    let sum = vec3.create();
    let count = 0;
    for (let other of boids) {
      LOOPCOUNT++;
      let d = vec3.sqrDist(this.position, other.position);
      if ((this !== other) && (d < neighborDistance)) {
        vec3.add(sum, sum, other.velocity);
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
      LOOPCOUNT++;
      let d = vec3.sqrDist(this.position, other.position);
      if ((this !== other) && (d < neighborDistance)) {
        vec3.add(sum, sum, other.velocity);
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

}

class Flock {
  constructor() {
    this.boids = [];
  }
  run() {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].run(this.boids, i);
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
