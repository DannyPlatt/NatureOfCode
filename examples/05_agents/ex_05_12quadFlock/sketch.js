// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;
let boidCount = 200;
let timer = 0;
let target;
let timeSlider;
let timeCoeff = 1;
let flock;
let loopCount;
let rangeSize = 50;
let qTreeN = 5;

// create quadtree
let boundary

function setup() {
  frameRate(60);
  lastTime = millis()
  createCanvas(600, 350);
  initPlayButton();
  createControls(350);
  flock = new Flock();
  for (let i = 0; i < boidCount; i++) {
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
  // quadtree setup
  let boundary = new Rectangle(width/2, height/2, width, height )
  qtree = new QuadTree(boundary, qTreeN);
  for (let i = 0; i < boidCount; i++) {
    let point = new Point(flock.boids[i].position.x, flock.boids[i].position.y, flock.boids[i]);
    qtree.insert(point);
  }

  loopCount = 0;
  flock.run();
  // console.log("Loop Count: ", loopCount)

  // draw quadtree
  push();
  qtree.show();
  pop();
  // draw framerate
  push();
  fill(255);  
  rect(5, 0, 90, 50);
  stroke(0);
  strokeWeight(1);
  fill(0);
  text ("fps: " + round(frameRate()), 10,20);
  text ("loops: " + loopCount, 10,35);
  pop()
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


function togglePlay() {
  // Change the words on play button
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
  let now = millis();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;
}

