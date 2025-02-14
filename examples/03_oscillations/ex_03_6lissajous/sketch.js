// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let movers = [];
let moverCount = 3;

function setup() {
  frameRate(60);
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
  // Handle deltaTime
  let now = millis() / 1000;
  deltaTime = (now - lastTime);
  lastTime = now;
  for (let i = 0; i < movers.length; i++) {
    let period = 3;
    let amplitude = height/2
    let yPosition = amplitude * sin((TWO_PI) * now/period + i) + height/2;
    movers[i].position.y = yPosition;
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
      width * (i+1)/(moverCount + 1), // base X position
      height/2, // height
      .5 + i/8, // vertical period
      height/3, // vertical amplitude
      1 - i/4, // horizontal period
      width/9 // horizontal amplitude
      // map(i, 0, moverCount, height/5, height/2) // Amplitude
    ); 
  }
}

function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}
