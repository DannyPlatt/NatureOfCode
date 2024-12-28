// The Nature of Code
// Danny Platt
// Follow walker. This walker moves towards the mouse with a 60% likelyhood

let walker;
let x= 0;

function setup() {
  createCanvas(600, 400);
  walker = new Walker();
  background(210);
}

function draw() {
  walker.step();
  walker.show();
}

class Walker {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
  }

  show() {
    stroke(1);
    strokeWeight(2);
    point(this.x, this.y);
  }

  step() {
    const choiceX = random();
    const choiceY = random();
    if(choiceX >= 0.45){
      if((this.x - mouseX) < 0){
        this.x += 1;
      }
      else {
        this.x -= 1;
      }
    }
    else{
      if((this.x - mouseX) < 0){
        this.x -= 1;
      }
      else {
        this.x += 1;
      }
    }
    if(choiceY <= 0.55){
      if((this.y - mouseY) < 0){
        this.y += 1;
      }
      else {
        this.y -= 1;
      }
    }
    else{
      if((this.y - mouseY) < 0){
        this.y -= 1;
      }
      else {
        this.y += 1;
      }
    }
  }
}
