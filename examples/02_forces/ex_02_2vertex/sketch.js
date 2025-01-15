// The Nature of Code
// Daniel Platt
// file: applyForces/sketch.js

let isPlaying = false;
let particles = [];
let particleCount = 5;
let gravity;
let windForce = 1000; //10 joules of energy from wind

function setup() {
  frameRate(30);
  createCanvas(600, 350, WEBGL);
  initParticles(particleCount);
  gravity = createVector(0,0.9);

  // create a play button
  initPlayButton();
}

function draw() {
  translate(-width/2, -height/2);
  if (!isPlaying){
    return;
  }
  background(210);
  fill(0);
  strokeWeight(0);
  let mouse = createVector(mouseX, mouseY);
  beginShape(TESS);
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
  endShape(CLOSE);

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
  element.applyForce(createVector(0,height/(element.position.y)));
  // bottom
  element.applyForce(createVector(0, -height/(height - element.position.y)));
  // left
  element.applyForce(createVector(width/(element.position.x), 0));
  // right
  element.applyForce(createVector(-width/(width - element.position.x), 0));
}
