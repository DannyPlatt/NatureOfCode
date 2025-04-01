
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
  scene.forEach(obj => { // FROM scene.js
    spawnNewObject(
      gl = gl, 
      objectList = state.objects.scene, 
      position = vec3.fromValues(obj.position[0],obj.position[1],obj.position[2]),
      velocity = vec3.create(), 
      color = obj.color, 
      scale = obj.scale, 
      mass = 1, 
      type = obj.type
    )
  });
  console.log("enviroment setup: " ,state.objects.scene);
  // ============= SETUP KEY PRESS DETECTION ==============
  var keysPressed = setupKeypresses(state); // FROM keyPresses.js

  // ================ GAME LOOP ====================
  console.log("Starting rendering loop");
  // A variable for keeping track of time between frames
  const fpsElem = document.querySelector('#fps');
  let fpsUpdate = 0
  var then = 0.0;
  let lastTime = performance.now();
  let maxFrameTime = 0;
  setup(state, gl); // Add before loop items

  function render() {
    then = handleTime(state, then, fpsElem);
    checkKeys(state, keysPressed);
    draw(state, gl);  // add in loop items
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
    dt: 0,
    // ==== SETUP CAMERA =========
    camera: {
      position: vec3.fromValues(-100.0, 0.0, 0.0),
      at: vec3.fromValues(1.0, 0.0, 0.0),
      up: vec3.fromValues(0.0, 0.0, 1.0),
      view: 1,
      distance: 3, // following distance for first person camera
      height: 2,
      pivotDelay: .5 // 0 = instant movement, 1 = follow velocity
    },
    objects: {
      flock: undefined,
      boids: [],
      scene: []
    },
    canvas: canvas,
    canvasWidth: 100,
    canvasHeight: 100,
    canvasDepth: 100,
    selectedIndex: 0,
    hasSelected: false,
    light: [
      { // overhead light
        position: vec3.fromValues(0, 0, 0), // position of the light source (we can adjust however we want)
        lookat: vec3.create(),
      },
    ]
  };
  return state;
}


function handleTime(state, then, fpsElem) {
    let now = performance.now();
    now *= 0.001; // convert to seconds
    if (then === 0) {
      return now;
    }
    state.dt = (now - then) * 0.1; 
    if (state.dt > 0.5) {
      state.dt = .1
    }
    const fps = 1/state.dt;
    fpsElem.textContent = fps.toFixed(1);
    if(state.dt >= 50){
      console.log(`Frame time: ${deltaTime.toFixed(2)}ms`); 
    }
  return now;

}

/**
 * Handles the game ending and creates a pause before reloading the game
 * @param {object} state: all information regarding the game
 * @param {time} now: current time object. a javascript thing
 */
function gameOver(state, now){
  // should handle delta time here somehow
  console.log("=================GAME OVER==================")
  setTimeout(() =>{
    game();
  }, 5000);
}
