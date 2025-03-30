// pass in a attribute regarding position
const vertexShaderSource = `#version 300 es

layout(location=0) in vec4 aPosition;
layout(location=1) in vec4 aColor;
layout(location=2) in mat4 aModelMatrix;

out vec4 vColor;

void main()
{
  vColor = aColor;
  gl_Position = aModelMatrix * aPosition;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;

in vec4 vColor;

out vec4 fragColor;

void main()
{
  fragColor = vColor;
}`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const program = gl.createProgram();

// CREATE SHOW PROGRAM
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
  console.log("VertexShaderError: ",gl.getShaderInfoLog(vertexShader));
  console.log("FragmentShaderError: ",gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

const modelData = new Float32Array([
  //Position
    -1,-.7,
    0,.8,
    1,-.7,
])

const modelBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, modelBuffer);
gl.bufferData(gl.ARRAY_BUFFER, modelData, gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(0);

// init transfromData
const positionData = new Array();
const colorData = new Array();
const velData = new Array();
const objCount = 1;

for (let i = 0; i < objCount; i++){
  let scale = 0.02;
  let modelMatrix = mat4.create();
  let position = [(Math.random()-0.5) * 2, (Math.random()-.5)*2 , Math.random()-.5];
  velData.push(vec3.random(vec3.create(), 0.1));
  mat4.translate(modelMatrix,modelMatrix,vec3.fromValues(position[0], position[1], position[2]));
  mat4.scale(modelMatrix, modelMatrix, vec3.fromValues(scale, scale, scale));
  positionData.push([...modelMatrix]);

  let color = [Math.random(), Math.random(), Math.random()];
  colorData.push(color);
}

function render() {

  for (let i = 0; i < objCount; i++){
    // mat4.rotateZ(positionData[i], positionData[i], Math.random()*0.05);
    // mat4.translate(positionData[i], positionData[i], velData[i]);
    let position = mat4.getTranslation(vec3.create(), positionData[i]);
    mat4.translate(positionData[i], positionData[i], vec3.negate(vec3.create(),position))
    console.log("1", i, position);
    vec3.add(position, position, vec3.fromValues(0.1,0,0));
    if (position[0] < -1){
      position[0] = 1;
    } 
    if (position[0] > 1){
      position[0] = -1;
      console.log("HERE", position)
    }
    if (position[1] < -1){
      position[1] = 1;
    }
    if (position[1] > 1){
      position[1] = -1;
    }
    if (position[2] < -1){
      position[2] = 1;
    }
    if (position[2] > 1){
      position[2] = -1;
    }
    mat4.translate(positionData[i], positionData[i], position);
  }

  
  const transformBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionData.flat()), gl.STATIC_DRAW);
  const matLoc = 2

  gl.vertexAttribPointer(matLoc+0, 4, gl.FLOAT, false, 64, 0);
  gl.vertexAttribPointer(matLoc+1, 4, gl.FLOAT, false, 64, 16);
  gl.vertexAttribPointer(matLoc+2, 4, gl.FLOAT, false, 64, 32);
  gl.vertexAttribPointer(matLoc+3, 4, gl.FLOAT, false, 64, 48);

  gl.vertexAttribDivisor(matLoc + 0, 1);
  gl.vertexAttribDivisor(matLoc + 1, 1);
  gl.vertexAttribDivisor(matLoc + 2, 1);
  gl.vertexAttribDivisor(matLoc + 3, 1);

  gl.enableVertexAttribArray(matLoc + 0);
  gl.enableVertexAttribArray(matLoc + 1);
  gl.enableVertexAttribArray(matLoc + 2);
  gl.enableVertexAttribArray(matLoc + 3);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData.flat()), gl.STATIC_DRAW);

  // location, divisor(times to reuse transform values)
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
  gl.vertexAttribDivisor(1,1)
  gl.enableVertexAttribArray(1);

  gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, objCount);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
