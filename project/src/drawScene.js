/**
 * Draws the scene. Should be called every frame
 * 
 * @param  {webGL2 object} gl: WebGL2 context
 * @param {object} state: information about scene
 */
function drawScene(state, gl) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set background
  // setup rasterization settings
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.CULL_FACE); // only draw font triangles
  // Clear the color and depth buffer with specified clear colour.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
  
  // setup projection matrix
  var projectionMatrix = mat4.create();
  var fovy = 65.0 * Math.PI / 180.0; // Vertical field of view in radians
  var aspect = state.canvas.clientWidth / state.canvas.clientHeight; // Aspect ratio of the canvas
  var near = 0.1; // Near clipping plane
  var far = 500.0; // Far clipping plane
  // Generate the projection matrix using perspective
  mat4.perspective(projectionMatrix, fovy, aspect, near, far);
  // Setup camera view matrix
  var focalPoint = vec3.add(vec3.create(), state.camera.position, state.camera.at);
  // update view matrix with state.camera
  // link to corresponding uniform object.programInfo.uniformLocations.[...]
  // Use lookat to create viewMatrix
  var viewMatrix = mat4.create();
  mat4.lookAt(
    viewMatrix,
    state.camera.position,
    focalPoint,
    state.camera.up,
  );
  for (let objListName in state.objects){
    state.objects[objListName].forEach((object) =>{
      // Choose to use our shader
      gl.useProgram(object.programInfo.program);

      // Update uniforms with state variables values
      {
        // assign perspective and view matricies
        gl.uniformMatrix4fv(object.programInfo.uniformLocations.projection, false, projectionMatrix);
        gl.uniformMatrix4fv(object.programInfo.uniformLocations.view, false, viewMatrix);

        // Update model transform
        // ===============================================
        // It is odd that the transformations are applied in reverse order
        // Objects are translated up so that y scaling is completely in the positive direction. We do not need y scaling below the table
        var modelMatrix = mat4.create();
        mat4.translate(modelMatrix, modelMatrix, object.position);
        mat4.translate(modelMatrix, modelMatrix, object.centroid);
        // mat4.mul( modelMatrix, modelMatrix, object.model.rotation.mat);
        mat4.scale(modelMatrix, modelMatrix, object.scale);
        mat4.translate(modelMatrix, modelMatrix, [
          -object.centroid[0],
          -object.centroid[1],
          -object.centroid[2],
        ]);

        // Set light uniforms
        gl.uniform3fv(object.programInfo.uniformLocations.light0Position, state.light[0].position);
        gl.uniform3fv(object.programInfo.uniformLocations.light0LookAt, state.light[0].lookat);
        gl.uniform3fv(object.programInfo.uniformLocations.viewPosition, state.camera.position);

        // Set material uniforms
        gl.uniform3fv(object.programInfo.uniformLocations.ambientColor, object.material.ambientColor);
        gl.uniform3fv(object.programInfo.uniformLocations.diffuseColor, object.material.diffuseColor);
        gl.uniform3fv(object.programInfo.uniformLocations.specularColor, object.material.specularColor);
        gl.uniform1f(object.programInfo.uniformLocations.shininess, object.material.shininess);
        // ===============================================
        // Update other uniforms 
        gl.uniformMatrix4fv(object.programInfo.uniformLocations.model, false, modelMatrix);
        // gl.uniform4fv( object.programInfo.uniformLocations.color, object.color,)
      }
      { // Draw 
        // Bind the buffer we want to draw
        gl.bindVertexArray(object.buffers.vao);
        // Draw the object
        const offset = 0; // Number of elements to skip before starting
        // gl.drawElements(gl.LINE_LOOP, object.buffers.numVertices, gl.UNSIGNED_SHORT, offset);
        gl.drawElements(gl.TRIANGLES, object.buffers.numVertices, gl.UNSIGNED_SHORT, offset);
      }
    });
  }
}

/**
 * @param {array of x,y,z vertices} vertices 
 */
function calculateCentroid(vertices) {

  var center = vec3.fromValues(0.0, 0.0, 0.0);
  for (let t = 0; t < vertices.length; t++) {
    vec3.add(center,center,vertices[t]);
  }
  vec3.scale(center,center,1/vertices.length);
  return center;

}
