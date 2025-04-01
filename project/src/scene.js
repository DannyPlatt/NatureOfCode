var scene = [
  {
    type: sphere,
    position: [0,0,0],
    scale: [5,5,5],
    color: [1,1,1,1]
  },
  {
    type: origin,
    position: [0,0,0],
    scale: [0.5,100,0.5],
    color: [0,0,1,1]
  },
  {
    type: origin,
    position: [0,0,0],
    scale: [0.5,0.5,100],
    color: [1,0,0,1]
  },
  {
    type: origin,
    position: [0,0,0],
    scale: [100,0.5,0.5],
    color: [0,1,0,1]
  },
  { // Floor
    type: cube,
    position: [0,0,-75],
    scale: [1000,1000,5],
    color: [0.3,0.6,0.3,1]
  },
  { // Obsticle1
    type: cube,
    position: [10,10,-65],
    scale: [20,20,20],
    color: [0.7,0.6,0.3,1]
  }

  // origin shapes ====================
]
