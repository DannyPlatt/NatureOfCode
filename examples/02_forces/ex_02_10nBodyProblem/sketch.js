// The Nature of Code
// Daniel Platt
// file: applyForces/sketch.js

let isPlaying = false;
let movers = []
let moverCount = 20;
let mPpx = 2e5;
let gravConst = 10;
let attractor;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  initMovers(moverCount);
  initPlayButton();
  attractor = new Attractor(width/2, height/2, 2, 2);
  console.log(attractor);
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
  for (let i = 0; i < movers.length; i++) {
    for (let j = 0; j < movers.length; j++) {
      if (i != j) {
        let force = movers[j].attract(movers[i]);
        movers[i].applyForce(force);
      }
    }
    force = attractor.attract(movers[i]);
    movers[i].applyForce(force);
    movers[i].update();
    movers[i].show();
  }
}

function initMovers(count) {
  // Create particels at a random point around the canvas with a random starting vector
  for (let i = 0; i < count; i++) {
    movers[i] = new Mover(
      // random(width/2, width),
      random(0, width),
      random(0,height), 
      random(1,10), // starting size is equal to starting mass
      createVector(0,0), // Starting velocity
    ); 
  }
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

