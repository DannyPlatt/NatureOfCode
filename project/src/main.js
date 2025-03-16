
/************************************
 * MAIN
 ************************************/

function main() {
	// Necessary to load all models before running game.
	const loadingPromises = scene.map((obj) => obj.type.raw.promise);

	Promise.all(loadingPromises)
		.then(() => {
			console.log("All models loaded.");
			game();
		})
		.catch((err) => {
			console.log("Failed to load one or more models: ", err);
		});
}

function game() {
  // ================ SETUP CANVAS ========================
  console.log("Setting up the canvas");
  const canvas = document.querySelector("#driveGLCanvas");
  var gl = canvas.getContext("webgl2");
  if (gl === null) {
    printError('WebGL 2 not supported by your browser',
      'Check to see you are using a <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#WebGL_2_2" class="alert-link">modern browser</a>.');
    return;
  }

  // ================ LOAD SHAPE FILES ====================
  var inputTriangles = []
  scene.forEach(object => { // FROM scene.js
    inputTriangles.push(object.type);
  });
  state = initState(gl, canvas, inputTriangles);
  var keysPressed = setupKeypresses(state); // FROM keyPresses.js


  // ================ GAME LOOP ====================
  console.log("Starting rendering loop");
  // A variable for keeping track of time between frames
  var then = 0.0;
  var cubeSpawnTimer = 0;
  var cubeSpawnRate = 5; // Every 5 seconds spawn new cube
  // This function is called when we want to render a frame to the canvas
  // TODO: setup delta time to work
  function render(now) {
    let accelMag = 0.015;
    accelVec = vec3.create();
    vec3.scale(accelVec, state.objects[0].model.lookat, accelMag);
    state.objects[0].model.applyForce(accelVec);
    // limit the max speed
    if(vec3.len(state.objects[0].model.velocity) > state.player.maxSpeed){
      vec3.scale(
        state.objects[0].model.velocity, 
        state.objects[0].model.velocity, 
        state.player.maxSpeed/vec3.len(state.objects[0].model.velocity))
    }
    state.objects[0].model.updateCamera(state);

    // Set Timers
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    // check keysPressed
    checkKeys(state, keysPressed);
    // spiin coin
    state.objects[2].model.rotation.vel[1] = 0.1;
    // Add new obsticle every 5 seconds
    // increase timer
    cubeSpawnTimer += deltaTime;
    if (cubeSpawnTimer > cubeSpawnRate){
      cubeSpawnTimer = 0;
      spawnCube(inputTriangles, gl, state);
      // reset timer
    }
		state.objects.forEach((obj) => {
			console.log(`Object ${obj.name} numVertices during render:`, obj.buffers?.numVertices);
		});

    // Draw our scene
    drawScene(gl, deltaTime, state); // FROM drawScene.js

    // Request another frame when this one is done
    if(state.run) {
      requestAnimationFrame(render);
    }
    else{
      gameOver(state)
    }
  }
  // Draw the scene
  requestAnimationFrame(render);
}

function initState(gl, canvas, inputTriangles) {
  // Create a state for our scene
  // ================ SETUP STATE ========================
  var state = {
    // ==== SETUP CAMERA =========
    run: true,
    FPS: 30,
    score: 0,
    camera: {
      position: vec3.fromValues(0.0, 0.0, 0),
      focalHeight: vec3.fromValues(0,0.5,0),
      at: vec3.fromValues(0.0, 0.0, 0.0),
      up: vec3.fromValues(0.0, 1.0, 0.0),
      view: 1,
      distance: 3, // following distance for first person camera
      height: 2,
      pivotDelay: .5 // 0 = instant movement, 1 = follow velocity
    },
    objects: [],
    canvas: canvas,
    selectedIndex: 0,
    hasSelected: false,
    player: {
      maxSpeed: 0.2,
      rotateVel: 0.07,
      accel: 0.02,
    },
    light: [
    {
      position: vec3.fromValues(0, 0, 0), // position of the light source (we can adjust however we want)
      lookat: vec3.create(),
    },
    {
      position: vec3.fromValues(0, 20, 20), // position of the light source (we can adjust however we want)
      lookat: vec3.create(),
    },
    ]
  };

  // ================ ADD MODELS ========================
  // Create an object for every model we want in the scene
  for (var i = 0; i < inputTriangles.length; i++) {
    state.objects.push(
      {
        name: inputTriangles[i].name,
        model: new Mover(
          scene[i].position, 
          scene[i].scale,
        ),
        // this will hold the shader info for each object
        programInfo: transformShader(gl), // FROM shadersAndUniforms.js
        buffers: undefined,
        centroid: calculateCentroid(inputTriangles[i].vertices), // FROM drawScene
        color: new Float32Array([
          inputTriangles[i].material.diffuse[0],
          inputTriangles[i].material.diffuse[1],
          inputTriangles[i].material.diffuse[2],
          1.0,
        ]),
        material: {
          ambientColor: [0.2, 0.2, 0.2], // random values for now
          diffuseColor: inputTriangles[i].material.diffuse,
          specularColor: [1.0, 1.0, 1.0], 
          shininess: 32.0, // Example value
        },
      }
    );
    // initBuffers(gl, object, positionArray, indicesArray) 
    initBuffers( // FROM initBuffers.js
      gl, 
      state.objects[i], 
      inputTriangles[i].vertices.flat(),
      inputTriangles[i].triangles.flat(),
      inputTriangles[i].normals.flat()
    );
  }
  return state;
}

function spawnCube(inputTriangles,gl,state){
  mapSize = state.objects[1].model.scale[0];
  scaleLimitX = 3;
  scaleLimitY = 2;
  // Create new cube object
  var run = true;
  run = false;
  var newCube = {
    type: cube,
    position: [
      (Math.random() * mapSize - mapSize/2),
      10,
      (Math.random() * mapSize - mapSize/2),
    ],
    scale: [
      Math.random() * scaleLimitX,
      (Math.random() + 1) * scaleLimitY, // ensure no flat boxes
      Math.random() * scaleLimitX
    ],
  }
  // Add cube to triangles
  inputTriangles.push(newCube.type);
  state.objects.push(
    {
      name: inputTriangles.at(-1).name,
      model: new Mover(
        newCube.position, 
        newCube.scale,
      ),
      // this will hold the shader info for each object
      programInfo: transformShader(gl), // FROM shadersAndUniforms.js
      buffers: undefined,
      centroid: calculateCentroid(inputTriangles.at(-1).vertices), // FROM drawScene
      color: new Float32Array([
        inputTriangles.at(-1).material.diffuse[0],
        inputTriangles.at(-1).material.diffuse[1],
        inputTriangles.at(-1).material.diffuse[2],
        1.0,
      ]),
      material: {
        ambientColor: [0.1, 0.1, 0.1],
        diffuseColor: cube.material.diffuse,
        specularColor: [1.0, 1.0, 1.0],
        shininess: 50.0,
      },
    }
  );
  // Adjust poisition until no collision with other cubes or coin;
  var validPosition = false;
  var mapSize = 20;
  while(!validPosition){
    validPosition = true;
    // TODO: fix check. I don't think it ever returns a true collision
    if(checkHorizontalCollision(state.objects.at(-1), state.objects[0], 1)){
      validPosition = false;
      state.objects.at(-1).model.position =  [
        (Math.random() * mapSize - mapSize/2),
        10,
        (Math.random() * mapSize - mapSize/2),
      ];
    }
  }
  // initBuffer(gl, object, positionArray, indicesArray) 
  initBuffers( // FROM initBuffers.js
    gl, 
    state.objects.at(-1), 
    inputTriangles.at(-1).vertices.flat(),
    inputTriangles.at(-1).triangles.flat(),
    inputTriangles.at(-1).normals.flat()
  );
}
function gameOver(state, now){
  // print to screen game over and score
  console.log("=================GAME OVER==================")
  console.log("=================Score: ",state.score, "=================")
  setTimeout(() =>{
    game();
  }, 5000);
}
