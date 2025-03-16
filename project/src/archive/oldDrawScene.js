function drawScene(gl, programInfo, buffers, objects) {
    // ============ SETUP SCENE ==================
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0) // clear everything
    gl.enable(gl.DEPTH_TEST); 
    gl.depthFunc(gl.LEQUAL); // near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // clear canvas
    const fieldOfView = (50 * Math.PI) / 180; 
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
    // set the drawing positions to the "identity" point
    // which is the center of the scene

    // =============== PERFORM TRANSFORMATIONS =================
    // I'm not sure if this is supposed to ocure within the shader code
    // since the gpu is supposed to handle the matrix math
    
    objects.forEach(object => {
        const modelViewMatrix = mat4.create();
        const modelMatrix = mat4.create();
        // mat4.translate(
        //     modelViewMatrix, // destination matrix
        //     modelViewMatrix, // matrix to translate
        //     object.model.position,
        // );
        mat4.translate(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            object.model.position,
        );
        mat4.multiply(
            modelViewMatrix, // destination matrix
            modelViewMatrix, // matrix to translate
            object.model.rotation.mat,
        );
        // normal transformation
        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        


        // ============ SET SHADER VARIABLES =================
        
        //== SET ATTRIBUTES
        // Call function to tell webgl how to pull out the 
        // positions from the position buffers
        setPositionAttribute(gl, buffers, programInfo);
        setColorAttribute(gl, buffers, programInfo);
        setNormalAttribute(gl, buffers, programInfo);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

        // tell which Graphics program to use
        gl.useProgram(programInfo.program);

        //=== SET UNIFORMS 
        // feed uniform values into shader code
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix,
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix,
        );
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix,
        );

        // ========= DRAW ELEMENTS ==============
        {// I don't know why this is formatted like this
            const offset = 0;
            const vertexCount = 36;
            const type = gl.UNSIGNED_SHORT;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    });
}

// ============= SET ATTRIBUTES =======================
function setPositionAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);// activate the attribute
}

function setColorAttribute(gl, buffers, programInfo) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);// activate the attribute
}

function setNormalAttribute(gl, buffers, programInfo) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset,
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);// activate the attribute
}


