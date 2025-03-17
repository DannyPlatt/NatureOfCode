/************************************
 * BUFFER SETUP
 ************************************/

function initBuffers(gl, object, positionArray, indicesArray, normalArray) {
  // Convert arrays to typed arrays
  const positions = new Float32Array(positionArray);
  const indices = new Uint16Array(indicesArray);
  const normals = new Float32Array(normalArray);

  // Create and bind the Vertex Array Object
  var vertexArrayObject = gl.createVertexArray();
  gl.bindVertexArray(vertexArrayObject);

  // Initialize position attribute
  const positionBuffer = initPositionAttribute(gl, object.programInfo, positions);

  // Initialize normal attribute
  const normalBuffer = initNormalAttribute(gl, object.programInfo, normals);

  // Initialize index buffer
  const indexBuffer = initIndexBuffer(gl, indices);

  object.buffers = {
    vao: vertexArrayObject,
    attributes: {
      position: positionBuffer,
      normal: normalBuffer,
    },
    indices: indexBuffer,
    numVertices: indices.length,
  };
}

function initPositionAttribute(gl, programInfo, positionArray) {
  // Create a buffer for the positions.
  const positionBuffer = gl.createBuffer();

  // Select the buffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(
    gl.ARRAY_BUFFER, // The kind of buffer this is
    positionArray, // The data in an Array object
    gl.STATIC_DRAW // We are not going to change this data, so it is static
  );

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 3; // pull out 3 values per iteration, ie vec3
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize between 0 and 1
    const stride = 0; // how many bytes to get from one set of values to the next
    // Set stride to 0 to use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from

    // Set the information WebGL needs to read the buffer properly
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    // Tell WebGL to use this attribute
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition);
  }

  return positionBuffer;
}


function initColourAttribute(gl, programInfo, colourArray) {

  // Create a buffer for the positions.
  const colourBuffer = gl.createBuffer();

  // Select the buffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(
    gl.ARRAY_BUFFER, // The kind of buffer this is
    colourArray, // The data in an Array object
    gl.STATIC_DRAW // We are not going to change this data, so it is static
  );

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 4; // pull out 4 values per iteration, ie vec4
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize between 0 and 1
    const stride = 0; // how many bytes to get from one set of values to the next
    // Set stride to 0 to use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from

    // Set the information WebGL needs to read the buffer properly
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColour,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    // Tell WebGL to use this attribute
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexColour);
  }

  return colourBuffer;
}

function initIndexBuffer(gl, elementArray) {

  // Create a buffer for the positions.
  const indexBuffer = gl.createBuffer();

  // Select the buffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER, // The kind of buffer this is
    elementArray, // The data in an Array object
    gl.STATIC_DRAW // We are not going to change this data, so it is static
  );

  return indexBuffer;
}

// DEPRECIATED UPDATE FOR NEW METHOD
function initNormalBuffer(gl) {
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(cube.normals),
    gl.STATIC_DRAW,
  );
  return normalBuffer;
}

function initNormalAttribute(gl, programInfo, normalArray) {
  // Create a buffer for the normals
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STATIC_DRAW);

  // Set up how to pull the data out of the buffer
  const numComponents = 3; // x, y, z
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );

  // Enable the attribute
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

  return normalBuffer;
}
