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
    color=[1,1,1,1], 
    scale=[1,1,1], 
    mass=1, 
    type, 
    radius = 1
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
    radius = radius
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

