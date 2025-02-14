// The Nature of Code
// Daniel Platt
// Chapter: 

let deltaTime = 0;
let lastTime = 0;
let mover;
let radius = 20

function setup() {
  frameRate(60);
  lastTime = millis()
  createCanvas(600, 350);
  mover = new Mover(0, height/2, radius, createVector(0, 0))
}

function draw() {
  background(210);
  rect(0, (height/2) + radius, width, 0);
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  mover.update()
  mover.show()
  force = 40;
  if (mover.position.x > width/2) {
    mover.acceleration = createVector(-force, 0);
    // mover.applyForce(createVector(-force, 0)); // moving at 10
    mover.angleAccel = -force/((radius));
  }
  else {
    mover.acceleration = createVector(force, 0);
    // mover.applyForce(createVector(force, 0)); // moving at 10
    mover.angleAccel = force/((radius));
  }
}
