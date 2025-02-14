// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Mover {
  constructor(x,y, mass, velocity) {
    this.position = createVector(x, y);
    this.velocity = velocity;
    this.acceleration = createVector(0,0);
    this.radius = mass * 4;
    this.mass = mass;
    this.color = [200, map(this.mass, 0, 10, 0, 255), 250];
  }
  applyForce(force) {
    this.acceleration.add(p5.Vector.div(force,this.mass));
  }
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    // clear acceleration vector after applied
    this.acceleration.mult(0);

  }
  show() {
    fill(this.color[0], this.color[1], this.color[2], 200 );
    stroke(50);
    strokeWeight(1);
    // circle(this.position.x, this.position.y, this.radius * 2);
    circle(this.position.x, this.position.y, this.radius);
  }
  attract(mover) {
    // calculate direction of force
    let force = p5.Vector.sub(this.position, mover.position);
    let distance = force.mag();
    // limit the distance to eliminate extreme results
    distance = constrain(distance, 5, 50);
    // calc grav force
    let strength = (gravConst * this.mass * mover.mass) / (distance * distance);
    force.setMag(strength);
    return force;
  }
}
