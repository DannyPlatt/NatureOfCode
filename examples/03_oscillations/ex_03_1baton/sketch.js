// The Nature of Code
// Daniel Platt
// Chapter: 
let angle = 0
let velocity = 0.2;
let accel = 4; // 4 rads / second
let xAxisOffset;
let dZAxis = 0.01;
let deltaTime = 0;
let lastTime = 0;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  xAxisOffset = -50;
  lastTime = millis()
}

function draw() {
  background(210);

  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  // Translate to center of page
  translate(width/2, height/2);
  rotate(angle)
  // tranlsate again after rotation. This moves the drawing aaong the x axis
  translate(xAxisOffset, 0);
  fill(150);
  rect(-50, -2, 100, 4);
  fill(255, 0, 0);
  circle(-50, 0, 20);
  fill(0, 255, 0);
  circle(50, 0, 20);

  // Update Parameters
  angle += velocity * deltaTime;
  velocity += accel * deltaTime;
  xAxisOffset += velocity * deltaTime;

  if (Math.abs(velocity) > 20) {
    accel *= -1;
  }

  
}
