// The Nature of Code
// Daniel Platt
// Chapter: 

let points;
let cols;
let rows;
let qtree;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  // create quadTree
  let boundary = new Rectangle(width/2, height/2, width/2, height/2);
  qtree = new QuadTree(boundary, 4);
  points = new Array();
}

function draw() {
  background(30);
  // show quad tree and handle mouse clicks
  qtree.show();
  if (mouseIsPressed) {
    let newPoint = new Point(mouseX, mouseY);
    qtree.insert(newPoint);
  }

  // draw green square
  stroke (0, 255, 0);
  rectMode(CENTER);
  let range = new Rectangle(250, 250, 107, 75);
  rect(range.x, range.y, range.w * 2, range.h * 2);
  // draw points
  let points = qtree.query(range);
  for (let point of points) {
    strokeWeight(4)
    point.show();
  }
}

