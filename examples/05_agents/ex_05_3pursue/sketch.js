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

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  background(210);
  initPlayButton();
  initVehicles();
  target = new Target();
  createControls(400);
}

function draw() {
  if (!isPlaying){
    return;
  }
  timeCoeff = timeSlider.value();
  background(210);
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000 * timeCoeff;
  lastTime = now;
  for (let i = 0; i < vehicles.length; i++) {
    let steer = vehicles[i].pursuit(target);
    if (p5.Vector.dist(vehicles[i].position, target.position) < 100) {
      steer = vehicles[i].seek(target.position);
    }
    vehicles[i].applyForce(steer)
    vehicles[i].update();
    vehicles[i].show();
    vehicles[i].timer += deltaTime;
    if (Math.abs(target.position.x - vehicles[i].position.x) < target.radius &&
      Math.abs(target.position.y - vehicles[i].position.y) < target.radius) {
      target = new Target();
    }
  }
  target.show();
}

function createControls(ypos) {
  xpos = 0;
  timeTitle = createP("Speed");
  timeTitle.position(xpos, ypos);
  xpos += 50;

  timeSlider = createSlider(0, 3, 1);
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
  let seekStyle = 1
  for (let i = 0; i < vehicleCount; i++) {
    vehicles[i] = new Vehicle(
      // random(width/2, width),
      random(0, width),
      random(0,height), 
      seekStyle,
      [255, (seekStyle >= 1)? 255: 0, 255],
    ); 
    seekStyle *= -1;
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

class Target {
  constructor() {
    this.position = createVector(random(0, width), random(0, height));
    this.velocity = createVector(random(-10, 10), random(-10, 10));
    this.radius = 20;
  }
  show() {
    this.position.add(this.velocity);
    if(this.position.x < 0) {
      this.velocity.x *= -1;
      this.position.x = 0;
    }
    if(this.position.x > width) {
      this.velocity.x *= -1;
      this.position.x = width;
    }
    if(this.position.y < 0) {
      this.velocity.y *= -1;
      this.position.y = 0;
    }
    if(this.position.y > height) {
      this.velocity.y *= -1;
      this.position.y = height;
    }
    push();
    fill(0, 255, 0);
    circle(this.position.x, this.position.y, this.radius);
    pop();
  }
}
