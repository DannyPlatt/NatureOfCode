// The Nature of Code
// Daniel Platt
// file: applyForces/sketch.js

let isPlaying = false;
let particles = [];
let particleCount = 20;
let gravity;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  initParticles(particleCount);
  gravity = createVector(0,0.9);

  // create a play button
  initPlayButton();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(210);
  strokeWeight(0);
  fill(0);
  text ("fps: " + round(frameRate()), 10,20);
  strokeWeight(1);
  let mouse = createVector(mouseX, mouseY);
  particles.forEach(element => {
    element.applyGravity(gravity);
    if(mouseIsPressed){
      // Get the direction of the force
      var attractionForce = p5.Vector.sub(mouse, element.position).normalize();
      // the further out the ball, the less affected by the force. F = Constant/(mouse - position)
      attractionForce.mult(1000/p5.Vector.dist(mouse, element.position)).limit(8);
      element.applyForce(attractionForce);
      // slow each element down a bit
      element.velocity.mult(0.999);
    }
    element.update();
    element.show();
  });

}

function initParticles(count) {
  for (let i = 0; i < count; i++) {
    particles[i] = new Mover(width/2, height/2, random(5,10));
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
