// The nature of Code
// Daniel Platt
// Vehicle Class:
class Object {
  constructor( 
    gl,
    position = vec3.create(), 
    velocity = vec3.create(), 
    color=[1,1,1,1], 
    scale = [1,1,1], 
    mass = 1,
    type,
  ) {
    this.position = position;
    this.velocity = velocity;
    this.accel = vec3.create();
    this.scale = vec3.fromValues(scale[0], scale[1], scale[2]);
    this.mass = mass;
    this.timer = 0;
    this.color = color;
    // WebGL info
    this.name = type.name;
    this.programInfo = transformShader(gl) // FROM shadersAndUniforms.js
    this.buffers = undefined;
    this.centroid = this.calculateCentroid(type.vertices); // FROM drawScene
    this.material =  {
      ambientColor: [0.6, 0.6, 0.6],
      diffuseColor: [color[0], color[1], color[2]],
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
  */
  edges(state) {
    // X
    var steer = 0;
    if (this.position[0] < -state.canvasWidth/2 || this.position[0] > state.canvasWidth/2) { 
      steer = this.seek(vec3.fromValues(0,this.position[1],this.position[2]));
    }
    // Y
    else if (this.position[1] < -state.canvasHeight/2 || this.position[1]>state.canvasHeight/2){
      steer = this.seek(vec3.fromValues(this.position[0], 0,this.position[2]));
    }
    // Z
    else if (this.position[2] < -state.canvasHeight/2 || this.position[2]>state.canvasHeight/2){
      steer = this.seek(vec3.fromValues(this.position[0],this.position[1],0));
    }
    if (steer != 0){
      this.applyForce(steer);
    }
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
    position = vec3.create(), 
    velocity = vec3.create(), 
    color=[1,1,1,1], 
    scale = [1,1,1], 
    mass = 1,
    type,
    radius = 1,
  ) {
    super(gl, position, velocity, color, scale, mass, type);
    this.radius = radius;
    this.maxSpeed = 30;
    this.maxForce = 50;
    this.wanderTheta = 0;
    this.separationForce = vec3.create();
    this.alignForce = vec3.create();
    this.cohereForce = vec3.create();
    this.cohereCount = 0;
    this.collision = false;
  }

  run(boids, startPoint, state) {
    // this.flock(boids);
    this.newFlock(boids, startPoint);
    this.update(state);
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
    let sepDist = this.scale[0] + 2;
    let aliDist = 3;
    let cohereDist = 3;
    let steer = vec3.create();
    for(let i = startingPoint;i < boids.length; i++) {
      LOOPCOUNT++;
      let other = boids[i];
      if (this === other) {continue;} // skip loop if comparing itself
      // Find separation distance
      let distanceMagSq = vec3.sqrDist(this.position, other.position);
      // SEPARATION
      if (distanceMagSq <= sepDist*sepDist) {
        let diff = vec3.sub(vec3.create(),this.position, other.position);
        vec3.normalize(diff, diff);
        if (distanceMagSq === 0){distanceMagSq = 0.00001;}
        vec3.scale(diff, diff, 1/Math.sqrt(distanceMagSq));
        vec3.add(other.separationForce, other.separationForce, vec3.negate(vec3.create(),diff));
        vec3.add(this.separationForce, this.separationForce, diff);
      }       
      // ALIGN
      if (distanceMagSq < aliDist*aliDist) {
        vec3.add(other.alignForce, other.alignForce, this.velocity);
        vec3.add(this.alignForce, this.alignForce, other.velocity);
      }
      // COHERE
      if (distanceMagSq < cohereDist*cohereDist) {
        this.collision = true;
        other.collision = true;
        vec3.add(other.cohereForce, other.cohereForce, this.position); // apply to other boid
        vec3.add(this.cohereForce, this.cohereForce, other.position); // apply to this boid
        other.cohereCount++;
        this.cohereCount++;
      }
    }
    if (this.collision) {
    } else {
    }
    this.collision = false;
    
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
    if (this.cohereCount > 0 ){
      vec3.scale(this.cohereForce, this.cohereForce, 1/this.cohereCount);
      this.cohereForce = this.seek(this.cohereForce);
      this.cohereCount = 0;
    } else {
      vec3.set(this.cohereForce, 0, 0, 0);
    }
    // apply coeffecients
    let sepCoef = document.getElementById('slider0');
    let aliCoef = document.getElementById('slider1');
    let coCoef = document.getElementById('slider2');
    vec3.scale(this.separationForce, this.separationForce,sepCoef.value);
    vec3.scale(this.alignForce, this.alignForce,aliCoef.value);
    vec3.scale(this.cohereForce, this.cohereForce,coCoef.value);
    this.applyForce(this.separationForce);
    vec3.set(this.separationForce,0, 0, 0);
    this.applyForce(this.alignForce);
    vec3.set(this.alignForce,0, 0, 0);
    this.applyForce(this.cohereForce);
    vec3.set(this.cohereForce,0, 0, 0);
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
  run(state) {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].run(this.boids, i, state);
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
