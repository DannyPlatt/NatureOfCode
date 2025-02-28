// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let pxPerMeter = 625;
let pxPerCm = pxPerMeter / 100;
let emitters = [];
let timeConst = .4;
let repeller;
let repeller2;
let repeller3;

function resetSketch() {
  lastTime = millis()
  background(210);
  drawGraph(); // Draw Graph
  emitters = [];
}

function setup() {
  createCanvas(625, 375);
  resetSketch();
  initButtons();
  repeller = new Repeller(width/6, height * 3 / 4);
  repeller2 = new Repeller(width*5/6, height *3 / 4);
  repeller3 = new Repeller(width/2, height *1 / 4);
  background(210);
}

function draw() {
  blendMode(ADD);
  clear();
  background(0);
  frameRate(60);
  if (!isPlaying) return;
  fill(0);
  text ("fps: " + round(frameRate()), 10,20);
  drawGraph(); // Draw Graph
  // Handle deltaTime
  let now = millis();
  deltaTime = ((now - lastTime) * timeConst) / (1000);
  lastTime = now;

  for (let i = emitters.length-1; i >= 0; i--) {
    // emitters[i].applyGravity();
    emitters[i].applyRepeller(repeller);
    emitters[i].applyRepeller(repeller2);
    emitters[i].applyRepeller(repeller3);
    emitters[i].run();
    if (emitters[i].isAlive()) {
      emitters[i].addParticle();
    }
    // Note that if particleRate rises above framerate,
    // this does not allow emitters to spawn
    if (emitters[i].particles.length == 0) {
      emitters.splice(i,1);
    }
  }
  repeller.show();
  repeller2.show();
  repeller3.show();
}

function mousePressed() {
  // Do not allow emitters in the button area
  if ((mouseX < width - 50) || mouseY > 50) {
    emitters.push(new Emitter(mouseX, mouseY));
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
