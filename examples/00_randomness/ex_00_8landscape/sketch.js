// The Nature of Code
// Danny Platt
// use perlin noise to draw the 2 dimentional clouds

let isPlaying = false;
var cols = 0;
var rows = 0;
const scl = 20;
const w = 1000;
const h = 500;
var terrain = [];
startOff = 0;

function setup() {
  frameRate(30);
  initPlayButton();
  createCanvas(600, 400, WEBGL);
  cols = w / scl;
  rows = h / scl;
  terrain = Array(cols).fill(0).map(() => Array(rows).fill(0));

}

function draw() {
  orbitControl();
  if(!isPlaying) 
    return;
  startOff -= 0.1;
  var yOff = startOff;
  for (var y = 0; y < rows; y++) {
    var xOff = 0;
    for (var x = 0; x < cols; x++) {
      noiseDetail(5);
      terrain[x][y] = map(noise(xOff,yOff),0,1,-100,100);
      xOff += 0.1
    }
    yOff += 0.1
  }
  background(0);
  stroke(255);
  noFill();
  rotateX(PI/2.8);
  translate(-w/2, -h/2);
  frameRate(60);
  for (var y = 0; y < rows-1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (var x = 0; x < cols; x++) {
      stroke(map(terrain[x][y], -100, 100, 0, 255), 100, 100);
      vertex(x*scl, y*scl, terrain[x][y]);
      vertex(x*scl, (y+1)*scl, terrain[x][y+1]);
    }
    endShape();
  }
  let fpsButton = createButton(frameRate().toFixed(0))
  fpsButton.position(550, 30);
}

function initPlayButton() {
  let playButton = createButton("Play");
  playButton.position(550, 10);
  playButton.mousePressed(togglePlay);
}

function togglePlay() {
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}

