// The Nature of Code
// Danny Platt
// use perlin noise to draw the 2 dimentional clouds

let xoff = 0;
let yoff = 0;
let toff = 0;

function setup() {
  createCanvas(600, 400);
  background(200, 10);
}

function draw() {
  loadPixels();
  yoff = 0;
  for (var y = 0; y < width; y++){
    xoff = toff;
    for (var x = 0; x < width; x++){
      noiseDetail(2);
      let brightness = map(noise(xoff, yoff, toff), 0, 1, 0, 255);
      let index = (x + y * width) * 4;
      pixels[index + 0] = map(noise(yoff, yoff, toff), 0, 1, 0, 255);
      pixels[index + 1] = brightness;
      pixels[index + 2] = brightness;
      pixels[index + 3] = 255;
      xoff += 0.005;
    }
    yoff += 0.005;
  }
  updatePixels();
  toff += 0.01;
}

