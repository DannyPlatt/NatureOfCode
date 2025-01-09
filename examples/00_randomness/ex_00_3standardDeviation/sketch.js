// The Nature of Code
// Danny Platt
// A simple graph of using standard deviation to place dots

let spreadSlider;
let sizeSlider;
let huespSlider;

function setup() {
  frameRate(30);
  createCanvas(600, 400);
  background(0);
  createControls(450);
}

function draw() {
  translate(width / 2, height / 2);
  scale(height / 2);
  const x = randomGaussian(0, spreadSlider.value());
  const y = randomGaussian(0, spreadSlider.value());
  noStroke(); // remove outline
  fill(
    randomGaussian(125, 20),
    randomGaussian(255/2, 20),
    randomGaussian(255/2, 20),
    );
  circle(x, y, randomGaussian(.1, sizeSlider.value()));
}

function createControls(ypos) {
  xpos = 0;
  spreadTitle = createP("Spread");
  spreadTitle.position(xpos, ypos);
  xpos += 50;

  spreadSlider = createSlider(0,0.3,0.25,0);
  spreadSlider.position(xpos, ypos);
  spreadSlider.size(80);
  xpos += 100;

  sizeTitle = createP("size SD");
  sizeTitle.position(xpos, ypos);
  xpos += 50;

  sizeSlider = createSlider(0,.1,0.05,0);
  sizeSlider.position(xpos, ypos);
  sizeSlider.size(80);
  xpos += 100;

  clearButton = createButton("Clear");
  clearButton.position(xpos, ypos);
  clearButton.mousePressed(clearCanvas);
}

function clearCanvas() {
  background(0);
}

