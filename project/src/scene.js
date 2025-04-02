var scene = [
  // {
  //   type: sphere,
  //   position: [0,0,0],
  //   scale: [5,5,5],
  //   color: [1,1,1,1],
  //   obsticle: true
  // },
  // {
  //   type: origin,
  //   position: [0,0,0],
  //   scale: [0.5,100,0.5],
  //   color: [0,0,1,1],
  //   obsticle: false,
  // },
  // {
  //   type: origin,
  //   position: [0,0,0],
  //   scale: [0.5,0.5,100],
  //   color: [1,0,0,1],
  //   obsticle: false,
  // },
  // {
  //   type: origin,
  //   position: [0,0,0],
  //   scale: [100,0.5,0.5],
  //   color: [0,1,0,1],
  //   obsticle: false,
  // },
  { // Floor
    type: cube,
    position: [0,0,-575],
    scale: [1000,1000,1000],
    color: [0.3,0.1,0.3,1],
    obsticle: false,
  },
  { // Obsticle1
    type: sphere,
    position: [-0,-2,-0],
    scale: [30,30,30],
    color: [0.5,1,1,1],
    obsticle: true,
  },
  { // Obsticle1
    type: sphere,
    position: [40,0,60],
    scale: [20,20,20],
    color: [0.7,0.6,0.3,1],
    obsticle: true,
  },

  // origin shapes ====================
]
