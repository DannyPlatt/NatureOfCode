// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let pxPerMeter = 6250;
let pxPerCm = pxPerMeter / 100;
let particle;

function resetSketch() {
  lastTime = millis()
  background(210);
  drawGraph(); // Draw Graph
  particle = new Particle(width/2, 2 * pxPerCm);
}

function setup() {
  createCanvas(625, 375);
  resetSketch();
  initButtons();
}

function draw() {
  if (!isPlaying) return;
  background(210);
  drawGraph(); // Draw Graph
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;
  // apply Gravity
  let gravity = createVector(0, 9.81*particle.mass);
  particle.applyForce(gravity);
  particle.update();
  particle.show();
  if (!particle.isAlive()) {
    particle = new Particle(1 * pxPerCm, 5 * pxPerCm);
  }
  pop();
  push();
  fill(100, 255);
  translate(1*pxPerCm, 5 * pxPerCm);
  rectMode(CENTER);
  rotate(PI/6);
  rect(0,0,1.5*pxPerCm, 2*pxPerCm);
  pop();
  push();
  fill(88,57,39);
  stroke(0, 200);
  strokeWeight(10);
  circle(1*pxPerCm,5.5*pxPerCm,1.5*pxPerCm);
  pop();
}

function drawGraph() {
  let lineDist = pxPerMeter/100;
  let xCount = width / pxPerMeter;
  let yCount = height / pxPerMeter;
  push()
  strokeWeight(1);
  stroke(0,50);
  // Draw verticle lines
  for (let x = 0; x <= width; x+= lineDist) {
    line(x, 0, x,  height);
  }
  // Draw horizontal lines
  for (let y = 0; y <= height; y+= lineDist) {
    line(0, y, width, y);
  }


}

function initButtons() {
  // draw Play button
  let playButton = createButton("Play");
  playButton.position(width-50, 10);
  playButton.mousePressed(togglePlay);

  // Draw Reset button
  let resetButton = createButton("Reset");
  resetButton.position(width-50, 40);
  resetButton.mousePressed(resetSketch);
}


function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}
