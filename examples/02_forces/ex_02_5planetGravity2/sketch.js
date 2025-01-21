// The Nature of Code
// Daniel Platt
// file: applyForces/sketch.js

let isPlaying = false;
let particles = [];
let planets = [];
let particleCount = 10;
let planetCount =  1;
let mPpx = 2e5;
let gravConst = 6.67430e-11;

function setup() {
  frameRate(70);
  createCanvas(600, 350);
  initParticles(particleCount);
  initPlanets(planetCount);
  initPlayButton();
}

function draw() {
  if (!isPlaying){
    return;
  }
  background(0, 1);
  stroke('white');
  strokeWeight(0);
  text ("fps: " + round(frameRate()), 10,20);
  fill(0);
  // Loop through each particle element
  particles.forEach(element => {
    calcGravForce(element);
    element.update();
    element.show();
  });
  // loop through each planet
  planets.forEach(planet => {
    planet.update();
    planet.show();
  });
  // See if a moon should be removed (either off canvas or collided with planet)
  // checkRemove();
}

function checkRemove() {
  // check if colission with planet or if out of bounds. if so, simply remove object
  for (let j = 0; j < planets.length; j++) {
    for (let i = particles.length-1; i >= 0; i--) {
      // if (particles[i].isOffScreen() || particles[i].planetCollision(planets[j])) {
      if (particles[i].planetCollision(planets[j])) {
        particles.splice(i,1);// Remove from the array
      }
    }
  }
}

function initParticles(count) {
  // Create particels at a random point around the canvas with a random starting vector
  for (let i = 0; i < count; i++) {
    particles[i] = new Mover(
      // random(width/2, width),
      random(0 , width),
      height/2, 
      7.347e22, 
      1737e3/mPpx,
      createVector(0, random(-4,4)),
    ); 
  }
}
function initPlanets(count) {
  // Multi planet:
  // planets[0] = new Mover(width/5, height*2/5, 5.927e24, 6e6/mPpx, createVector());
  // planets[1] = new Mover(width*4/5, height*3/5, 5.927e24, 5e6/mPpx, createVector());
  
  // Single Planet:
  planets[0] = new Mover(width/2, height/2, 5.927e24, 5.378e6/mPpx, createVector());
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

function calcGravForce(element){
  // Calculate the force of gravity based on the equation F = G*m_1*m_2/r^2
  let force = createVector();
  for (let i = 0; i < planets.length; i++) {
    // claculate distance and direction
    let distance = p5.Vector.sub(planets[i].position, element.position).mult(5e5); //500km / px
    let forceMag = gravConst*planets[i].mass*element.mass / distance.mag()**2; // Force magnitude
    force = distance.setMag(forceMag);
    element.applyForce(force);
    force.mult(0); // reset the vector for next planet
  }
}
function drawStars() {
  fill(255);
  for (let i = 0; i < 40; i++) {
    circle(random(0,width), random(0,height), 1);
    
  }
}
