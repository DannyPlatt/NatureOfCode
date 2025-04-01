let LOOPCOUNT;
let BINCOUNT = 0;
let bin;

function setup(state, gl) {
  let flockCount = 1000;
  let scale = 4;

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
  bin = new Binn(5, state.canvasWidth, state.canvasHeight, state.canvasDepth);
}



function draw(state, gl) {
  LOOPCOUNT = 0;
  BINCOUNT= 0;
  // add gravity to all objects
  bin.repopulate(state.flock); 
  state.flock.run(state, bin);
  state.flock.boids.forEach(object => {
    object.edges(state);
    object.update(state);
    LOOPCOUNT++;
	
    let tempColor = vec3.length(object.velocity)/object.maxSpeed;
    // object.material.diffuseColor = [tempColor,0,0];
    // object.applyForce([0,0,-10]);
  });
  state.flock.boids[state.flock.boids.length-1].material.diffuseColor = [0,0,0];

  drawScene(state, gl); // FROM drawScene.js
  // console.log("LOOPCOUNT: ", LOOPCOUNT)
}


