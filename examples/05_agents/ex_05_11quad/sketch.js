// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = true;
let deltaTime = 0;
let lastTime = 0;
let vehicles = [];
let vehicleCount = 120;
let timer = 0;
let target;
let timeSlider;
let timeCoeff = 1;
let flock;
let grid;
let gridRes = 100;
let cols;
let rows;
let loopCount = 0;
let qtree;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  // initPlayButton();
  // createControls(350);
  // create quadTree
  let boundary = new Rectangle(width/2, height/2, width/2, height/2);
  qtree = new QuadTree(boundary, 4);
  // for (let i = 0; i < 150; i++) {
  //   let p = new Point(random(width), random(height));
  //   qtree.insert(p);
  // }
  


  flock = new Flock();
  for (let i = 0; i < vehicleCount; i++) {
    let boid = new Vehicle(width / 2, height / 2, [255,150,255]);
    flock.addBoid(boid);
  }
}

function draw() {
  loopCount = 0;
  if (!isPlaying){
    return;
  }
  background(30);
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000 * timeCoeff;
  lastTime = now;
  // repopGrid();
  // flock.run();
  console.log("loopCount: ", loopCount);
  qtree.show();
  if (mouseIsPressed) {
    let newPoint = new Point(mouseX, mouseY);
    qtree.insert(newPoint);
  }

  stroke (0, 255, 0);
  rectMode(CENTER);
  let range = new Rectangle(250, 250, 107, 75);
  rect(range.x, range.y, range.w * 2, range.h * 2);
  let points = qtree.query(range);
  for (let point of points) {
    strokeWeight(4)
    point.show();
  }
  console.log(points);


}

function repopGrid() {
  // Each frame, the grid is reset to empty arrays.
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = [];
      loopCount++;
    }
  }
  // Place each boid into the appropriate cell in the grid.
  for (let boid of flock.boids) {
    // Find the right column and row.
    let column = floor(boid.position.x / gridRes);
    let row = floor(boid.position.y / gridRes);
    // Constrain to the limits of the array.
    column = constrain(column, 0, cols - 1);
    row = constrain(row, 0, rows - 1);
    // Add the boid.
    grid[column][row].push(boid);
    loopCount++;
  }
}

function initGrid() {
  cols = floor(width/gridRes);
  rows = floor(height/gridRes);
  grid = new Array(cols);
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(rows);
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = [];
      loopCount++;
    }
  }
}

function createControls(ypos) {
  xpos = 0;
  timeTitle = createP("Target Speed");
  timeTitle.position(xpos, ypos);
  ypos += 35;

  timeSlider = createSlider(0, 1000, 120);
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

