function randomFl(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

/**
 * Used to add new objects to the scene
 * @param  {object} gl: the global web gl object
 * @param  {state} state: All information about the game 
 */
function spawnNewObject(gl,state, type, position, scale = [1,1,1], color = [1,1,1,1]){
  // create new object
  type.material.diffuse = [color[0],color[1], color[2]];
  var newShape = {
    name: type.name,
    model: new Mover(
      position, 
      scale,
    ),
    // this will hold the shader info for each object
    programInfo: transformShader(gl), // FROM shadersAndUniforms.js
    buffers: undefined,
    centroid: calculateCentroid(type.vertices), // FROM drawScene
    color: new Float32Array([
      type.material.diffuse[0],
      type.material.diffuse[1],
      type.material.diffuse[2],
      color[3],
    ]),
    material: {
      ambientColor: [0.6, 0.6, 0.6],
      diffuseColor: type.material.diffuse,
      specularColor: [1.0, 1.0, 1.0],
      shininess: 32.0,
    },
  }

  // Add newShape to triangles
  state.objects.push(newShape);

  // initBuffer(gl, object, positionArray, indicesArray) 
  initBuffers( // FROM initBuffers.js
    gl, 
    state.objects.at(-1), 
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

