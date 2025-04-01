let LOOPCOUNT;
let BINCOUNT = 0;
let bin;

function setup(state, gl) {
  let flockCount = 1000;
  let scale = 6;

  // initBalls(gl,state, flockCount);
  state.flock = new Flock(gl);
  initBuffers( // TODO move into createFlock
    gl, state.flock, 
    sphere.vertices.flat(), 
    sphere.triangles.flat(), 
    sphere.normals.flat()
  )
  state.flock.createFlock(flockCount, 
    gl, 
    state, 
    color=[0.5,0,0], 
    scale=[scale,scale,scale], 
    type=sphere
  );
  bin = new Binn(15, state.canvasWidth, state.canvasHeight, state.canvasDepth);
  state.flock.boids[0].preditor = true; // Set preditor
}

function draw(state, gl) {
  LOOPCOUNT = 0;
  BINCOUNT= 0;
  // add gravity to all objects
  bin.repopulate(state.flock); 
  state.flock.runFlock(state, bin);
  state.flock.boids.forEach(object => {
    // object.edges(state);
    // object.update(state);
    LOOPCOUNT++;
	
    let tempColor = vec3.length(object.velocity)/object.maxSpeed;
    object.material.diffuseColor = [tempColor,0,0];
    // object.applyForce([0,0,-10]);
  });
  state.flock.boids[0].material.diffuseColor = [1,1,1];
  state.flock.boids[0].material.ambientColor = [1,1,1];
  state.flock.boids[0].material.specularColor= [1,1,1];
  // have light postiion equal preditor
  state.light[0].position = state.flock.boids[0].position;

  drawScene(state, gl); // FROM drawScene.js
  // console.log("LOOPCOUNT: ", LOOPCOUNT)
}


