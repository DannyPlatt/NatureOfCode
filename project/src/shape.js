class Model {
  constructor(name, material) {
    let filename = name.split("/")[name.split("/").length - 1];
    this.name = filename.split(".")[0].toLowerCase();
    this.material = material;
    this.vertices = [];
    this.triangles = [];
    this.normals = [];
    this.promise = fetch("../" + name)
      .then((res) => res.text())
      .then((text) => {
        this.parseFile(text);
        this.normalize();
        this.loaded = true;
        // Rotate around the y axis if player object.
        if (this.name == "car2") {
          for (let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = this.rotateVertexY(this.vertices[i], -1.5708);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to find the file: ", err);
      });

  }

  parseFile(input) {
    // Iterate over lines, strip whitespace, and check for empty or comments.
    // Otherwise, build model.
    let lines = input.split("\n");
    for (let num = 0; num < lines.length; num++) {
      let line = lines[num].trim();
      if (line === "" || line[0] === "#")
        continue;

      let pattern = /(\w*)(?: )(.*)/;
      let data = pattern.exec(line);

      let cmd = data[1];
      let args = data[2];
      this.parseCommand(cmd, args);
    }
  }

  // Parses a command into an array based on the cmd name
  parseCommand(cmd, args) {
    // Simple function to convert array to float
    const toFloatArray = (arr) => {
      let ret = [];
      for (let i = 0; i < arr.length; i++) {
        ret.push(parseFloat(arr[i]));
      }
      return ret;
    }

    let argArr = args.split(" ");

    if (cmd === "v") {
      this.vertices.push(toFloatArray(argArr));
    }

    if (cmd === "vn") {
      this.normals.push(toFloatArray(argArr));
    }

    if (cmd === "f") {
      // Do this because we only want the first number in 1//1 or 1/1/1, etc.
      let newArr = [];
      for (let i = 0; i < argArr.length; i++) {
        let elem = argArr[i].split("/")[0];
        // Note -1 is because obj files index from 1, not 0.
        newArr.push(parseFloat(elem) - 1);
      }

      // Now handle triangulation. This has been awful to figure out. A lot
      // of models online have faces with more than 3 vertices. This is
      // not acceptable with current model.

      if (newArr.length === 3)
        this.triangles.push(newArr);
      else {
        for (let i = 1; i < newArr.length - 1; i++) {
          this.triangles.push([newArr[0], newArr[i], newArr[i + 1]]);
        }
      }
    }
  }

  normalize() {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    // Calculate bounding box
    for (let vertex of this.vertices) {
      let [x, y, z] = vertex;
      if (x <= minX) minX = x;
      if (y <= minY) minY = y;
      if (z <= minZ) minZ = z;
      if (x >= maxX) maxX = x;
      if (y >= maxY) maxY = y;
      if (z >= maxZ) maxZ = z;
    }

    // Caclulate origin of model
    let centerX = (minX + maxX) / 2;
    let centerY = (minY + maxY) / 2;
    let centerZ = (minZ + maxZ) / 2;

    // Translate model to center at origin
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i][0] -= centerX;
      this.vertices[i][1] -= centerY;
      this.vertices[i][2] -= centerZ;
    }

    let width = maxX - minX;
    let height = maxY - minY;
    let depth = maxZ - minZ;
    let largestDimension = Math.max(width, height, depth);
    let scaleFactor = 1 / largestDimension;

    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i][0] *= scaleFactor;
      this.vertices[i][1] *= scaleFactor;
      this.vertices[i][2] *= scaleFactor;
    }
  }

  rotateVertexY(vertex, angle) {
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    const x = vertex[0];
    const z = vertex[2];

    return [
      cos * x + sin * z,
      vertex[1],
      -sin * x + cos * z,
    ];
  }
}

var cube = {
  "raw": new Model("assets/cube.obj"),
  "name":"cube",
  "material": {"diffuse": [1, 1, 0.6]},
  get vertices() {
    return this.raw.vertices;
  },

  get triangles() {
    return this.raw.triangles;
  },

  get normals() {
    return this.raw.normals;
  },

  "color": [
    [0,0,1,1],
    [1,0,0,1],
    [1,0,1,1],
    [1,1,0,1],
    [0,1,0,1],
    [.5,1,1,1],
  ],
};

let player = {
  "raw": new Model("assets/car2.obj", null),
  "name":"player",
  "material": {"diffuse": [1, 0.3, 0.3]},
  get vertices() {
    return this.raw.vertices;
  },

  get triangles() {
    return this.raw.triangles;
  },

  get normals() {
    return this.raw.normals;
  },

  "color": [
    [0,0,1,1],
    [1,0,0,1],
    [1,0,1,1],
    [1,1,0,1],
    [0,1,0,1],
    [.5,1,1,1],
  ],
};

var wall = {
  "raw": new Model("assets/wall.obj", null),
  "name":"wall",
  "material": {"diffuse": [0.5, 0.5, 0.4]},

  get vertices() {
    return this.raw.vertices;
  },

  get triangles() {
    return this.raw.triangles;
  },

  get normals() {
    return this.raw.triangles;
  },

  "color": [
    [0,0,1,1],
    [1,0,0,1],
    [1,0,1,1],
    [1,1,0,1],
    [0,1,0,1],
    [.5,1,1,1],
  ],
};

let table = {
  "raw": new Model("assets/table.obj", null),
  "name":"table",
  "material": {"diffuse": [0.4, 0.4, 0.4]},

  get vertices() {
    return this.raw.vertices;
  },

  get normals() {
    return this.raw.normals;
  },

  get triangles() {
    return this.raw.triangles;
  },

  "color": [
    [0,0,1,1],
    [1,0,0,1],
    [1,0,1,1],
    [1,1,0,1],
    [0,1,0,1],
    [.5,1,1,1],
  ],
};

let sphere = {
  "raw": new Model("assets/sphere-with-norms.obj", null),
  "name":"sphere",
  "material": {"diffuse": [0.83, 0.68, 0.21]},

  get vertices() {
    return this.raw.vertices;
  },

  get normals() {
    return this.raw.normals;
  },

  get triangles() {
    return this.raw.triangles;
  },

  "color": [
    [0,0,1,1],
    [1,0,0,1],
    [1,0,1,1],
    [1,1,0,1],
    [0,1,0,1],
    [.5,1,1,1],
  ]
};

let origin = {
  "raw": new Model("assets/origin.obj", null),
  "name": "origin",
  "material": {"diffuse": [1, .2, 1]},

  get vertices() {
    return this.raw.vertices;
  },

  get normals() {
    return this.raw.normals;
  },

  get triangles() {
    return this.raw.triangles;
  },

  "color": [
    [0,0,1,1],
    [1,0,0,1],
    [1,0,1,1],
    [1,1,0,1],
    [0,1,0,1],
    [.5,1,1,1],
  ],
}

