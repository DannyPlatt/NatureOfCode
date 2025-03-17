/************************************
 * SHADER SETUP
 ************************************/
function transformShader(gl) {
  // Vertex shader source code
  const vsSource = `#version 300 es
in vec3 aPosition;
in vec3 aNormal; // Add normal attribute

uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;

out vec3 vNormal;   // Pass normal to fragment shader
out vec3 vFragPos;  // Pass fragment position to fragment shader

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);

    // Calculate the normal matrix and transform the normal
    mat3 normalMatrix = transpose(inverse(mat3(uModelMatrix)));
    vNormal = normalize(normalMatrix * aNormal);

    // Calculate fragment position in world space
    vFragPos = vec3(uModelMatrix * vec4(aPosition, 1.0));
}
`;

  // Fragment shader source code
  const fsSource = `#version 300 es
  precision highp float;
  
  in vec3 vNormal;   // Normal from vertex shader
  in vec3 vFragPos;  // Position from vertex shader
  
  uniform vec3 uLight0Position;  // Light position
  uniform vec3 uLight0LookAt;  // Light lookat direction
  uniform vec3 uViewPosition;   // Camera position
  
  uniform vec3 uAmbientColor;   // Material ambient color
  uniform vec3 uDiffuseColor;   // Material diffuse color
  uniform vec3 uSpecularColor;  // Material specular color
  uniform float uShininess;     // Material shininess
  
  out vec4 fragColor;
  
  void main() {
      // Normalize inputs
      vec3 norm = normalize(vNormal);
      vec3 light0Dir = normalize(uLight0Position - vFragPos);
      vec3 viewDir = normalize(uViewPosition - vFragPos);


      // ==== Overhead lighting ====
      // Ambient component
      vec3 ambient = uAmbientColor * uDiffuseColor * .99;
  
      // Diffuse component
      float diff = max(dot(norm, light0Dir), 0.0);
      vec3 diffuse = diff * uDiffuseColor * 0.99;
  
      // Specular component
      vec3 reflectDir = reflect(-light0Dir, norm);
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
      vec3 specular = spec * uSpecularColor * 0.2;

  
      vec3 result = ambient + diffuse + specular;
      fragColor = vec4(result, 1.0); // Set alpha to 1.0
  }
  `;

   // Create shader program
   const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

   // Collect shader info
   const programInfo = {
     program: shaderProgram,
     attribLocations: {
       vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
       vertexNormal: gl.getAttribLocation(shaderProgram, 'aNormal'), // Add this
     },
     uniformLocations: {
       projection: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
       view: gl.getUniformLocation(shaderProgram, 'uViewMatrix'),
       model: gl.getUniformLocation(shaderProgram, 'uModelMatrix'),
 
       // Material properties
       ambientColor: gl.getUniformLocation(shaderProgram, 'uAmbientColor'),
       diffuseColor: gl.getUniformLocation(shaderProgram, 'uDiffuseColor'),
       specularColor: gl.getUniformLocation(shaderProgram, 'uSpecularColor'),
       shininess: gl.getUniformLocation(shaderProgram, 'uShininess'),
 
       // Lighting properties
       light0Position: gl.getUniformLocation(shaderProgram, 'uLight0Position'),
       light0LookAt: gl.getUniformLocation(shaderProgram, 'uLight0LookAt'),
       viewPosition: gl.getUniformLocation(shaderProgram, 'uViewPosition'),
     },
   };

  // Check to see if we found the locations of our uniforms and attributes
  // Typos are a common source of failure
  // add testes for all your uniform locations 
  if (programInfo.attribLocations.vertexPosition === -1 ||
    programInfo.uniformLocations.color === -1 ||
    programInfo.uniformLocations.projection === -1 ||
    programInfo.uniformLocations.view === -1 ||
    programInfo.uniformLocations.model === -1) {
    printError('Shader Location Error', 'One or more of the uniform and attribute variables in the shaders could not be located');
  }
  return programInfo;
}

/**
 * @param  {} gl WebGL2 Context
 * @param  {string} vsSource Vertex shader GLSL source code
 * @param  {string} fsSource Fragment shader GLSL source code
 * @returns {} A shader program object. This is `null` on failure
 */
function initShaderProgram(gl, vsSource, fsSource) {
    // Use our custom function to load and compile the shader objects
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program by attaching and linking the shader objects
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to link the shader program' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

/**
 * Loads a shader from source into a shader object. This should later be linked into a program.
 * @param  {} gl WebGL2 context
 * @param  {} type Type of shader. Typically either VERTEX_SHADER or FRAGMENT_SHADER
 * @param  {string} source GLSL source code
 */
function loadShader(gl, type, source) {
    // Create a new shader object
    const shader = gl.createShader(type);

    // Send the source to the shader object
    gl.shaderSource(shader, source);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // Fail with an error message
        var typeStr = '';
        if (type === gl.VERTEX_SHADER) {
            typeStr = 'VERTEX';
        } else if (type === gl.FRAGMENT_SHADER) {
            typeStr = 'FRAGMENT';
        }
        printError('An error occurred compiling the shader: ' + typeStr, gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
