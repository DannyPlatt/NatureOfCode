/**
 * Used to add new objects to the scene
 * @param  {object} inputTriangles: list containing all object information
 * @param  {object} gl: the global web gl object
 * @param  {state} state: All information about the game 
 */
function spawnNewObject(inputTriangles,gl,state){
  mapSize = state.canvasWidth;
  scaleLimitX = 3;
  scaleLimitY = 2;
  // Create new cube object
  var run = true;
  run = false;
  var newCube = {
    type: cube,
    position: [
      (Math.random() * mapSize - mapSize/2),
      10,
      (Math.random() * mapSize - mapSize/2),
    ],
    scale: [
      Math.random() * scaleLimitX,
      (Math.random() + 1) * scaleLimitY, // ensure no flat boxes
      Math.random() * scaleLimitX
    ],
  }

  // Add cube to triangles
  inputTriangles.push(newCube.type);
  state.objects.push(
    {
      name: inputTriangles.at(-1).name,
      model: new Mover(
        newCube.position, 
        newCube.scale,
      ),
      // this will hold the shader info for each object
      programInfo: transformShader(gl), // FROM shadersAndUniforms.js
      buffers: undefined,
      centroid: calculateCentroid(inputTriangles.at(-1).vertices), // FROM drawScene
      color: new Float32Array([
        inputTriangles.at(-1).material.diffuse[0],
        inputTriangles.at(-1).material.diffuse[1],
        inputTriangles.at(-1).material.diffuse[2],
        1.0,
      ]),
      material: {
        ambientColor: [0.1, 0.1, 0.1],
        diffuseColor: cube.material.diffuse,
        specularColor: [1.0, 1.0, 1.0],
        shininess: 50.0,
      },
    }
  );

  // initBuffer(gl, object, positionArray, indicesArray) 
  initBuffers( // FROM initBuffers.js
    gl, 
    state.objects.at(-1), 
    inputTriangles.at(-1).vertices.flat(),
    inputTriangles.at(-1).triangles.flat(),
    inputTriangles.at(-1).normals.flat()
  );
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

