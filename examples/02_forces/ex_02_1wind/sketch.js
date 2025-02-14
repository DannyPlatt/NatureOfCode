// The Nature of Code
// Daniel Platt
// file: applyForces/sketch.js

let isPlaying = false;
let particles = [];
let particleCount = 20;
let gravity;
let windForce = 100000; //10 joules of energy from wind
let deltaTime = 0;
let lastTime = 0;

function setup() {
  frameRate(60);
  createCanvas(600, 350);
  initParticles(particleCount);
  gravity = createVector(0,0.9);

  // create a play button
  initPlayButton();
  lastTime = millis(); // init lastTime
}

function draw() {
  if (!isPlaying){
    return;
  }
  let now = millis();
  deltaTime = (now - lastTime) / 1000 // convert ms to seconds
  lastTime = now;
  background(210);
  strokeWeight(0);
  fill(0);
  text ("fps: " + round(frameRate()), 10,20);
  strokeWeight(1);
  let mouse = createVector(mouseX, mouseY);
  particles.forEach(element => {
    if(mouseIsPressed){
      // Get the direction of the force
      var attractionForce = p5.Vector.sub(mouse, element.position).normalize();
      // the further out the ball, the less affected by the force. F = Constant/(mouse - position)
      attractionForce.mult(-windForce).div(PI * p5.Vector.dist(mouse, element.position));
      element.applyForce(attractionForce);
      // slow each element down a bit
      element.velocity.mult(0.999);
    }
    wallForce(element);
    element.update();
    element.show();
  });

}

function initParticles(count) {
  for (let i = 0; i < count; i++) {
    particles[i] = new Mover(width/2, height/2, random(5,20));
  }
}

function initPlayButton() {
  let playButton = createButton("Play");
  playButton.position(width-50, 10);
  playButton.mousePressed(togglePlay);
}

function togglePlay() {
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}

function wallForce(element) {
  // create a force pushing out form each wall
  // top
  element.applyForce(createVector(0,100 * height/(element.position.y)));
  // bottom
  element.applyForce(createVector(0, 100 * -height/(height - element.position.y)));
  // left
  element.applyForce(createVector(100 * width/(element.position.x), 0));
  // right
  element.applyForce(createVector(100 * -width/(width - element.position.x), 0));
}
