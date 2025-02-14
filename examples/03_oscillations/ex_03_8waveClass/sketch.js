// The Nature of Code
// Daniel Platt
// Chapter: 

let isPlaying = false;
let deltaTime = 0;
let lastTime = 0;

let wave1;
let wave2;
let wave3;

function setup() {
  frameRate(30);
  lastTime = millis()
  createCanvas(600, 350);
  background(210);
  initPlayButton();
  wave1 = new Wave(
    width/5, // x origin
    55, // y origin
    width * 3/5, // width
    20, // amplitude
    180//period
  );
  wave2 = new Wave(
    width/5, // x origin
    150, // y origin
    width * 3/5, // width
    20, // amplitude
    -180//period
  );
  wave3 = new Wave(
    width/5, // x origin
    270, // y origin
    width * 3/5, // width
    20, // amplitude
    90//period
  );
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(210);
  // Handle deltaTime
  let now = millis();
  deltaTime = (now - lastTime) / 1000;
  lastTime = now;
  wave1.update();
  wave1.show();

  wave2.update();
  wave2.show();

  //update wave 3 yPosition
  for (let i = 0; i< wave3.yValues.length; i++) {
    wave3.yValues[i] = wave1.yValues[i] + wave2.yValues[i];
  }
  wave3.show();
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
