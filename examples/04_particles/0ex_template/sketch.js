// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let movers = [];
let moverCount = 1;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  background(210);
  initPlayButton();
  initMovers();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(210);
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;
  for (let i = 0; i < movers.length; i++) {
    movers[i].update();
    movers[i].show();
  }
}


function initPlayButton() {
  let playButton = createButton("Play");
  playButton.position(width-50, 10);
  playButton.mousePressed(togglePlay);
}

function initMovers() {
  // Create particels at a random point around the canvas with a random starting vector
  for (let i = 0; i < moverCount; i++) {
    movers[i] = new Mover(
      // random(width/2, width),
      random(0, width),
      random(0,height), 
      random(1,10), // starting size is equal to starting mass
      createVector(0,0), // Starting velocity
    ); 
  }
}

function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}
