// The Nature of Code
// Daniel Platt
// Chapter 1: Magnitude Example

function setup() {
  createCanvas(600, 350);
}

function draw() {
  frameRate(30);
  background(210);
  circle(width/2, height/2, 5);
  let mouse = createVector(mouseX, mouseY);
  let center = createVector(width/2, height/2);
  let lineVec = p5.Vector.sub(mouse, center);
  fill(0,0,lineVec.mag());
  circle(mouseX, mouseY,2 * lineVec.mag());
  noFill();
  line(mouse.x, mouse.y, center.x, center.y);
}
