let flock;
let LOOPCOUNT;

function setup(state, gl) {
  let flockCount = 3000;
  // initBalls(gl,state, flockCount);
  flock = new Flock();
  for (let i = 0; i < flockCount; i++) {
    let boid = spawnNewBoid(
      gl = gl, 
      objectList = state.objects.boids, 
      // position = vec3.random(vec3.create(), 5),
      position = vec3.fromValues(0,randomFl(-2, 2), randomFl(-2, 2)),
      // velocity = vec3.fromValues(0,randomFl(-20, 20), randomFl(-20, 20)),
      velocity = vec3.fromValues(randomFl(-20,20),randomFl(-20, 20), randomFl(-20, 20)),
      // color = [randomFl(0,1),randomFl(0, 1), randomFl(0, 1)],
      color = [0.2,0.2,0.2],
      scale = [2,2,2], 
      mass = 1, 
      type = sphere,
      radius = 2,
    );
    flock.addBoid(boid);
  }
}

function draw(state, gl) {
  // add gravity to all objects
  // flock.run(state);
  flock.boids.forEach(object => {
    object.edges(state);
    object.update(state);
    LOOPCOUNT++;
	
    //object.material.diffuseColor = [object.velocity[0], object.velocity[1], object.velocity[2]];
	let tempColor = vec3.length(object.velocity)/object.maxSpeed;
	  object.material.diffuseColor = [tempColor,0,0];
	  object.applyForce([0,0,-20]);
  });
  drawScene(state, gl); // FROM drawScene.js
  // console.log("LOOPCOUNT: ", LOOPCOUNT)
  LOOPCOUNT = 0;
}

function initBalls(gl,state, count) {
  let ballCount = count;
  let type = sphere;
  let w = state.canvasWidth/4;
  let scaleSize = 1
  for (let i = 0; i < ballCount; i++) {
    let position = [randomInt(-w, w), randomInt(1, w), randomInt(-w, w)];
    let scale = [scaleSize, scaleSize, scaleSize];
    let color = [Math.random(),Math.random(),Math.random()]
    ball.velocity = vec3.fromValues(randomFl(-100, 100), randomFl(-100, 100), randomFl(-50, 50))
  }
}
