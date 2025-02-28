class Confetti extends Particle {
  constructor (x, y) {
    super(x,y);
  }
  show() {
    let opacity = map(this.elapsedTime, 0, this.lifeTime, 255, 0);
    console.log("show Confetti");
    let angle = map(this.position.x, 0, width, 0, TWO_PI * 2);
    rectMode(CENTER);
    fill(255, 100, 100, opacity);
    stroke(0, opacity);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    square(0, 0, 20);
    pop();
  }
}
