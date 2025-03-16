var scene = [
  { // This is the character currently
    // do not change the first object
    // TODO:
    // Currently object floats above the ground. If we bring it to the ground, the
    // y value is then registered as negative, and collision with the objects isn't 
    // registered,
    // Fix: draw object around the 0 axis instead of above the 0 axis
    type: player,
    position: [-15,0.2/2,0],
    // position: 0,5,0],
    scale: [0.8,0.8,0.8]
  },
  { // Keep table as second
    type: table,
    position: [0,0,0],
    scale: [40,0.01,40]
  },
  {
    type: coin,
    position: [-2,4,-1],
    scale: [.1,.8,.8]
  },
  // Bounding walls
  { // -X bound
    type: wall,
    position: [-20,1.5,0],
    scale: [1,1,40]
  },
  { // +X bound
    type: wall,
    position: [20,1.5,0],
    scale: [1,1,40]
  },
  { // -Z bound
    type: wall,
    position: [0,1.5,-20],
    scale: [40,1,1]
  },
  { // +Z bound
    type: wall,
    position: [0,1.5,20],
    scale: [40,1,1]
  },
  // starting cubes
  {
    type: cube,
    position: [-6,1.5,8],
    scale: [2,1,1]
  },
  {
    type: cube,
    position: [10,8/2,-8],
    scale: [3,6,3]
  },
  // origin shapes ====================
  {
    type: origin,
    position: [0,1,0],
    scale: [.05,2,.05]
  },
  {
    type: origin,
    position: [0,0,1],
    scale: [.05,.05,2]
  },
  {
    type: origin,
    position: [2,0,0],
    scale: [4,.05,.05]
  },
  // origin shapes ====================
]
