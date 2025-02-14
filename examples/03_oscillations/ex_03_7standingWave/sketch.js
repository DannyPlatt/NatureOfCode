// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let movers = [];
let moverCount = 30;
let deltaAngle = 0.3;
let startAngle = 0;
let deltaStartAngle = 0.05
let angle = 0;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  background(210);
  initPlayButton();
  initMovers();
}

function draw() {
  if (!isPlaying){
    return;
  }
  angle = startAngle;
  background(210);
  for (let i = 0; i < movers.length; i++) {
    movers[i].position.y = map(sin(angle), -1, 1, 100, height - 100), 
    movers[i].show();
    angle += deltaAngle;
  }
  startAngle += deltaStartAngle;
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
      i * width / moverCount,
      map(sin(angle), -1, 1, 100, height - 100), 
      30, // starting size is equal to starting mass
      createVector(0,0), // Starting velocity
    ); 
    angle += deltaAngle;
  }
}

function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}
