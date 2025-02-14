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
  // attract towards mouse

  for (let i = 0; i < movers.length; i++) {
    let force = calcMouseAttraction(movers[i]);
    movers[i].applyForce(force);
    movers[i].update();
    movers[i].show();
  }
}
function calcMouseAttraction(mover) {
  let mouseVec = createVector(mouseX, mouseY);
  let vecForce = p5.Vector.sub(mouseVec, mover.position);
  vecForce.setMag(3000);
  console.log(vecForce);
  return vecForce;
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
      width/2,
      height/2,
      10, // starting size is equal to starting mass
      createVector(30,50), // Starting velocity
    ); 
  }
}

function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}
