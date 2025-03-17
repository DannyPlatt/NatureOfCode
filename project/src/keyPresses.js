function setupKeypresses(state) {
  var keysPressed = {}
  document.addEventListener('keydown', (event) =>{
    event.preventDefault();
    keysPressed[event.key] = true;
  })
  document.addEventListener('keyup', (event) =>{
    keysPressed[event.key] = false;
  })
  return keysPressed;
}

function checkKeys(state, keysPressed){
  var cameraMovement = 0.1; // If camera disconnected from car, this is the speed to look around
  if(keysPressed['ArrowLeft']){
    vec3.add(state.camera.position, state.camera.position, [-cameraMovement,0,0]);
    // vec3.add(state.camera.at, state.camera.at, [-cameraMovement,0,0]);
  }
  else if(keysPressed['ArrowRight']){ // Move camera along x axis to the right
    vec3.add(state.camera.position, state.camera.position, [cameraMovement,0,0]);
    // vec3.add(state.camera.at, state.camera.at, [cameraMovement,0,0]);
  }
  else if(keysPressed['ArrowUp']){
    vec3.add(state.camera.position, state.camera.position, [0,0,-cameraMovement]);
    // vec3.add(state.camera.at, state.camera.at, [0,0,-cameraMovement]);
  }
  else if(keysPressed['ArrowDown']){
    vec3.add(state.camera.position, state.camera.position, [0,0,cameraMovement]);
    // vec3.add(state.camera.at, state.camera.at, [0,0,cameraMovement]);
  }
  else if(keysPressed['q']){
    vec3.add(state.camera.position, state.camera.position, [0,-cameraMovement,0]);
    // vec3.add(state.camera.at, state.camera.at, [0,-cameraMovement,0]);
  }
  else if(keysPressed['e']){
    vec3.add(state.camera.position, state.camera.position, [0,cameraMovement, 0]);
    // vec3.add(state.camera.at, state.camera.at, [0,0,cameraMovement]);
  }
  else if(keysPressed['w']){
    vec3.rotateX(state.camera.at, state.camera.at, state.camera.position, cameraMovement/10);
  }
  else if(keysPressed['s']){
    vec3.rotateX(state.camera.at, state.camera.at, state.camera.position, -cameraMovement/10);
  }
  else if(keysPressed['a']){
    vec3.rotateZ(state.camera.at, state.camera.at, state.camera.position, cameraMovement/10);
  }
  else if(keysPressed['d']){
    vec3.rotateZ(state.camera.at, state.camera.at, state.camera.position, -cameraMovement/10);
  }
}
