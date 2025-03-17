function randomFl(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function initBalls(inputTriangles,gl,state, count) {
  let ballCount = count;
  let type = sphere;
  let w = state.canvasWidth/4;
  let scaleSize = 1
  for (let i = 0; i < ballCount; i++) {
    let position = [randomInt(-w, w), randomInt(1, w), randomInt(-w, w)];
    let scale = [scaleSize, scaleSize, scaleSize];
    let ball = spawnNewObject(inputTriangles, gl, state, type, position, scale)
    ball.model.velocity = vec3.fromValues(randomFl(-0.2, 0.2), randomFl(-0.2, 0.2), randomFl(-0.5, 0.5))
    ball.material.diffuseColor = [Math.random(),Math.random(),Math.random()];
  }

}

/**
 * Used to add new objects to the scene
 * @param  {object} inputTriangles: list containing all object information
 * @param  {object} gl: the global web gl object
 * @param  {state} state: All information about the game 
 */
function spawnNewObject(inputTriangles,gl,state, type, position, scale){
  // create new object
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
      1.0,
    ]),
    material: {
      ambientColor: [0.6, 0.6, 0.6],
      diffuseColor: type.material.diffuse,
      specularColor: [1.0, 1.0, 1.0],
      shininess: 32.0,
    },
  }

  // Add newShape to triangles
  inputTriangles.push(type);
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

