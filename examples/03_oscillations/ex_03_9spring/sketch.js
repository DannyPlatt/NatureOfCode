// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;

let mover;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  background(210);
  initPlayButton();
  mover = new Mover(width/2, height/2, 10, createVector(-30,0))
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
  // calculate distance from center
  let restLength = 100; //100 pixels
  let centerVec = createVector(width/2, height/2);
  let dist = p5.Vector.sub(centerVec, mover.position);
  let currentLength = dist.mag();
  let x = currentLength - restLength;
  let k = 10;
  force = createVector(-1 * x * k, 0); // restoring force with k = 0.1
  mover.applyForce(force);
  mover.update();
  mover.show();
  line(width/2, height/2, mover.position.x, mover.position.y);
  push()
  if (x < 0) {
    stroke(255, 0, 0);
  }
  else {
    stroke(0,150,0);
  }
  strokeWeight(5);

  line(width/2 + 100, height/2 + 100, mover.position.x, mover.position.y + 100);
  pop();
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
