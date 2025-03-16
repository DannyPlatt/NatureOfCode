/**
 * Draws the scene. Should be called every frame
 * 
 * @param  {} gl WebGL2 context
 * @param {number} deltaTime Time between each rendering call
 */
function drawScene(gl, state) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set background
  // setup rasterization settings
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.CULL_FACE); // only draw font triangles
  // Clear the color and depth buffer with specified clear colour.
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
  //TODO: we have a 'shadow' that follows objects 
  //    I think it has to do with this clear function being in the wrong spot

  state.objects.forEach((object) => {
    // Choose to use our shader
    gl.useProgram(object.programInfo.program);

    // Update uniforms with state variables values
    {
      // setup projection matrix
      var projectionMatrix = mat4.create();
      var fovy = 75.0 * Math.PI / 180.0; // Vertical field of view in radians
      var aspect = state.canvas.clientWidth / state.canvas.clientHeight; // Aspect ratio of the canvas
      var near = 0.1; // Near clipping plane
      var far = 100.0; // Far clipping plane
      // Generate the projection matrix using perspective
      mat4.perspective(projectionMatrix, fovy, aspect, near, far);
      gl.uniformMatrix4fv(object.programInfo.uniformLocations.projection, false, projectionMatrix);

      // create focus point using car position + velocity to create a dynameic camera movement
      var focalPoint = vec3.create();
      vec3.subtract(focalPoint,state.objects[0].model.position, vec3.normalize(vec3.create(), state.objects[0].model.velocity));
        vec3.add(focalPoint, focalPoint, state.camera.focalHeight);
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
      gl.uniformMatrix4fv(object.programInfo.uniformLocations.view, false, viewMatrix);

      // Update model transform
      // ===============================================
      // It is odd that the transformations are applied in reverse order
      // Objects are translated up so that y scaling is completely in the positive direction. We do not need y scaling below the table
      var modelMatrix = mat4.create();
      mat4.translate(modelMatrix, modelMatrix, object.model.position);
      mat4.translate(modelMatrix, modelMatrix, object.centroid);
      mat4.mul( modelMatrix, modelMatrix, object.model.rotation.mat);
      mat4.scale(modelMatrix, modelMatrix, object.model.scale);
      mat4.translate(modelMatrix, modelMatrix, [
        -object.centroid[0],
        -object.centroid[1],
        -object.centroid[2],
      ]);

        // Set light uniforms
      gl.uniform3fv(object.programInfo.uniformLocations.light0Position, state.light[0].position);
      gl.uniform3fv(object.programInfo.uniformLocations.light0LookAt, state.light[0].lookat);
      gl.uniform3fv(object.programInfo.uniformLocations.light1Position, state.light[1].position);
      gl.uniform3fv(object.programInfo.uniformLocations.light1LookAt, state.light[1].lookat);
      gl.uniform3fv(object.programInfo.uniformLocations.viewPosition, state.camera.position);

      // Set material uniforms
      gl.uniform3fv(object.programInfo.uniformLocations.ambientColor, object.material.ambientColor);
      gl.uniform3fv(object.programInfo.uniformLocations.diffuseColor, object.material.diffuseColor);
      gl.uniform3fv(object.programInfo.uniformLocations.specularColor, object.material.specularColor);
      gl.uniform1f(object.programInfo.uniformLocations.shininess, object.material.shininess);
      // ===============================================
      // CHECK COLLISIONS
      var collisionName = "0";
      if (object.name == "cube"){ // Check for cube collisions (buildings)
        if(checkCollision(state.objects[0], object)) {
          var player = state.objects[0].model;
          console.log("+++++++++COLLISION WITH CUBE DETECTED++++++++++,");
          state.run = false; // End game
        } // FROM physics.js
      }
      // add gravity to all objects
      object.model.applyForce([0,-1.50,0])
      // TODO: ensure coin is not placed inside building
      if (object.name == "coin"){ // check for coin collisions
        if(checkCollision(state.objects[0], object)) {
          captureCoin(state, object);
        }
      }
      // Update other uniforms 
      gl.uniformMatrix4fv(object.programInfo.uniformLocations.model, false, modelMatrix);
      gl.uniform4fv( object.programInfo.uniformLocations.color, object.color,)
    }
    // update physics for object
    object.model.update(state);
    // Draw 
    {
      // Bind the buffer we want to draw
      gl.bindVertexArray(object.buffers.vao);
      // Draw the object
      const offset = 0; // Number of elements to skip before starting
      //gl.drawElements(gl.LINE_LOOP, object.buffers.numVertices, gl.UNSIGNED_SHORT, offset);
      gl.drawElements(gl.TRIANGLES, object.buffers.numVertices, gl.UNSIGNED_SHORT, offset);
    }
  });
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
function captureCoin(state, coin) {
  state.score++;
  console.log("++++++++ POINT AWARDED! +++++++++++++");
  // move coin to a random spot on the map
  var validPosition = false;
  const mapSize = state.objects[1].model.scale[0];
  const coinOffSet = 0.5;
  while (!validPosition) {
    validPosition = true; // only loop if a collision with a building has occured
    vec3.set(
      coin.model.position,
      (Math.random() * mapSize - mapSize/2) * coinOffSet,
      5,
      (Math.random() * mapSize - mapSize/2) * coinOffSet,
    );
    // check if it collides with any buildings
    state.objects.forEach(objectB=> {
      if (objectB.name =="cube" && checkHorizontalCollision(coin, objectB, 1.2)){
        validPosition = false;
      }
    });
  }
}

