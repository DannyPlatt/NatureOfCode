let flock;
let LOOPCOUNT = 0;

function setup(state, gl) {
  let flockCount = 0;
  // initBalls(gl,state, flockCount);
  flock = new Flock();
  for (let i = 0; i < flockCount; i++) {
    let boid = spawnNewObject(
      gl = gl, 
      objectList = state.objects.boids, 
      // position = vec3.scale(vec3.create(), vec3.random(vec3.create()), 5), 
      position = vec3.random(vec3.create(), 5),
      velocity = vec3.random(vec3.create(), 20),
      color = [Math.random(),Math.random(), Math.random(), 1], 
      scale = [2,2,2], 
      mass = 1, 
      type = sphere,
    );
    flock.addBoid(boid);
  }
}

function draw(state, gl) {
  // add gravity to all objects
  // flock.run();
  flock.boids.forEach(object => {
    object.edges(state);
    object.update(state);
    LOOPCOUNT++;
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
    let ball = spawnNewObject(gl, state.objects.environment, type, position, scale, color)
    ball.velocity = vec3.fromValues(randomFl(-100, 100), randomFl(-100, 100), randomFl(-50, 50))
  }
}
