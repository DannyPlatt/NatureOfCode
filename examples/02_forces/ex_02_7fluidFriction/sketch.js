// The Nature of Code
// Daniel Platt
// file: friction/sketch.js

let isPlaying = false;
let liquid;
let movers = [];

class Liquid {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }
  show() {
    noStroke();
    fill(0,0,205);
    rect(this.x, this.y, this.w, this.h);
  }
  contains(mover) {
    let pos = mover.position;
    return (pos.x > this.x && pos.x < this.x + this.w && 
      pos.y > this.y && pos.y < this.y + this.h);
  }

  calcDragForce(mover){
    // Calculate the force of gravity based on the equation F = G*m_1*m_2/r^2
    let speed = mover.velocity.mag();
    let dragMagnitude = this.c * speed * speed;
    let dragForce = mover.velocity.copy();
    dragForce.mult(-1);
    dragForce.setMag(dragMagnitude);
    return dragForce;
  } 
}

function reset() {
  // redraw the boxes
  console.log("reset!");
  for (let i = 0; i < 8; i++) {
    movers[i] = new Mover(40 + i * 70, 0, random(1, 5));
  }
}

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  reset();
  liquid = new Liquid(0,height/2, width, height/2, 0.1);
  // init a force on the box
  initPlayButton();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(120, 180, 250);
  liquid.show();
  fill(0);
  strokeWeight(0);
  text ("fps: " + round(frameRate()), 10,20);
  strokeWeight(1);

  // Loop through each particle element
  for (let i = 0; i < movers.length; i++) {
    // is mover in liquid)
    if(liquid.contains(movers[i])) {
      let dragForce = liquid.calcDragForce(movers[i]);
      movers[i].applyForce(dragForce);
    }
    // apply gravity
    let gravity = createVector(0,0.1 * movers[i].mass);
    movers[i].applyForce(gravity);
    movers[i].update();
    movers[i].show();
    movers[i].checkEdges();
  // loop through each planet
  }
}
 function mousePressed() {
   reset();
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
}


