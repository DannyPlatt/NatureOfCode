// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let vehicles = [];
let vehicleCount = 1;
let timer = 0;
let target;
let timeSlider;
let timeCoeff = 1;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  background(210);
  initPlayButton();
  initVehicles();
  target = new Target(random(width), random(height), [0,255,255]);
  createControls(350);
}

function draw() {
  if (!isPlaying){
    return;
  }
  target.maxSpeed = timeSlider.value();
  background(210);
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000 * timeCoeff;
  lastTime = now;
  // handle vehicles
  for (let i = 0; i < vehicles.length; i++) {
    let steer = vehicles[i].pursuit(target);
    vehicles[i].applyForce(steer)
    vehicles[i].update();
    vehicles[i].show();
    vehicles[i].timer += deltaTime;
    if (Math.abs(target.position.x - vehicles[i].position.x) < vehicles[i].radius*3 &&
      Math.abs(target.position.y - vehicles[i].position.y) < vehicles[i].radius*3) {
      target = new Target(random(width), random(height), [0,255,255]);
    }
    console.log("HERE");
    let targetSteer = target.flee(vehicles[i]);
    console.log("HERE2");
    target.applyForce(targetSteer);
  }
  // handle targets
  target.edges();
  target.update();
  target.show();
}

function createControls(ypos) {
  xpos = 0;
  timeTitle = createP("Target Speed");
  timeTitle.position(xpos, ypos);

  timeSlider = createSlider(200, 500, 300);
  timeSlider.position(xpos,ypos + 30);
  timeSlider.size(120);
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

