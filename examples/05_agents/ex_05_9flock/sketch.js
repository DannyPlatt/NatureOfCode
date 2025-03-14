// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let vehicles = [];
let vehicleCount = 120;
let timer = 0;
let target;
let timeSlider;
let timeCoeff = 1;
let flock;
let loopCount;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  initPlayButton();
  createControls(350);
  flock = new Flock();
  for (let i = 0; i < vehicleCount; i++) {
    console.log("here");
    let boid = new Vehicle(width / 2, height / 2, [255,150,255]);
    flock.addBoid(boid);
  }
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(210);
  // Handle deltaTime
  let now = millis();
  timeCoeff = timeSlider.value();
  deltaTime = (now - lastTime) / 1000 * timeCoeff;
  lastTime = now;
  // handle vehicles
  // for (let i = 0; i < vehicles.length; i++) {
  //   let steer = vehicles[i].wander();
  //   // vehicles[i].applyForce(steer)
  //   vehicles[i].edges();
  //   vehicles[i].update();
  //   vehicles[i].show();
  //   vehicles[i].timer += deltaTime;
  // }
  loopCount = 0;
  flock.run();
  console.log("Loop Count: ", loopCount)
}

function createControls(ypos) {
  xpos = 0;
  timeTitle = createP("Target Speed");
  timeTitle.position(xpos, ypos);
  ypos += 35;

  timeSlider = createSlider(0, 4, 2);
  timeSlider.position(xpos,ypos);
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

