// The Nature of Code
// Daniel Platt
// file: applyForces/sketch.js

let isPlaying = false;
let movers = []
let attractors = []
let moverCount = 1000;
let attractorCount =  1;
let mPpx = 2e5;
let gravConst = 1;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  initMovers(moverCount);
  initAttractors(attractorCount);
  initPlayButton();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(0);
  stroke('white');
  strokeWeight(0);
  fill(0);
  // Loop through each mover element
  movers.forEach(element => {
    calcGravForce(element);
    element.show();
  });
  // loop through each attractor
  attractors.forEach(attractor => {
    attractor.show();
  });
}

function mouseMoved() {
  attractors.forEach(attractor => {
    attractor.handleHover(mouseX, mouseY);
  });
}

function mousePressed() {
  attractors.forEach(attractor => {
    attractor.handlePress(mouseX, mouseY);
  });
}
function mouseDragged() {
  attractors.forEach(attractor => {
    attractor.handleHover(mouseX, mouseY);
    attractor.handleDrag(mouseX, mouseY);
  });
}
function mouseReleased() {
  attractors.forEach(attractor => {
    attractor.stopDragging();
  });
}

function initMovers(count) {
  // Create particels at a random point around the canvas with a random starting vector
  for (let i = 0; i < count; i++) {
    movers[i] = new Mover(
      // random(width/2, width),
      random(0 , width),
      height/2, 
      2, 
      3,
      createVector(0, 7),
    ); 
  }
}

function initAttractors(count) {
  // Single Attractor:
  attractors[0] = new Attractor(width/2, height/2, 30, 30);
}

function initPlayButton() {
  let playButton = createButton("Play");
  playButton.position(width-50, 10);
  playButton.mousePressed(togglePlay);
}

function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}

function calcGravForce(mover){
  // Calculate the force of gravity based on the equation F = G*m_1*m_2/r^2
  for (let i = 0; i < attractors.length; i++) {
    let force = attractors[i].attract(mover);
    mover.applyForce(force)
    mover.update()
  }
}
