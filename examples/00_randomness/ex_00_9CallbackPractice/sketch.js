// The Nature of Code
// Daniel Platt
// Chapter: 

function setup() {
  createCanvas(500, 400);
  background(210);
  // create an array with values from 0 to 10
  let arr = [0,1,2,3,4,5,6];
  const doubled = processArray(arr, (num) => num * 2);
  console.log("doubled: ", doubled);

  const filtered = doubled.filter((num) => num >= 10);

}

function draw() {
  circle(250, 200, 3);
}

function processArray(array, callback) {
  array.map(callback);
}
