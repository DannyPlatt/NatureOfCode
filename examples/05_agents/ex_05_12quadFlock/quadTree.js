// The nature of Code
// Daniel Platt
// quadTest Classes:

class Point {
  constructor(x, y, data) {
    this.x = x;
    this.y = y;
    this.data = data;
  }
  show() {
    // strokeWeight(3);
    // point(this.x, this.y);
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
  }

  contains(point) {
    return(
      point.x > this.x - this.w &&
      point.x < this.x + this.w &&
      point.y > this.y - this.h &&
      point.y < this.y + this.h
    );
  }

  intersects(range) {
    return !( // if they intersect
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class QuadTree {
  constructor(boundary, n){
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.divided = false;
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let h = this.boundary.h;
    let w = this.boundary.w;

    let ne = new Rectangle(x + w/2, y-h/2, w/2, h/2);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w/2, y-h/2, w/2, h/2);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w/2, y+h/2, w/2, h/2);
    this.southeast = new QuadTree(se, this.capacity)
    let sw = new Rectangle(x - w/2, y+h/2, w/2, h/2);
    this.southwest= new QuadTree(sw, this.capacity);
    this.divide = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
    } else {
      if(!this.divided) {
        this.subdivide();
        this.divided = true;
      }
      this.northeast.insert(point);
      this.northwest.insert(point);
      this.southeast.insert(point);
      this.southwest.insert(point);
    }
  }

  query(range) {
    let found = [];  // found points
    if (!this.boundary.intersects(range)) {
      // empty array
      return found;
    } else {
      for (let p of this.points) {
        if (range.contains(p)) {
          found.push(p);
        }
      }
      if (this.divided) {
        found = found.concat(this.northwest.query(range));
        found = found.concat(this.northeast.query(range));
        found = found.concat(this.southwest.query(range));
        found = found.concat(this.southeast.query(range));
      }
      return found;
    }
  }

  show() {
    stroke(255);
    strokeWeight(2);
    noFill();
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w * 2, this.boundary.h*2);
    if(this.divide) {
      this.northeast.show()
      this.northwest.show()
      this.southeast.show()
      this.southwest.show()
    }
    for (let p of this.points) {
      p.show();
    }
  }
}
