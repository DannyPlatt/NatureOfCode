function setupKeypresses(state) {
  var keysPressed = {}
  document.addEventListener('keydown', (event) =>{
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
    keysPressed[event.key] = true;
  })
  document.addEventListener('keyup', (event) =>{
    keysPressed[event.key] = false;
  })
  return keysPressed;
}

function checkKeys(state, keysPressed){
  var cameraMovement = 20 * state.dt; // If camera disconnected from car, this is the speed to look around
  var cameraRotation = 0.7 * state.dt
  if(keysPressed['ArrowLeft']){ // Rotate up
    // Compute the rotation axis (cross product)
    let axis = vec3.fromValues(0,0,1);
    // Create a rotation matrix
    let theta = cameraRotation;
    let rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, theta, axis); // Create rotation matrix
    // Rotate vectors using the rotation matrix
    vec3.transformMat4(state.camera.at, state.camera.at, rotationMatrix);
    vec3.transformMat4(state.camera.up, state.camera.up, rotationMatrix);
  }
  if(keysPressed['ArrowRight']){ // Move camera along x axis to the right
    // Compute the rotation axis (cross product)
    let axis = vec3.fromValues(0,0,1);
    // Create a rotation matrix
    let theta = -cameraRotation;
    let rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, theta, axis); // Create rotation matrix
    // Rotate vectors using the rotation matrix
    vec3.transformMat4(state.camera.at, state.camera.at, rotationMatrix);
    vec3.transformMat4(state.camera.up, state.camera.up, rotationMatrix);
  }
  if(keysPressed['ArrowUp']){
    // Compute the rotation axis (cross product)
    let axis = vec3.create();
    vec3.cross(axis, state.camera.at, state.camera.up);
    vec3.normalize(axis, axis); // Normalize to unit length
    // Create a rotation matrix
    let theta = cameraRotation;
    let rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, theta, axis); // Create rotation matrix
    // Rotate vectors using the rotation matrix
    vec3.transformMat4(state.camera.at, state.camera.at, rotationMatrix);
    vec3.transformMat4(state.camera.up, state.camera.up, rotationMatrix);
  }
  if(keysPressed['ArrowDown']){
    // Compute the rotation axis (cross product)
    let axis = vec3.create();
    vec3.cross(axis, state.camera.at, state.camera.up);
    vec3.normalize(axis, axis); // Normalize to unit length
    // Create a rotation matrix
    let theta = -cameraRotation;
    let rotationMatrix = mat4.create();
    mat4.fromRotation(rotationMatrix, theta, axis); // Create rotation matrix
    // Rotate vectors using the rotation matrix
    vec3.transformMat4(state.camera.at, state.camera.at, rotationMatrix);
    vec3.transformMat4(state.camera.up, state.camera.up, rotationMatrix);
  }
  if(keysPressed['r']){ // move towards lookup
    vec3.add(state.camera.position, state.camera.position, vec3.scale(vec3.create(), state.camera.up, cameraMovement));
  }
  if(keysPressed['f']){ // Move away from lookup
    vec3.sub(state.camera.position, state.camera.position, vec3.scale(vec3.create(), state.camera.up, cameraMovement));
  }
  if(keysPressed['w']){ // Move camera forward in the direction of the camera lookat vector
    vec3.add(state.camera.position, state.camera.position, vec3.scale(vec3.create(), state.camera.at, cameraMovement));
    // vec3.rotateX(state.camera.at, state.camera.at, state.camera.position, cameraMovement/10);
  }
  if(keysPressed['s']){ // Move caera away from the lookat vector
    vec3.sub(state.camera.position, state.camera.position, vec3.scale(vec3.create(), state.camera.at, cameraMovement));
    // vec3.rotateX(state.camera.at, state.camera.at, state.camera.position, -cameraMovement/10);
  }
  if(keysPressed['a']){ // Move camera orthagonal to look up and look at vector
    var cross = vec3.cross(vec3.create(), state.camera.up, state.camera.at);
    vec3.add(state.camera.position, state.camera.position, vec3.scale(vec3.create(), cross, cameraMovement));
    // vec3.rotateZ(state.camera.at, state.camera.at, state.camera.position, cameraMovement/10);
  }
  if(keysPressed['d']){
    var cross = vec3.cross(vec3.create(), state.camera.up, state.camera.at);
    vec3.sub(state.camera.position, state.camera.position, vec3.scale(vec3.create(), cross, cameraMovement));
    // vec3.rotateZ(state.camera.at, state.camera.at, state.camera.position, -cameraMovement/10);
  }
}
