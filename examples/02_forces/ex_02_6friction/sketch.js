// The Nature of Code
// Daniel Platt
// file: friction/sketch.js

let isPlaying = false;
let box;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  box = new Mover(0,height/2, 2, 40);
  // init a force on the box
  box.applyForce(createVector(40,0))
  initPlayButton();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(100, 100, 255);
  fill(100);
  rect(0,height/2 + box.radius, width, height/2);
  fill(0);
  strokeWeight(0);
  text ("fps: " + round(frameRate()), 10,20);
  strokeWeight(1);
  // Loop through each particle element
  box.update();
  box.show();
  // loop through each planet
  console.log(box.velocity);
  // if (box.velocity.mag() > 0.1) {
  //   calcFrictionForce(box);
  // }
  calcFrictionForce(box);
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

function calcFrictionForce(element){
  let frictionThreshold = 0.2;
  // Calculate the force of gravity based on the equation F = G*m_1*m_2/r^2
  if (element.velocity.mag() < frictionThreshold) {
    element.velocity.setMag(0);
    return
  }
  let c = 0.05;
  let friction = element.velocity.copy();
  friction.mult(-1);
  friction.setMag(c * element.mass * 9.81);
  element.applyForce(friction)
  // element.velocity.mult(0.97)
} 
