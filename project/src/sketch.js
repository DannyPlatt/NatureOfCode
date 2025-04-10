let LOOPCOUNT;
let BINCOUNT = 0;
let bin;
let planet;

function setup(state, gl) {
  let flockCount = 100;
  let scale = 6;

  // initBalls(gl,state, flockCount);
  let then = performance.now();
  state.flock = new Flock(gl);
  initBuffers( 
    gl, state.flock, 
    sphere.vertices.flat(), 
    sphere.triangles.flat(), 
    sphere.normals.flat()
  )
  let preflock = performance.now();
  state.flock.createFlock(flockCount, 
    gl, 
    state, 
    color=[0.5,0,0], 
    scale=[scale,scale,scale], 
    type=sphere
  );
  let postFlock = performance.now()
  console.log("flockInit: ", preflock - then);
  console.log("createFlock: ", postFlock - preflock); 

  bin = new Binn(15, state.canvasWidth, state.canvasHeight, state.canvasDepth);
  state.flock.boids[0].preditor = true; // Set preditor
}

function draw(state, gl) {
  LOOPCOUNT = 0;
  BINCOUNT= 0;
  bin.repopulate(state.flock); 
  state.flock.runFlock(state, bin);
  state.flock.boids.forEach(object => {
    LOOPCOUNT++;
    let tempColor = vec3.length(object.velocity)/object.maxSpeed;
    object.material.diffuseColor = [tempColor,0,0];
  });
  // Light preditor
  state.flock.boids[0].material.diffuseColor = [1,1,1];
  state.flock.boids[0].material.ambientColor = [1,1,1];
  state.flock.boids[0].material.specularColor= [1,1,1]; // TODO: Either remove boid specular color or use it instead of flock
  // have light postiion equal preditor
  state.light[0].position = state.flock.boids[0].position;

  // Movement of planets


  drawScene(state, gl); // FROM drawScene.js
}
