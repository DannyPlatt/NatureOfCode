// The Nature of Code
// Daniel Platt
// Chapter: 

let particles = [];
let isPlaying = false;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  initParticles(10);
  initPlayButton();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(210);
  strokeWeight(0);
  fill(0);
  text ("fps: " + round(frameRate()), 10,20);
  strokeWeight(1);
  let mouse = createVector(mouseX, mouseY);
  particles.forEach(element => {
    // element.acceleration.x = map(mouse.x - element.position.x, -width/2, width/2, -1, 1);
    // element.acceleration.y = map(mouse.y - element.position.y, -height/2, height/2, -1, 1);
    element.acceleration.x = 120/(mouse.x - element.position.x);
    element.acceleration.y = 120/(mouse.y - element.position.y);
    // element.acceleration = p5.Vector.sub(mouse, element.position).normalize();
    // element.acceleration.mult(200/p5.Vector.dist(mouse, element.position));
    element.update();
    element.show();
  });
}

function initParticles(count) {
  for (let i = 0; i < count; i++) {
    particles[i] = new Mover(width/2, height/2, 3);
  }
}

function initPlayButton() {
  let playButton = createButton("Play");
  playButton.position(width-50, 10);
  playButton.mousePressed(togglePlay);
}

function togglePlay() {
  isPlaying = !isPlaying;
  this.html(isPlaying ? "Pause" : "Play"); // Update button text
}
