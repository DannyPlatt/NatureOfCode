// The Nature of Code
// Daniel Platt
// Chapter: 

let ball;

function setup() {
  frameRate(40);
  ball = new Mover(width/2, height/2, 20)
  createCanvas(600, 350);
}

function draw() {
  background(210);
  let mouse = createVector(mouseX, mouseY);
  ball.acceleration.x = map(mouse.x - ball.position.x, -width/2, width/2, -2, 2);
  ball.acceleration.y = map(mouse.y - ball.position.y, -height/2, height/2, -2, 2);
  ball.update();
  ball.show();
}
