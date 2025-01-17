// The Nature of Code
// Danny Platt
// An attempt at creating a quadratic distribution

let countArray = [];
let length = 20;

function setup() {
  frameRate(30);
  createCanvas(600, 400);
  for (let i = 0; i < length; i++) {
    countArray[i] = 0;
  }
}

function draw() {
  background(0);
  let flag = true;
  let x = 0;
  let y = 0;
  while(flag){
    x = floor(random(0,length));
    probability = x**2;
    const r2 = floor(random(0,length));
    if (r2 <= probability)
      flag = false;
  }
  countArray[x] += 2;

  // draw the graph
  noFill();
  stroke(255);
  beginShape();
  const step = width / length
  for (let i = 0; i < length; i++) {
    vertex(i*step,height - countArray[i]);
  }
  endShape()

}

