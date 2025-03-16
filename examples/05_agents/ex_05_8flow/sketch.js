// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let vehicles = [];
let vehicleCount = 1500;
let timer = 0;
let timeSlider;
let timeCoeff = 1;
let flowfield;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  background(210);
  initPlayButton();
  initVehicles();
  createControls(350);
  vehicles[0].velocity;
  initFlow();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(210);
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000 * timeCoeff;
  lastTime = now;

  // handle flowfield
  flowfield.draw();

  // handle vehicles
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].follow(flowfield);
    vehicles[i].edges();
    vehicles[i].update();
    vehicles[i].show();
    vehicles[i].timer += deltaTime;
  }
  stroke(0);
  strokeWeight(1);
  fill(0);
  text ("fps: " + round(frameRate()), 10,20);
}

function createControls(ypos) {
  xpos = 0;
  timeTitle = createP("New Path");
  timeTitle.position(xpos, ypos);
  ypos += 35;

  timeSlider = createButton("Reload");
  timeSlider.position(xpos,ypos);
  timeSlider.mousePressed(initFlow);
  timeSlider.size(120);
}

function initFlow() {
  flowfield = new FlowField();
}

function debugToggle() {
    if (debug) {
      dubug = false;
    }
    else {
      debug = true;
    }
}

function initPlayButton() {
  let playButton = createButton("Play");
  playButton.position(width-50, 10);
  playButton.mousePressed(togglePlay);
}

function initVehicles() {
  // Create particels at a random point around the canvas with a random starting vector
  for (let i = 0; i < vehicleCount; i++) {
    vehicles[i] = new Vehicle(
      // random(width/2, width),
      random(0, width),
      random(0,height), 
      [255, 0,0 ],
    ); 
  }
}

function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
  let now = millis();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;
}

