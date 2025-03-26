// The nature of Code
// Daniel Platt
// Vehicle Class:
class Binn {
  constructor(gridRes, width, height, depth){
    this.gridRes = gridRes
    this.cols = Math.floor(width/this.gridRes);
    this.rows = Math.floor(height/this.gridRes);
    this.depth = Math.floor(depth/this.gridRes);
    this.grid = new Array(this.cols);
    for (let i = 0; i < this.grid.length; i++) {
      this.grid[i] = new Array(this.rows);
      for (let j = 0; j < this.grid[i].length; j++) {
        this.grid[i][j] = new Array(this.depth);
        for (let k = 0; k < this.grid[i][j].length; k++) {
          this.grid[i][j][k] = [];
        }
      }
    }
  }

  /*
   * Find the neighbors in the surrounding 9 grid
   * @Param boid the current boid object to locate
   * @returns neighbors list of boids
   * note: if current grid is on the edge, it skips to next square using continue
   */
  getNeighbors(boid, state) {
    let boidColumn = Math.floor((boid.position[0]+state.canvasWidth /2) / this.gridRes);
    let boidRow = Math.floor((boid.position[1] + state.canvasWidth / 2) / this.gridRes);
    let boidDepth = Math.floor((boid.position[2]+ state.canvasDepth / 2) / this.gridRes);
    boidColumn = constrain(boidColumn, 0, this.cols - 1);
    boidRow = constrain(boidRow , 0, this.rows - 1);
    boidDepth = constrain(boidDepth , 0, this.depth- 1);
    let neighbors = [];
    for (let i = -1; i < 2; i++) {
      let tempColumn = boidColumn+i;
      if (tempColumn === -1){continue}
      if (tempColumn > this.cols - 1){continue}
      for (let j = -1; j < 2; j++) {
        let tempRow = boidRow+j;
        if (tempRow === -1){continue}
        if (tempRow > this.rows - 1){continue}
        for (let k = -1; k < 2; k++) {
          let tempDepth = boidDepth+k;
          if (tempDepth === -1){continue}
          if (tempDepth > this.depth - 1){continue}
          neighbors.push(this.grid[tempColumn][tempRow][tempDepth]);
          BINCOUNT++;
        }
      }
    }
    return neighbors.flat();
  }

  repopulate(flock) {
    // Each frame, the grid is reset to empty arrays.
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        for (let k = 0; k < this.depth; k++) {
          this.grid[i][j][k] = [];
          BINCOUNT++;
        }
      }
    }
    // Place each boid into the appropriate cell in the grid.
    for (let boid of flock.boids) {
      // Find the right column and row.
      let column = Math.floor((boid.position[0]+state.canvasWidth /2) / this.gridRes);
      let row = Math.floor((boid.position[1] + state.canvasWidth / 2) / this.gridRes);
      let depth = Math.floor((boid.position[2]+ state.canvasDepth / 2) / this.gridRes);
      // Constrain to the limits of the array.
      column = constrain(column, 0, this.cols - 1);
      row = constrain(row, 0, this.rows - 1);
      depth = constrain(depth, 0, this.depth - 1)
      // Add the boid.
      this.grid[column][row][depth].push(boid);
      BINCOUNT++;
    }
  }
}

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
  hardEdges(state) {
    // X
    const reduction = -0.9
    if (this.position[0] < -state.canvasWidth/2) { 
      this.velocity[0] = this.velocity[0] * reduction;
      this.position[0] = -state.canvasWidth/2; 
    }
    else if (this.position[0] > state.canvasWidth/2) { 
      this.velocity[0] = this.velocity[0] * reduction;
      this.position[0] = state.canvasWidth/2; 
    }
    // Y
    else if (this.position[1] < -state.canvasHeight/2) {
      this.velocity[1] = this.velocity[1] * reduction;
      this.position[1] = -state.canvasHeight/2; 
    }
    else if (this.position[1] > state.canvasHeight/2) {
      this.velocity[1] = this.velocity[1] * reduction;
      this.position[1] = state.canvasHeight/2; 
    }
    // Z
    else if (this.position[2] < -state.canvasDepth/2) {
      this.velocity[2] = this.velocity[2] * reduction;
      this.position[2] = -state.canvasDepth/2; 
    }
    else if (this.position[2] > state.canvasDepth/2) {
      this.velocity[2] = this.velocity[2] * reduction;
      this.position[2] = state.canvasDepth/2; 
    }
  }
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
    this.maxSpeed = 50;
    this.maxForce = 80;
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

  newFlock(neighbors, startingPoint) {
    let sepDist = this.scale[0];
    let aliDist = 10;
    let cohereDist = 10;
    let preditorDist = 9.5;
    let steer = vec3.create();
    let diff = vec3.create();
    let neg = vec3.create();
    for(let i = 0; i < neighbors.length; i++) {
      LOOPCOUNT++;

      let other = neighbors[i];
      if (this === other) {continue;} // skip loop if comparing itself
      // Find separation distance
      let distanceMagSq = vec3.sqrDist(this.position, other.position);
      // SEPARATION
      if (distanceMagSq <= sepDist*sepDist) {
        vec3.sub(diff,this.position, other.position);
        vec3.normalize(diff, diff);
        if (distanceMagSq === 0){distanceMagSq = 0.00001;}
        vec3.scale(diff, diff, 1/Math.sqrt(distanceMagSq));
        // vec3.add(other.separationForce, other.separationForce, vec3.negate(neg,diff));
        vec3.add(this.separationForce, this.separationForce, diff);
      }       
      // ALIGN
      if (distanceMagSq < aliDist*aliDist) {
        // vec3.add(other.alignForce, other.alignForce, this.velocity);
        vec3.add(this.alignForce, this.alignForce, other.velocity);
      }
      // COHERE
      if (distanceMagSq < cohereDist*cohereDist) {
        this.collision = true;
        other.collision = true;
        // vec3.add(other.cohereForce, other.cohereForce, this.position); // apply to other boid
        vec3.add(this.cohereForce, this.cohereForce, other.position); // apply to this boid
        // other.cohereCount++;
        this.cohereCount++;
      }
      /*
      if (other === boids[boids.length - 1] && distanceMagSq < preditorDist * preditorDist) {
        // vec3.sub(diff,this.position, other.position);
        diff = this.seek(other.position);
        vec3.scale(diff, diff, -3);
        this.applyForce(diff);
        if(distanceMagSq < this.scale[0] * this.scale[0]){
          // boids.splice(i, 1);
          // this.material.diffuseColor = [1,1,1];

        }
        continue;
      }
      */
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
  run(state, bin) {
    for (let i = 0; i < this.boids.length; i++) {
      let neighbors = bin.getNeighbors(this.boids[i], state); 
      this.boids[i].run(neighbors, i, state);
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
