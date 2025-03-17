
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
  const canvas = document.querySelector("#projectCanvas");
  var gl = canvas.getContext("webgl2");
  if (gl === null) {
    printError('WebGL 2 not supported by your browser',
      'Check to see you are using a <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API#WebGL_2_2" class="alert-link">modern browser</a>.');
    return;
  }

  // ================ LOAD SHAPE FILES ====================
  state = initState(gl, canvas);
  var inputTriangles = []
  scene.forEach(obj => { // FROM scene.js
    spawnNewObject(
      inputTriangles, gl,state, obj.type, obj.position, obj.scale
    );
  });
  let ballCount = 500;
  initBalls(inputTriangles,gl,state, ballCount);
  console.log("ballCount:", ballCount);
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

    // Set Timers
    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    // check keysPressed
    checkKeys(state, keysPressed);

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

function initState(gl, canvas) {
  // ================ SETUP STATE ========================
  var state = {
    run: true,
    debug: false,
    FPS: 30,
    score: 0,
    // ==== SETUP CAMERA =========
    camera: {
      position: vec3.fromValues(20.0, 20.0, -20),
      at: vec3.fromValues(0.0, 0.0, 0.0),
      up: vec3.fromValues(0.0, 0.0, -1.0),
      view: 1,
      distance: 3, // following distance for first person camera
      height: 2,
      pivotDelay: .5 // 0 = instant movement, 1 = follow velocity
    },
    objects: [],
    canvas: canvas,
    canvasWidth: 40,
    canvasHeight: 40,
    selectedIndex: 0,
    hasSelected: false,
    light: [
      { // overhead light
        position: vec3.fromValues(0, 20, -20), // position of the light source (we can adjust however we want)
        lookat: vec3.create(),
      },
    ]
  };
  return state;
}

/**
 * Handles the game ending and creates a pause before reloading the game
 * @param {object} state: all information regarding the game
 * @param {time} now: current time object. a javascript thing
 */
function gameOver(state, now){
  // print to screen game over and score
  // should handle delta time here somehow
  console.log("=================GAME OVER==================")
  console.log("=================Score: ",state.score, "=================")
  setTimeout(() =>{
    game();
  }, 5000);
}
