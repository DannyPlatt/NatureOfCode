// The Nature of Code
// Daniel Platt
// Chapter: 0
// random graph
let randomCounts = [];
let total = 20;

function setup() {
  frameRate(30);
  createCanvas(600, 350);
  for (let i = 0; i < total; i++) {
    randomCounts[i] = 0;
  }
}

function draw() {
  background(210);
  text ("fps: " + round(frameRate()), 10,20);
  // grab a random element within the array and add 1 to the count
  let index = floor(random(randomCounts.length)); 
  randomCounts[index]++; 
  // draw graph
  stroke(0);
  fill(127);
  let w = width / randomCounts.length;
  for (let x = 0; x < randomCounts.length; x++) {
    // width: 
    //    for the 3rd element, start at the 3rd section of the graph, 3 * w
    //    continue until w - 1 to give space
    // height:
    //    bottom left: height - count
    //    top right: 
    rect(x * w, height - randomCounts[x], w - 1, randomCounts[x]);
  }
}
