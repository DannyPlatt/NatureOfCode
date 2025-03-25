let flock;
let LOOPCOUNT;
let bin;

function setup(state, gl) {
  let flockCount = 1000;
  // initBalls(gl,state, flockCount);
  flock = new Flock();
  bin = new Binn(2, state.canvasWidth, state.canvasHeight, state.canvasDepth);
  for (let i = 0; i < flockCount; i++) {
    let boid = spawnNewBoid(
      gl = gl, 
      objectList = state.objects.boids, 
      // position = vec3.random(vec3.create(), 5),
      position = vec3.fromValues(0,randomFl(-2, 2), randomFl(-2, 2)),
      velocity = vec3.fromValues(0,randomFl(-20, 20), randomFl(-20, 20)),
      // velocity = vec3.fromValues(randomFl(-20,20),randomFl(-20, 20), randomFl(-20, 20)),
      // color = [randomFl(0,1),randomFl(0, 1), randomFl(0, 1)],
      color = [0.2,0.2,0.2],
      scale = [2,2,2], 
      mass = 1, 
      type = sphere,
      radius = 2,
    );
    flock.addBoid(boid);
  }
  // flock.boids[flock.boids.length-1].position[0] = 10; 
  flock.boids[flock.boids.length-1].scale = [3,3,3]; 
}



function draw(state, gl) {
  // add gravity to all objects
  bin.repopulate(flock); 
  flock.run(state, bin);
  flock.boids.forEach(object => {
    object.edges(state);
    object.update(state);
    LOOPCOUNT++;
	
    //object.material.diffuseColor = [object.velocity[0], object.velocity[1], object.velocity[2]];
    let tempColor = vec3.length(object.velocity)/object.maxSpeed;
    object.material.diffuseColor = [tempColor,0,0];
    // object.applyForce([0,0,-10]);
  });
  flock.boids[flock.boids.length-1].material.diffuseColor = [0,0,0];

  drawScene(state, gl); // FROM drawScene.js
  // console.log("LOOPCOUNT: ", LOOPCOUNT)
  LOOPCOUNT = 0;
}


