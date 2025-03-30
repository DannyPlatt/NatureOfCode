let flock;
let LOOPCOUNT;
let BINCOUNT = 0;
let bin;

function setup(state, gl) {
  let flockCount = 6000;
  let scale = 4;

  // initBalls(gl,state, flockCount);
  flock = new Flock(gl);
  initBuffers( // TODO move into createFlock
    gl, flock, 
    sphere.vertices.flat(), 
    sphere.triangles.flat(), 
    sphere.normals.flat()
  )
  flock.createFlock(flockCount, 
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
  bin.repopulate(flock); 
  flock.run(state, bin);
  flock.boids.forEach(object => {
    object.edges(state);
    object.update(state);
    LOOPCOUNT++;
	
    //object.material.diffuseColor = [object.velocity[0], object.velocity[1], object.velocity[2]];
    let tempColor = vec3.length(object.velocity)/object.maxSpeed;
    object.material.diffuse = [tempColor,0,0];
    // object.applyForce([0,0,-10]);
  });
  flock.boids[flock.boids.length-1].material.diffuseColor = [0,0,0];

  drawScene(state, gl, flock); // FROM drawScene.js
  // console.log("LOOPCOUNT: ", LOOPCOUNT)
}


