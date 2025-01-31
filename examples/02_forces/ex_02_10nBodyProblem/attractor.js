// The nature of Code
// Daniel Platt
// Mover Class:
//    Draws a ball that moves around the space and is bounded by the boundaries
class Attractor {
  constructor(x,y, mass, radius) {
    this.position = createVector(x, y);
    this.radius = radius;
    this.mass = mass;
    this.color = [200, map(radius, 0, 20, 0, 255), 200];
    this.dragOffset = createVector(0,0);
    this.dragging = false;
    this.rollover = false;
  }

  attract(mover) {
    // calculate direction of force
    let force = p5.Vector.sub(this.position, mover.position);
    let distance = force.mag();
    // limit the distance to eliminate extreme results
    distance = constrain(distance, 4, 10);
    // calc grav force
    let strength = (gravConst * this.mass * mover.mass) / (distance * distance);
    force.setMag(strength);
    return force;
  }

  show() {
    stroke(50);
    strokeWeight(2);
    if (this.dragging){
      fill(this.color[0] - 50, this.color[1] - 50, this.color[2] - 50);
    }else if (this.rollover) {
      fill(this.color[0] - 100, this.color[1] - 100, this.color[2] - 100);
    } else {
      fill(this.color[0], this.color[1], this.color[2] );
    }
    circle(this.position.x, this.position.y, this.radius);
  }

  // handles mouse interactions
  handlePress(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.radius) {
      this.dragging = true;
      this.dragOffset.x = this.position.x - mx;
      this.dragOffset.y = this.position.y - my;
    }
  }

  handleHover(mx, my) {
    let d = dist(mx, my, this.position.x, this.position.y);
    if (d < this.radius) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }
  stopDragging() {
    this.dragging = false;
  }
  handleDrag(mx, my) {
    // update to dragged position
    if (this.dragging) {
      this.position.x = mx + this.dragOffset.x;
      this.position.y = my + this.dragOffset.y;
    }
  }
}
