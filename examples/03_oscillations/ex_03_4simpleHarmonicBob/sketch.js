// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let movers = [];
let moverCount = 3;

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
  let now = millis() / 1000;
  deltaTime = (now - lastTime);
  lastTime = now;
  for (let i = 0; i < movers.length; i++) {
    let frequency = 3;
    let amplitude = height/2
    let yPosition = amplitude * sin((TWO_PI) * now/frequency + i) + height/2;
    movers[i].position.y = yPosition;
    movers[i].update();
    movers[i].show();
    line(movers[i].position.x, height/2, movers[i].position.x, movers[i].position.y);
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
      width * (i+1)/(moverCount + 1),
      height/2,
      10, // starting size is equal to starting mass
      createVector(0,0), // Starting velocity
    ); 
  }
}

function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}
