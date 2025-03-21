let flock;
let LOOPCOUNT = 0;

function setup(state, gl) {
  let flockCount = 1000;
  // initBalls(gl,state, flockCount);
  flock = new Flock();
  for (let i = 0; i < flockCount; i++) {
    let boid = new Boid(0, 0, 0, [Math.random(),Math.random(),Math.random()]);
    boid.velocity = vec3.fromValues(randomFl(50, 50), randomFl(-20, 20), randomFl(-20, 20))
    flock.addBoid(boid);
    boid.stateObj = spawnNewObject(gl, state, sphere, boid.position, [2,2,2], boid.color);
  }
}

function draw(state, gl) {

  // add gravity to all objects
  // flock.run();
  flock.boids.forEach(object => {
    object.edges(state);
    object.update();
    object.stateObj.model.position = object.position;
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
    let ball = spawnNewObject(gl, state, type, position, scale, color)
    ball.velocity = vec3.fromValues(randomFl(-100, 100), randomFl(-100, 100), randomFl(-50, 50))
  }
}
