let flock;
function setup(state, gl) {
  let flockCount = 500;
  // initBalls(gl,state, flockCount);
  flock = new Flock();
  for (let i = 0; i < flockCount; i++) {
    let boid = new Boid(0, 0, 0, [Math.random(),Math.random(),Math.random()]);
    flock.addBoid(boid);
    boid.stateObj = spawnNewObject(gl, state, sphere, boid.position, [2,2,2], boid.color);
  }
}

function draw(state, gl) {

  // add gravity to all objects
  flock.run();
  flock.boids.forEach(object => {
    if (vec3.sqrLen(object.position) > 10){
      var vecOrigin = vec3.create();
      var vecDirection = vec3.create();
      vec3.sub(vecDirection, vecOrigin, object.position);
      let dirNorm = vec3.normalize(vec3.create(), vecDirection);
      vec3.scale(dirNorm, dirNorm, vec3.sqrLen(vecDirection));
      limit(dirNorm, 8);
      // object.applyForce(dirNorm);
    }
    // object.edges(state);
    object.update();
    object.stateObj.model.position = object.position;
  });
  drawScene(state, gl); // FROM drawScene.js
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
    ball.model.velocity = vec3.fromValues(randomFl(-20, 20), randomFl(-20, 20), randomFl(-50, 50))
  }
}
