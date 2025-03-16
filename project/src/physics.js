class Mover {
  constructor(position, scale) {
    this.position = vec3.fromValues(position[0], position[1], position[2]);
    this.lookat = vec3.fromValues(1.0,0.0,0.0);
    this.scale = vec3.fromValues(scale[0], scale[1], scale[2]);
    this.velocity = vec3.fromValues(0,0,0);
    this.acceleration = vec3.fromValues(0,0,0);
    this.mass = 1; // arbirary mass value
    this.volume = 1;
    this.rotation = {
      amortization: 0.99,
      accel: vec3.create(),
      vel: vec3.create(),
      mat: mat4.create(),
    }
  }

  applyForce(force) {
    // takes vec3 force into it
    var tempForce = vec3.clone(force);
    vec3.scale(tempForce, tempForce, (1/this.mass));
    vec3.add(this.acceleration, this.acceleration, tempForce);
  }

  applyRotationalForce(force, distance) {
    // force is in vec3 format
    // distance from the center of mass for [x,y,z] vec 3 format
    var tempForce = vec3.create();
    vec3.scale(tempForce, tempForce, (1/this.mass));// wrong but fine
    // rotation about the x axis, use the y and z component of the force
    tempForce[0] = 6*distance[0]*(this.mass*this.volume**2) * (force[1] + force[2]); 
    // rotation about the y axis, use the x and z component of the force
    tempForce[1] = 6*distance[1]*(this.mass*this.volume**2) * (force[0] + force[2]); 
    // rotation about the z axis, use the x and y component of the force
    tempForce[1] = 6*distance[1]*(this.mass*this.volume**2) * (force[0] + force[1]); 

    var yAxis = vec3.fromValues(0,1,0);
    var zAxis = vec3.fromValues(0,0,1);
    vec3.add(this.rotation.accel, this.rotation.accel, tempForce);
  }

  update(state) {
    this.checkBounds();
    // position
    vec3.add(this.velocity, this.velocity, this.acceleration);
    vec3.add(this.position, this.position, this.velocity);
    vec3.scale(this.acceleration, this.acceleration, 0);

    // rotation
    vec3.add(this.rotation.vel, this.rotation.vel, this.rotation.accel);
    mat4.rotate(this.rotation.mat, this.rotation.mat, this.rotation.vel[0], [1,0,0]); //x
    mat4.rotate(this.rotation.mat, this.rotation.mat, this.rotation.vel[1], [0,1,0]); //y
    mat4.rotate(this.rotation.mat, this.rotation.mat, this.rotation.vel[2], [0,0,1]); //z

    // amortization
    vec3.scale(this.rotation.vel, this.rotation.vel, this.rotation.amortization);


    // reset acceleration
    vec3.scale(this.rotation.accel, this.rotation.accel, 0);

  }
  updateCamera(state){
    // UPDATE CAMERA ===============================
    // Set the camera x,y, position
    // camera.position = player.position - (halfway * camera.distance) only for x and y
    var vecNorm = vec3.create()
    var vecHalf = vec3.create()
    vec3.normalize(vecNorm, this.velocity)

    // Taking any point between object lookat and velocity vector
    vec3.lerp(vecHalf, this.lookat, vecNorm, state.camera.pivotDelay);
    vec3.normalize(vecHalf, vecHalf);

    // TODO: Figure out how to prevent jump when drifting
    // Move the camera back behind the car
    vec3.scaleAndAdd(state.camera.position, 
      this.position, 
      vecHalf, 
      -state.camera.distance)
    state.camera.position[1] = state.camera.height;
    // vec3.add(state.camera.at, state.camera.at, this.velocity);
    // UPDATE LIGHT POSITION
    // state.light.position = vec3.scaleAndAdd(vec3.create(),this.position, this.lookat, .1);
    state.light[0].position = this.position;
    state.light[0].lookat = this.lookat;
  }

  checkBounds(){
    // Get the distance from the origin to the outer bound of the scene
    var sceneSize = state.objects[1].model.scale[0]/2;
    // const lowerXBound = -10;
    // const upperXBound = 10;
    // const lowerYBound =-10;
    // const upperYBound = 10;
    // const lowerZBound = -10;
    // const upperZBound = 10;
    if(this.position[0] < -sceneSize ||
      this.position[0] > sceneSize ||
      this.position[1] < -sceneSize||
      this.position[1] > sceneSize ||
      this.position[2] < -sceneSize ||
      this.position[2] > sceneSize) {
      state.run = false;
    }

    // add bounce off bottom
    if((this.position[1] - this.scale[1]*0.5) <0){ // Assumes minimum y position = -0.5
      this.position[1] = this.scale[1]*0.5;
      if (this.velocity[1] < 0.01 && this.velocity[1] > -0.01){
        this.velocity[1] = 0.0;
      }
      else{
        this.velocity[1] *= -0.7;
      }
    }
    /*
    if(this.position[0] < lowerXBound) {
      this.velocity[0] *= -1.0;
      this.position[0] = lowerXBound;
    }
    if(this.position[0] > upperXBound) {
      this.velocity[0] *= -1.0;
      this.position[0] = upperXBound;
    }
    if(this.position[1] < lowerYBound) {
      this.velocity[1] *= -1.0;
      this.position[1] = lowerYBound;
    }
    if(this.position[1] > upperYBound) {
      this.velocity[1] *= -1.0;
      this.position[1] = upperYBound;
    }
    if(this.position[2] < lowerZBound) {
      this.velocity[2] *= -1.0;
      this.position[2] = lowerZBound;
    }
    if(this.position[2] > upperZBound) {
      this.velocity[2] *= -1.0;
      this.position[2] = upperZBound;
    }
    */
    return;
  }
}

/**
 * Checks to see if the player (first object in the objects list) occupies the same region as the object
 * Note: this is an imperfect system as it does not rotate the player's hitbox
 * returns: bool, true if collision occures
 */
function checkCollision(objectA, objectB, offset = 1) {
  // Check if the x and y components of the coin are colliding, previnting coin from 
  // falling into a box
  return(
    //objectA.min.x <= objectB.max.x
    (objectA.model.position[0] - 0.5*objectA.model.scale[0])*offset <= 
    (objectB.model.position[0] + 0.5*objectB.model.scale[0])*offset &&
    //objectA.model.max.x >= objectB.min.x &&
    (objectA.model.position[0] + 0.5*objectA.model.scale[0])*offset >= 
    (objectB.model.position[0] - 0.5*objectB.model.scale[0])*offset &&
    // objectA.model.min.y <= objectB.max.y &&
    (objectA.model.position[1] - 0.5*objectA.model.scale[1])*offset <= 
    (objectB.model.position[1] + 0.5*objectB.model.scale[1])*offset &&
    // objectA.model.max.y >= objectB.min.y &&
    (objectA.model.position[1] + 0.5*objectA.model.scale[1])*offset >= 
    (objectB.model.position[1] - 0.5*objectB.model.scale[1])*offset &&
    // objectA.model.min.z <= objectB.max.z &&
    (objectA.model.position[2] - 0.5*objectA.model.scale[2])*offset <= 
    (objectB.model.position[2] + 0.5*objectB.model.scale[2])*offset &&
    // objectA.model.max.z >= objectB.min.z
    (objectA.model.position[2] + 0.5*objectA.model.scale[2])*offset >= 
    (objectB.model.position[2] - 0.5*objectB.model.scale[2])
  );
}

function checkHorizontalCollision(objectA, objectB, offset = 1) {
  console.log("objectA: ", objectA.model.position);
  console.log("objectB: ", objectB.model.position);
  return (
    (objectA.model.position[0] - 0.5 * objectA.model.scale[0]) * offset <= 
    (objectB.model.position[0] + 0.5 * objectB.model.scale[0]) * offset &&
    (objectA.model.position[0] + 0.5 * objectA.model.scale[0]) * offset >= 
    (objectB.model.position[0] - 0.5 * objectB.model.scale[0]) * offset &&
    (objectA.model.position[2] - 0.5 * objectA.model.scale[2]) * offset <= 
    (objectB.model.position[2] + 0.5 * objectB.model.scale[2]) * offset &&
    (objectA.model.position[2] + 0.5 * objectA.model.scale[2]) * offset >= 
    (objectB.model.position[2] - 0.5 * objectB.model.scale[2]) * offset
  );
}

