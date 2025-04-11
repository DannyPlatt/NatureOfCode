function randomFl(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function constrain(num, min, max) {
  if (num < min){
    return min;
  } else if (num > max) {
    return max;
  } else {
    return num;
  }
}

function getRotationMatrixFromVelocity(object, out, up = [0, 1, 0]) {
  const velocity = vec3.clone(object.velocity);

  // Prevent zero velocity from causing NaN
  if (vec3.length(velocity) < 1e-5) {
    return mat4.identity(out);
  }

  const bz = vec3.create();
  vec3.normalize(bz, velocity);

  let by = vec3.create();
  if (Math.abs(bz[2]) < Math.abs(bz[0]) && Math.abs(bz[2]) < Math.abs(bz[1])) {
    vec3.set(by, bz[1], -bz[0], 0);
  } else {
    vec3.set(by, bz[2], 0, -bz[0]);
  }
  vec3.normalize(by, by);

  const bx = vec3.create();
  vec3.cross(bx, by, bz);

  // Transpose to match OpenGL column-major format
  mat4.set(out,
    bx[0], by[0], bz[0], 0,
    bx[1], by[1], bz[1], 0,
    bx[2], by[2], bz[2], 0,
    0,     0,     0,     1
  );

  mat4.transpose(out, out); // optional depending on your layout
  
  return out;
}


/**
 * Used to add new objects to the scene
 * @param  {object} gl: the global web gl object
 * @param  {state} state: All information about the game 
 */
function spawnNewObject(
    gl, 
    objectList, 
    position=vec3.create(), 
    velocity=vec3.create(), 
    color=[1,1,1,1], 
    scale=[1,1,1], 
    mass=1, 
    type, 
    isObsticle = false,
  ){
  // create new object
  var newShape = new Object(
    gl,
    position = position,
    velocity = velocity,
    color = color,
    scale = scale,
    mass = mass,
    type = type,
    isObsticle = isObsticle,
  )
  // Add newShape to triangles
  objectList.push(newShape);
  // initBuffer(gl, object, positionArray, indicesArray) 
  initBuffers( // FROM initBuffers.js
    gl, 
    objectList.at(-1), 
    type.vertices.flat(),
    type.triangles.flat(),
    type.normals.flat()
  );
  return newShape;
}
/**
 * Used to add new boid to the scene
 */
function spawnNewBoid(
    gl, 
    objectList, 
    position=vec3.create(), 
    velocity=vec3.create(), 
    color=[1,1,1], 
    scale=[1,1,1], 
    mass=1, 
    type, 
  ){
  // create new object
  var newShape = new Boid(
    gl,
    position = position,
    velocity = velocity,
    color = color,
    scale = scale,
    mass = mass,
    type = type,
  )
  // Add newShape to triangles
  objectList.push(newShape);
  // initBuffers( // FROM initBuffers.js
  //   gl, 
  //   objectList.at(-1), 
  //   type.vertices.flat(),
  //   type.triangles.flat(),
  //   type.normals.flat()
  // );
  return newShape;
}    
function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth  = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize = canvas.width  !== displayWidth ||
    canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

/**
 * A custom error function. The tag with id `webglError` must be present
 * @param  {string} tag Main description
 * @param  {string} errorStr Detailed description
 */
function printError(tag, errorStr) {
    // Create a HTML tag to display to the user
    var errorTag = document.createElement('div');
    errorTag.classList = 'alert alert-danger';
    errorTag.innerHTML = '<strong>' + tag + '</strong><p>' + errorStr + '</p>';

    // Insert the tag into the HMTL document
    document.getElementById('webglError').appendChild(errorTag);

    // Print to the console as well
    console.error(tag + ": " + errorStr);
}

