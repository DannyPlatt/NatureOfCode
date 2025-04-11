let LOOPCOUNT;
let BINCOUNT = 0;
let bin;
let planet;
let planet2;

function setup(state, gl) {
  let flockCount = 1000;
  let scale = 6;
  let preFlockTimer = performance.now();
  planet = state.objects.scene[1];
  planet2 = state.objects.scene[2];

  // initBalls(gl,state, flockCount);
  let then = performance.now();
  state.flock = new Flock(gl);
  initBuffers( 
    gl, state.flock, 
    cube.vertices.flat(), 
    cube.triangles.flat(), 
    cube.normals.flat()
  )
  let preflock = performance.now();
  state.flock.createFlock(flockCount, 
    gl, 
    state, 
    color=[0.5,0,0], 
    scale=[scale/2,scale/2,scale], 
    type=cube,
  );
  let postFlock = performance.now()
  console.log("flockInit: ", preflock - then);
  console.log("createFlock: ", postFlock - preflock); 

  bin = new Binn(20, state.canvasWidth, state.canvasHeight, state.canvasDepth);
  state.flock.boids[0].preditor = true; // Set preditor
  state.flock.boids[0].maxSpeed = state.flock.boids[0].maxSpeed * 1.5;
  state.flock.boids[0].maxForce = state.flock.boids[0].maxForce * 1.5;
  let postFlockTimer = performance.now();
  console.log("setupTimer: ", postFlockTimer - preFlockTimer);
}

function draw(state, gl) {
  LOOPCOUNT = 0;
  BINCOUNT= 0;
  bin.repopulate(state.flock); 
  state.flock.runFlock(state, bin);
  state.flock.boids.forEach(object => {
    LOOPCOUNT++;
    // object.edges(state);
    // object.avoidObjects(state);
    // object.update(state);
    // let tempColor = vec3.length(object.velocity)/object.maxSpeed;
    // object.material.diffuseColor = [tempColor,0,0];
  });
  // Light preditor
  state.flock.boids[0].material.diffuseColor = [1,1,1];
  state.flock.boids[0].material.ambientColor = [1,1,1];
  state.flock.boids[0].material.specularColor= [1,1,1]; // TODO: Either remove boid specular color or use it instead of flock
  // have light postiion equal preditor
  // state.light[0].position = state.flock.boids[0].position;

  // Movement of planets
  var posy = Math.sin(performance.now()/2000) * state.canvasWidth/2;
  var posx = Math.cos(performance.now()/2000) * state.canvasWidth/2;
  planet.position[0] = posx;
  planet.position[1] = posy;
  planet.position[2] = posx;
  planet2.position[0] = -posx;
  planet2.position[1] = -posy;
  planet2.position[2] = -posx;

  drawScene(state, gl); // FROM drawScene.js
}
