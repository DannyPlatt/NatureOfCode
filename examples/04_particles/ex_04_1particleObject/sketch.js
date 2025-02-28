// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let pxPerMeter = 6250;
let pxPerCm = pxPerMeter / 100;
let particle;
let particleCount = 100;
let particles = [];

function resetSketch() {
  lastTime = millis()
  background(210);
  drawGraph(); // Draw Graph
  for (let i = 0; i < particleCount; i++) {
    particles[i] = new Particle(width/2, 2 * pxPerCm);
  }
}

function setup() {
  createCanvas(625, 375);
  resetSketch();
  initButtons();
}

function draw() {
  frameRate(60);
  if (!isPlaying) return;
  background(210);
  drawGraph(); // Draw Graph
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 5000;
  lastTime = now;

  // Handle Particles
  // Currently adding per frame rather than time based
  particles.push(new Particle(mouseX, mouseY));
  for (let i = particles.length -1; i >= 0; i--) {
    let particle = particles[i];
    particle.run();
    // Remove particle if dead
    if (!particle.isAlive()){
      particles.splice(i, 1);
    }
  }
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
  pop();
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
